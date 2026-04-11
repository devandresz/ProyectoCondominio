// ============================================================
// 📁 RUTA: frontend/src/paginas/ReservasPagina.jsx
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import {
	Plus,
	ChevronLeft,
	ChevronRight,
	Calendar,
	List,
	Clock,
	MapPin,
	XCircle,
	History,
	Eye,
	AlertCircle,
	CheckCircle,
	CalendarDays,
	Users,
	Banknote,
} from 'lucide-react';
import { useReservas } from '../hooks/useReservas.js';
import { reservasApi } from '../api/reservasApi.js';
import { Etiqueta, TarjetaMetrica } from '../componentes/ui/Etiquetas.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada } from '../componentes/ui/Formularios.jsx';
import { formatearFecha } from '../utilidades/formatearFecha.js';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { toast } from 'sonner';

const COLORES_AREA = [
	{
		bg: 'bg-violet-500/20',
		text: 'text-violet-300',
		border: 'border-violet-500/30',
		dot: 'bg-violet-400',
		cal: '#7c3aed',
	},
	{
		bg: 'bg-sky-500/20',
		text: 'text-sky-300',
		border: 'border-sky-500/30',
		dot: 'bg-sky-400',
		cal: '#0284c7',
	},
	{
		bg: 'bg-emerald-500/20',
		text: 'text-emerald-300',
		border: 'border-emerald-500/30',
		dot: 'bg-emerald-400',
		cal: '#059669',
	},
	{
		bg: 'bg-amber-500/20',
		text: 'text-amber-300',
		border: 'border-amber-500/30',
		dot: 'bg-amber-400',
		cal: '#d97706',
	},
];

const formatQ = (n) => `Q${Number(n ?? 0).toFixed(2)}`;
const limpiar = (s) => s?.toString().toLowerCase() ?? '';
const hoy = () => new Date();
const mismodia = (a, b) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];
const HORAS_DIA = Array.from(
	{ length: 15 },
	(_, i) => `${(i + 8).toString().padStart(2, '0')}:00`,
);

const HORAS_SELECTOR = Array.from({ length: 15 }, (_, i) => {
	const h = (i + 8).toString().padStart(2, '0');
	return `${h}:00`;
});

const fechaMinHoy = () => {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function horaAMin(h) {
	const [hh, mm] = h.split(':').map(Number);
	return hh * 60 + mm;
}
function inicioSemana(fecha) {
	const d = new Date(fecha);
	d.setDate(d.getDate() - d.getDay());
	d.setHours(0, 0, 0, 0);
	return d;
}
function diasDeSemana(inicio) {
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(inicio);
		d.setDate(d.getDate() + i);
		return d;
	});
}
function diasDesMes(year, month) {
	const primero = new Date(year, month, 1);
	const offset = primero.getDay();
	const total = new Date(year, month + 1, 0).getDate();
	const celdas = [];
	for (let i = 0; i < offset; i++) celdas.push(null);
	for (let d = 1; d <= total; d++) celdas.push(new Date(year, month, d));
	return celdas;
}

export default function ReservasPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { reservas, areas, cargando, error, cargarReservas, crear, cancelar } = useReservas();

	const [vistaCalendario, setVistaCalendario] = useState(true);
	const [modoCalendario, setModoCalendario] = useState('semana');
	const [fechaRef, setFechaRef] = useState(hoy());

	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [historial, setHistorial] = useState([]);
	const [filaActiva, setFilaActiva] = useState(null);

	const [paso, setPaso] = useState(1);
	const [areaElegida, setAreaElegida] = useState(null);
	const [wizForm, setWizForm] = useState({
		fechaReserva: '',
		horaInicio: '',
		horaFin: '',
		numeroBoleta: '',
	});
	const [disponible, setDisponible] = useState(null);
	const [costo, setCosto] = useState(null);
	const [verificando, setVerificando] = useState(false);
	const [errorWiz, setErrorWiz] = useState('');

	const [motivoCancelar, setMotivoCancelar] = useState('');
	const [errorCancelar, setErrorCancelar] = useState('');

	const debRef = useRef(null);

	const colorDeArea = useCallback(
		(idArea) => {
			const idx = areas.findIndex((a) => a.ID_AREA === idArea);
			return COLORES_AREA[idx % COLORES_AREA.length] ?? COLORES_AREA[0];
		},
		[areas],
	);

	useEffect(() => {
		if (
			paso !== 2 ||
			!areaElegida ||
			!wizForm.fechaReserva ||
			!wizForm.horaInicio ||
			!wizForm.horaFin
		) {
			setDisponible(null);
			setCosto(null);
			return;
		}
		clearTimeout(debRef.current);
		debRef.current = setTimeout(async () => {
			setVerificando(true);
			try {
				const [dispRes, costoRes] = await Promise.all([
					reservasApi.verificarDisponibilidad({
						idArea: areaElegida.ID_AREA,
						fechaReserva: wizForm.fechaReserva,
						horaInicio: wizForm.horaInicio,
						horaFin: wizForm.horaFin,
					}),
					reservasApi.calcularCosto({
						idArea: areaElegida.ID_AREA,
						horaInicio: wizForm.horaInicio,
						horaFin: wizForm.horaFin,
					}),
				]);
				setDisponible(dispRes.data.disponible);
				setCosto(costoRes.data);
			} catch {
				setDisponible(null);
				setCosto(null);
			} finally {
				setVerificando(false);
			}
		}, 600);
		return () => clearTimeout(debRef.current);
	}, [paso, areaElegida, wizForm.fechaReserva, wizForm.horaInicio, wizForm.horaFin]);

	const abrirWizard = () => {
		setPaso(1);
		setAreaElegida(null);
		setWizForm({ fechaReserva: '', horaInicio: '', horaFin: '', numeroBoleta: '' });
		setDisponible(null);
		setCosto(null);
		setErrorWiz('');
		setModal('wizard');
	};

	const guardarReserva = async () => {
		setErrorWiz('');
		try {
			await crear({
				idArea: areaElegida.ID_AREA,
				fechaReserva: wizForm.fechaReserva,
				horaInicio: wizForm.horaInicio,
				horaFin: wizForm.horaFin,
				numeroBoleta: wizForm.numeroBoleta.trim(),
			});
			setModal(null);
			toast.success('Reserva creada exitosamente');
		} catch (err) {
			setErrorWiz(extraerError(err));
			toast.error('Error al crear la reserva');
		}
	};

	const abrirVer = (r) => {
		setSeleccion(r);
		setModal('ver');
	};

	const abrirCancelar = (r) => {
		setSeleccion(r);
		setMotivoCancelar('');
		setErrorCancelar('');
		setModal('cancelar');
	};
	const confirmarCancelar = async () => {
		if (!motivoCancelar.trim()) {
			setErrorCancelar('El motivo es obligatorio.');
			return;
		}
		try {
			await cancelar(seleccion.ID_RESERVA, motivoCancelar.trim());
			setModal(null);
			toast.success('Reserva cancelada exitosamente');
		} catch (err) {
			setErrorCancelar(extraerError(err));
			toast.error('Error al cancelar la reserva');
		}
	};

	const abrirHistorial = async (r) => {
		setSeleccion(r);
		try {
			const res = await reservasApi.historialCancelaciones(r.ID_RESERVA);
			setHistorial(res.data);
		} catch {
			setHistorial([]);
		}
		setModal('historial');
	};

	const navAnterior = () => {
		const d = new Date(fechaRef);
		if (modoCalendario === 'semana') d.setDate(d.getDate() - 7);
		else d.setMonth(d.getMonth() - 1);
		setFechaRef(d);
	};
	const navSiguiente = () => {
		const d = new Date(fechaRef);
		if (modoCalendario === 'semana') d.setDate(d.getDate() + 7);
		else d.setMonth(d.getMonth() + 1);
		setFechaRef(d);
	};
	const irHoy = () => setFechaRef(hoy());

	const reservasEnDia = (fecha) =>
		reservas.filter((r) => {
			if (r.ESTADO === 'CANCELADA') return false;
			const f = new Date(r.FECHA_RESERVA);
			return mismodia(f, fecha);
		});

	const apartadas = reservas.filter((r) => r.ESTADO === 'APARTADA').length;
	const canceladas = reservas.filter((r) => r.ESTADO === 'CANCELADA').length;

	const termino = limpiar(filtroGlobal);
	const filtradas = termino
		? reservas.filter(
				(r) =>
					limpiar(r.NOMBRE_AREA).includes(termino) ||
					limpiar(r.ESTADO).includes(termino) ||
					limpiar(r.NOMBRE_USUARIO).includes(termino) ||
					limpiar(r.NUMERO_BOLETA).includes(termino),
			)
		: reservas;

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando reservas...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total reservas"
					valor={reservas.length}
					Icono={CalendarDays}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Apartadas"
					valor={apartadas}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Canceladas"
					valor={canceladas}
					Icono={XCircle}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Áreas activas"
					valor={areas.length}
					Icono={MapPin}
					fondo="bg-violet-500/10"
				/>
			</div>

			{areas.length > 0 && (
				<div className="flex items-center gap-3 flex-wrap">
					{areas.map((area, i) => {
						const color = COLORES_AREA[i % COLORES_AREA.length];
						return (
							<div
								key={area.ID_AREA}
								className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${color.bg} ${color.border} ${color.text}`}
							>
								<span className={`w-2 h-2 rounded-full ${color.dot}`} />
								{area.NOMBRE}
								<span className="opacity-60">· {formatQ(area.PRECIO_POR_HORA)}/hr</span>
							</div>
						);
					})}
				</div>
			)}

			<div className="border border-borde rounded-xl overflow-hidden shadow-sm bg-fondo">
				<div className="flex items-center justify-between px-5 py-3 border-b border-borde bg-tarjeta/50">
					<div className="flex items-center gap-2">
						<button
							onClick={navAnterior}
							className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-primario transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button
							onClick={navSiguiente}
							className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-primario transition-colors"
						>
							<ChevronRight className="w-4 h-4" />
						</button>
						<h2 className="text-sm font-bold text-primario ml-1">
							{modoCalendario === 'semana'
								? (() => {
										const inicio = inicioSemana(fechaRef);
										const fin = new Date(inicio);
										fin.setDate(fin.getDate() + 6);
										return `${inicio.getDate()} – ${fin.getDate()} ${MESES[fin.getMonth()]} ${fin.getFullYear()}`;
									})()
								: `${MESES[fechaRef.getMonth()]} ${fechaRef.getFullYear()}`}
						</h2>
						<button
							onClick={irHoy}
							className="ml-2 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-borde text-zinc-400 hover:text-primario hover:border-zinc-600 transition-colors"
						>
							Hoy
						</button>
					</div>

					<div className="flex items-center gap-2">
						<div className="flex items-center border border-borde rounded-lg overflow-hidden">
							<button
								onClick={() => setModoCalendario('semana')}
								className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${modoCalendario === 'semana' ? 'bg-primario text-fondo' : 'text-zinc-400 hover:text-primario'}`}
							>
								Semana
							</button>
							<button
								onClick={() => setModoCalendario('mes')}
								className={`px-3 py-1.5 text-[11px] font-bold transition-colors ${modoCalendario === 'mes' ? 'bg-primario text-fondo' : 'text-zinc-400 hover:text-primario'}`}
							>
								Mes
							</button>
						</div>

						<div className="flex items-center border border-borde rounded-lg overflow-hidden">
							<button
								onClick={() => setVistaCalendario(true)}
								className={`p-1.5 transition-colors ${vistaCalendario ? 'bg-primario text-fondo' : 'text-zinc-400 hover:text-primario'}`}
							>
								<Calendar className="w-3.5 h-3.5" />
							</button>
							<button
								onClick={() => setVistaCalendario(false)}
								className={`p-1.5 transition-colors ${!vistaCalendario ? 'bg-primario text-fondo' : 'text-zinc-400 hover:text-primario'}`}
							>
								<List className="w-3.5 h-3.5" />
							</button>
						</div>

						<BtnPrimario onClick={abrirWizard}>
							<Plus className="w-4 h-4" /> Nueva Reserva
						</BtnPrimario>
					</div>
				</div>

				{vistaCalendario && (
					<>
						{modoCalendario === 'semana' &&
							(() => {
								const inicio = inicioSemana(fechaRef);
								const dias = diasDeSemana(inicio);
								return (
									<div className="overflow-x-auto">
										<div className="min-w-[700px]">
											<div className="grid grid-cols-8 border-b border-borde">
												<div className="px-3 py-2 text-[10px] text-zinc-600 font-bold uppercase" />
												{dias.map((dia, i) => {
													const esHoy = mismodia(dia, hoy());
													return (
														<div
															key={i}
															className={`px-3 py-2 text-center border-l border-borde ${esHoy ? 'bg-primario/5' : ''}`}
														>
															<p className="text-[10px] font-bold uppercase text-zinc-500">
																{DIAS_CORTO[dia.getDay()]}
															</p>
															<p
																className={`text-lg font-bold font-title mt-0.5 ${esHoy ? 'text-primario' : 'text-zinc-300'}`}
															>
																{dia.getDate()}
															</p>
														</div>
													);
												})}
											</div>

											<div className="max-h-[480px] overflow-y-auto custom-scrollbar">
												{HORAS_DIA.map((hora) => (
													<div
														key={hora}
														className="grid grid-cols-8 border-b border-borde/40 min-h-[52px]"
													>
														<div className="px-3 py-1 text-[10px] text-zinc-600 font-mono pt-2">{hora}</div>
														{dias.map((dia, di) => {
															const esHoy = mismodia(dia, hoy());
															const resEnHora = reservas.filter((r) => {
																if (r.ESTADO === 'CANCELADA') return false;
																const f = new Date(r.FECHA_RESERVA);
																if (!mismodia(f, dia)) return false;
																const ini = horaAMin(r.HORA_INICIO);
																const fin = horaAMin(r.HORA_FIN);
																const h = horaAMin(hora);
																return h >= ini && h < fin;
															});
															return (
																<div
																	key={di}
																	className={`border-l border-borde/40 px-1 py-1 space-y-0.5 ${esHoy ? 'bg-primario/3' : ''}`}
																>
																	{resEnHora.map((r) => {
																		const color = colorDeArea(r.ID_AREA);
																		return (
																			<button
																				key={r.ID_RESERVA}
																				onClick={() => abrirVer(r)}
																				className={`w-full text-left px-2 py-1 rounded text-[10px] font-bold truncate border transition-opacity hover:opacity-80 ${color.bg} ${color.text} ${color.border}`}
																			>
																				{r.NOMBRE_AREA}
																			</button>
																		);
																	})}
																</div>
															);
														})}
													</div>
												))}
											</div>
										</div>
									</div>
								);
							})()}

						{modoCalendario === 'mes' &&
							(() => {
								const celdas = diasDesMes(fechaRef.getFullYear(), fechaRef.getMonth());
								return (
									<div>
										<div className="grid grid-cols-7 border-b border-borde">
											{DIAS_CORTO.map((d) => (
												<div
													key={d}
													className="px-3 py-2 text-center text-[10px] font-bold uppercase text-zinc-500"
												>
													{d}
												</div>
											))}
										</div>
										<div className="grid grid-cols-7">
											{celdas.map((dia, i) => {
												if (!dia)
													return (
														<div key={i} className="border-r border-b border-borde/30 min-h-[100px]" />
													);
												const esHoy = mismodia(dia, hoy());
												const resHoy = reservasEnDia(dia);
												const maxShow = 3;
												return (
													<div
														key={i}
														className={`border-r border-b border-borde/40 min-h-[100px] p-2 ${esHoy ? 'bg-primario/5' : 'hover:bg-zinc-900/50'} transition-colors`}
													>
														<p
															className={`text-[12px] font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${esHoy ? 'bg-primario text-fondo' : 'text-zinc-400'}`}
														>
															{dia.getDate()}
														</p>
														<div className="space-y-0.5">
															{resHoy.slice(0, maxShow).map((r) => {
																const color = colorDeArea(r.ID_AREA);
																return (
																	<button
																		key={r.ID_RESERVA}
																		onClick={() => abrirVer(r)}
																		className={`w-full text-left px-1.5 py-0.5 rounded text-[9px] font-bold truncate border ${color.bg} ${color.text} ${color.border} hover:opacity-80 transition-opacity`}
																	>
																		{r.HORA_INICIO} {r.NOMBRE_AREA}
																	</button>
																);
															})}
															{resHoy.length > maxShow && (
																<p className="text-[9px] text-zinc-500 pl-1">+{resHoy.length - maxShow} más</p>
															)}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								);
							})()}
					</>
				)}

				{!vistaCalendario && (
					<div className="overflow-x-auto">
						<table className="w-full">
							<CabeceraTabla
								columnas={
									esAdmin
										? ['#', 'Área', 'Residente', 'Fecha', 'Horario', 'Monto', 'Estado', 'Acciones']
										: ['#', 'Área', 'Fecha', 'Horario', 'Monto', 'Estado', 'Acciones']
								}
							/>
							<tbody>
								{filtradas.length === 0 ? (
									<tr>
										<td
											colSpan={esAdmin ? 8 : 7}
											className="px-4 py-10 text-center text-secundario text-sm"
										>
											No hay reservas registradas.
										</td>
									</tr>
								) : (
									filtradas.map((r) => {
										const color = colorDeArea(r.ID_AREA);
										return (
											<Fila
												key={r.ID_RESERVA}
												seleccionada={filaActiva === r.ID_RESERVA}
												onClick={() => setFilaActiva(filaActiva === r.ID_RESERVA ? null : r.ID_RESERVA)}
											>
												<Celda mono>{r.ID_RESERVA}</Celda>
												<Celda>
													<span
														className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${color.bg} ${color.text} ${color.border}`}
													>
														<span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
														{r.NOMBRE_AREA}
													</span>
												</Celda>
												{esAdmin && <Celda>{r.NOMBRE_USUARIO ?? '—'}</Celda>}
												<Celda>{formatearFecha(r.FECHA_RESERVA)}</Celda>
												<Celda mono>
													{r.HORA_INICIO} – {r.HORA_FIN}
												</Celda>
												<Celda>
													<span className="text-emerald-400 font-bold font-mono">
														{formatQ(r.MONTO_PAGADO)}
													</span>
												</Celda>
												<Celda>
													<Etiqueta texto={r.ESTADO} />
												</Celda>
												<td className="px-4 py-3">
													<div className="flex items-center gap-1">
														<BtnAccion onClick={() => abrirVer(r)} Icono={Eye} titulo="Ver detalle" />
														{esAdmin && r.ESTADO === 'APARTADA' && (
															<>
																<BtnAccion
																	onClick={() => abrirCancelar(r)}
																	Icono={XCircle}
																	titulo="Cancelar"
																	colorHover="hover:text-red-400"
																/>
																<BtnAccion
																	onClick={() => abrirHistorial(r)}
																	Icono={History}
																	titulo="Historial cancelaciones"
																/>
															</>
														)}
													</div>
												</td>
											</Fila>
										);
									})
								)}
							</tbody>
						</table>
						<PieTabla mostrados={filtradas.length} total={reservas.length} unidad="reservas" />
					</div>
				)}
			</div>

			{modal === 'wizard' && (
				<Modal titulo="Nueva Reserva" alCerrar={() => setModal(null)}>
					<div className="flex items-center gap-2 mb-6">
						{['Área', 'Horario', 'Confirmar'].map((label, i) => {
							const num = i + 1;
							const activo = paso === num;
							const listo = paso > num;
							return (
								<div key={i} className="flex items-center gap-2 flex-1">
									<div className={`flex items-center gap-2 ${i > 0 ? 'flex-1' : ''}`}>
										{i > 0 && <div className={`h-px flex-1 ${listo ? 'bg-primario' : 'bg-borde'}`} />}
										<div className={`flex items-center gap-1.5`}>
											<div
												className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors
                                                ${activo ? 'bg-primario text-fondo' : listo ? 'bg-emerald-500 text-fondo' : 'bg-zinc-800 text-zinc-500'}`}
											>
												{listo ? '✓' : num}
											</div>
											<span
												className={`text-[11px] font-bold ${activo ? 'text-primario' : 'text-zinc-500'}`}
											>
												{label}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{paso === 1 && (
						<div className="space-y-3">
							<p className="text-xs text-zinc-500 mb-4">
								Selecciona el área social que deseas reservar.
							</p>
							<div className="grid grid-cols-2 gap-3">
								{areas.map((area, i) => {
									const color = COLORES_AREA[i % COLORES_AREA.length];
									const elegida = areaElegida?.ID_AREA === area.ID_AREA;
									return (
										<button
											key={area.ID_AREA}
											onClick={() => setAreaElegida(area)}
											className={`text-left p-4 rounded-xl border transition-all ${
												elegida
													? `${color.bg} ${color.border} shadow-md`
													: 'border-borde bg-fondo hover:border-zinc-600 hover:bg-zinc-900/50'
											}`}
										>
											<div
												className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color.bg} ${color.border} border`}
											>
												<MapPin className={`w-4 h-4 ${color.text}`} />
											</div>
											<p className={`text-sm font-bold mb-1 ${elegida ? color.text : 'text-primario'}`}>
												{area.NOMBRE}
											</p>
											<p className="text-[11px] text-zinc-500 leading-snug mb-2">
												{area.DESCRIPCION ?? 'Área social del condominio'}
											</p>
											<div className="flex items-center gap-1 text-[11px] text-zinc-400">
												<Clock className="w-3 h-3" />
												<span>
													{area.HORA_APERTURA} – {area.HORA_CIERRE}
												</span>
											</div>
											<p
												className={`text-sm font-bold font-mono mt-1 ${elegida ? color.text : 'text-emerald-400'}`}
											>
												{formatQ(area.PRECIO_POR_HORA)}
												<span className="text-[10px] font-normal text-zinc-500">/hr</span>
											</p>
										</button>
									);
								})}
							</div>
							<div className="flex justify-end pt-2">
								<button
									onClick={() => {
										if (areaElegida) {
											setPaso(2);
											setErrorWiz('');
										} else setErrorWiz('Selecciona un área para continuar.');
									}}
									className="px-4 py-2 text-sm font-bold rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors disabled:opacity-50"
								>
									Siguiente →
								</button>
							</div>
							{errorWiz && (
								<p className="text-red-400 text-xs flex items-center gap-1">
									<AlertCircle className="w-3.5 h-3.5" />
									{errorWiz}
								</p>
							)}
						</div>
					)}

					{paso === 2 && (
						<div className="space-y-4">
							<div
								className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${colorDeArea(areaElegida.ID_AREA).bg} ${colorDeArea(areaElegida.ID_AREA).border} ${colorDeArea(areaElegida.ID_AREA).text}`}
							>
								<MapPin className="w-3.5 h-3.5" /> {areaElegida.NOMBRE}
								<span className="opacity-60 ml-auto">{formatQ(areaElegida.PRECIO_POR_HORA)}/hr</span>
							</div>

							<Campo etiqueta="Fecha de reserva">
								<Entrada
									type="date"
									required
									min={fechaMinHoy()}
									value={wizForm.fechaReserva}
									onChange={(e) => setWizForm({ ...wizForm, fechaReserva: e.target.value })}
								/>
							</Campo>

							<div className="grid grid-cols-2 gap-3">
								<Campo etiqueta="Hora inicio">
									<select
										required
										value={wizForm.horaInicio}
										onChange={(e) => setWizForm({ ...wizForm, horaInicio: e.target.value, horaFin: '' })}
										className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none focus:border-zinc-500 transition-colors"
									>
										<option value="">Seleccionar...</option>
										{(() => {
											const esHoy = wizForm.fechaReserva === fechaMinHoy();
											const horaActualMin = esHoy
												? new Date().getHours() * 60 + new Date().getMinutes()
												: 0;
											return HORAS_SELECTOR.slice(0, -1)
												.filter((h) => horaAMin(h) > horaActualMin)
												.map((h) => (
													<option key={h} value={h}>
														{h}
													</option>
												));
										})()}
									</select>
								</Campo>
								<Campo etiqueta="Hora fin">
									<select
										required
										value={wizForm.horaFin}
										disabled={!wizForm.horaInicio}
										onChange={(e) => setWizForm({ ...wizForm, horaFin: e.target.value })}
										className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
									>
										<option value="">Seleccionar...</option>
										{wizForm.horaInicio &&
											HORAS_SELECTOR.filter((h) => horaAMin(h) > horaAMin(wizForm.horaInicio)).map(
												(h) => (
													<option key={h} value={h}>
														{h}
													</option>
												),
											)}
									</select>
								</Campo>
							</div>

							{verificando && (
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-borde text-xs text-zinc-400">
									<div className="w-3 h-3 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
									Verificando disponibilidad...
								</div>
							)}
							{!verificando && disponible === true && costo && (
								<div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
									<div className="flex items-center gap-2 text-emerald-400">
										<CheckCircle className="w-3.5 h-3.5" />
										<span className="font-bold">Disponible</span>
									</div>
									<span className="text-emerald-400 font-bold font-mono">
										{costo.horas}h · {formatQ(costo.costoTotal)}
									</span>
								</div>
							)}
							{!verificando && disponible === false && (
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
									<XCircle className="w-3.5 h-3.5" />
									<span className="font-bold">No disponible en ese horario</span>
								</div>
							)}

							<div className="flex gap-2 pt-1">
								<button
									onClick={() => setPaso(1)}
									className="flex-1 px-4 py-2 text-sm border rounded-lg border-borde text-secundario hover:text-primario transition-colors"
								>
									← Atrás
								</button>
								<button
									onClick={() => {
										if (!wizForm.fechaReserva || !wizForm.horaInicio || !wizForm.horaFin) {
											setErrorWiz('Completa todos los campos.');
											return;
										}
										if (wizForm.fechaReserva < fechaMinHoy()) {
											setErrorWiz('La fecha no puede ser anterior a hoy.');
											return;
										}
										if (disponible === false) {
											setErrorWiz('El horario no está disponible.');
											return;
										}
										if (!disponible) {
											setErrorWiz('Verifica la disponibilidad antes de continuar.');
											return;
										}
										setPaso(3);
										setErrorWiz('');
									}}
									className="flex-1 px-4 py-2 text-sm font-bold rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors"
								>
									Siguiente →
								</button>
							</div>
							{errorWiz && (
								<p className="text-red-400 text-xs flex items-center gap-1">
									<AlertCircle className="w-3.5 h-3.5" />
									{errorWiz}
								</p>
							)}
						</div>
					)}

					{paso === 3 &&
						(() => {
							const horasCalc = (horaAMin(wizForm.horaFin) - horaAMin(wizForm.horaInicio)) / 60;
							const costoCalc =
								costo?.costoTotal ?? horasCalc * Number(areaElegida.PRECIO_POR_HORA ?? 0);
							return (
								<div className="space-y-4">
									<div className="rounded-xl border border-borde overflow-hidden">
										<div className="px-4 py-2.5 bg-tarjeta/50 border-b border-borde">
											<span className="text-[11px] font-bold uppercase tracking-wide text-secundario">
												Resumen de reserva
											</span>
										</div>
										<div className="divide-y divide-borde">
											{[
												['Área', areaElegida.NOMBRE],
												['Fecha', formatearFecha(wizForm.fechaReserva + 'T12:00:00')],
												['Horario', `${wizForm.horaInicio} – ${wizForm.horaFin}`],
												['Duración', `${horasCalc} hora(s)`],
											].map(([lbl, val]) => (
												<div key={lbl} className="flex justify-between px-4 py-2.5 text-sm">
													<span className="text-secundario">{lbl}</span>
													<span className="text-primario font-medium">{val}</span>
												</div>
											))}
											<div className="flex justify-between px-4 py-3 bg-tarjeta/50">
												<span className="text-[12px] font-bold uppercase tracking-wide text-secundario">
													Total
												</span>
												<span className="text-base font-bold font-mono text-emerald-400">
													{formatQ(costoCalc)}
												</span>
											</div>
										</div>
									</div>

									<Campo etiqueta="Número de Boleta de Pago">
										<Entrada
											required
											placeholder="Ej: BOL-2026-001"
											value={wizForm.numeroBoleta}
											onChange={(e) => setWizForm({ ...wizForm, numeroBoleta: e.target.value })}
										/>
									</Campo>
									<p className="text-[11px] text-zinc-600 -mt-2">
										Ingresa el número de la boleta con la que realizaste el pago en banco.
									</p>

									{errorWiz && (
										<p className="text-red-400 text-xs flex items-center gap-1">
											<AlertCircle className="w-3.5 h-3.5" />
											{errorWiz}
										</p>
									)}

									<div className="flex gap-2 pt-1">
										<button
											onClick={() => setPaso(2)}
											className="flex-1 px-4 py-2 text-sm border rounded-lg border-borde text-secundario hover:text-primario transition-colors"
										>
											← Atrás
										</button>
										<button
											onClick={() => {
												if (!wizForm.numeroBoleta.trim()) {
													setErrorWiz('El número de boleta es obligatorio.');
													return;
												}
												guardarReserva();
											}}
											className="flex-1 px-4 py-2 text-sm font-bold rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
										>
											<Banknote className="w-4 h-4" /> Confirmar Reserva
										</button>
									</div>
								</div>
							);
						})()}
				</Modal>
			)}

			{modal === 'ver' && seleccion && (
				<Modal titulo={`Reserva #${seleccion.ID_RESERVA}`} alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['Área', seleccion.NOMBRE_AREA],
							esAdmin ? ['Residente', seleccion.NOMBRE_USUARIO ?? '—'] : null,
							['Fecha', formatearFecha(seleccion.FECHA_RESERVA)],
							['Horario', `${seleccion.HORA_INICIO} – ${seleccion.HORA_FIN}`],
							['Boleta', seleccion.NUMERO_BOLETA],
							['Monto', formatQ(seleccion.MONTO_PAGADO)],
							['Estado', seleccion.ESTADO],
							['Creada', formatearFecha(seleccion.FECHA_CREACION)],
						]
							.filter(Boolean)
							.map(([lbl, val]) => (
								<div key={lbl} className="flex justify-between border-b border-borde pb-2">
									<span className="text-secundario">{lbl}</span>
									<span className="text-primario font-medium">
										{lbl === 'Estado' ? <Etiqueta texto={val} /> : val}
									</span>
								</div>
							))}
					</div>
					{esAdmin && seleccion.ESTADO === 'APARTADA' && (
						<div className="flex gap-2 mt-5">
							<button
								onClick={() => {
									setModal(null);
									setTimeout(() => abrirCancelar(seleccion), 50);
								}}
								className="flex-1 px-4 py-2 text-sm font-bold rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
							>
								Cancelar reserva
							</button>
						</div>
					)}
				</Modal>
			)}

			{modal === 'cancelar' && seleccion && (
				<Modal titulo="Cancelar Reserva" alCerrar={() => setModal(null)}>
					<div className="space-y-4">
						<div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-sm text-red-400">
							Estás a punto de cancelar la reserva del área <strong>{seleccion.NOMBRE_AREA}</strong>{' '}
							del <strong>{formatearFecha(seleccion.FECHA_RESERVA)}</strong>.
						</div>
						<Campo etiqueta="Motivo de cancelación">
							<Entrada
								required
								placeholder="Ej: Mantenimiento programado del área"
								value={motivoCancelar}
								onChange={(e) => setMotivoCancelar(e.target.value)}
							/>
						</Campo>
						{errorCancelar && (
							<p className="text-red-400 text-xs flex items-center gap-1">
								<AlertCircle className="w-3.5 h-3.5" />
								{errorCancelar}
							</p>
						)}
						<BotonesModal
							alCancelar={() => setModal(null)}
							alGuardar={confirmarCancelar}
							textoGuardar="Confirmar cancelación"
							IconoGuardar={XCircle}
						/>
					</div>
				</Modal>
			)}

			{modal === 'historial' && seleccion && (
				<Modal
					titulo={`Historial — Reserva #${seleccion.ID_RESERVA}`}
					alCerrar={() => setModal(null)}
				>
					{historial.length === 0 ? (
						<p className="text-secundario text-sm text-center py-4">
							Sin cancelaciones registradas.
						</p>
					) : (
						<div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
							{historial.map((h) => (
								<div
									key={h.ID_AUDITORIA}
									className="p-3 rounded-lg border border-borde bg-fondo space-y-1"
								>
									<div className="flex items-center justify-between">
										<span className="text-xs font-bold text-primario">{h.NOMBRE_ADMIN}</span>
										<span className="text-[10px] text-zinc-600">{formatearFecha(h.FECHA_ACCION)}</span>
									</div>
									<p className="text-xs text-zinc-400">{h.MOTIVO}</p>
								</div>
							))}
						</div>
					)}
				</Modal>
			)}
		</div>
	);
}
