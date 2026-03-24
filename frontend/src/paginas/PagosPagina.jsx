import { useState, useEffect, useRef } from 'react';
import {
	Plus,
	Eye,
	CreditCard,
	CheckCircle,
	Clock,
	Receipt,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Wallet,
} from 'lucide-react';
import { usePagos } from '../hooks/usePagos.js';
import { pagosApi } from '../api/pagosApi.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada } from '../componentes/ui/Formularios.jsx';
import { formatearFecha } from '../utilidades/formatearFecha.js';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';
const formatQ = (monto) => `Q${Number(monto ?? 0).toFixed(2)}`;

export default function PagosPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const {
		pagos,
		estadoCuenta,
		cargando,
		cargandoEstado,
		error,
		cargarPagos,
		cargarEstadoCuenta,
		crear,
	} = usePagos();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'crear' | 'ver'
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [detalleExpandido, setDetalleExpandido] = useState(null);
	const [pagoDetalle, setPagoDetalle] = useState(null);
	const [cargandoDetalle, setCargandoDetalle] = useState(false);

	const debounceRef = useRef(null);

	const [form, setForm] = useState({
		idPropiedad: '',
		numeroBoleta: '',
		observaciones: '',
	});

	// Debounce para cargar estado de cuenta al escribir idPropiedad
	useEffect(() => {
		if (modal !== 'crear') return;
		clearTimeout(debounceRef.current);
		if (!form.idPropiedad) {
			cargarEstadoCuenta(null);
			return;
		}
		debounceRef.current = setTimeout(() => {
			cargarEstadoCuenta(form.idPropiedad);
		}, 500);
		return () => clearTimeout(debounceRef.current);
	}, [form.idPropiedad, modal]);

	// Al abrir modal: residente carga su propio estado de cuenta (sin idPropiedad en query)
	const abrirCrear = () => {
		setForm({ idPropiedad: '', numeroBoleta: '', observaciones: '' });
		setErrorModal('');
		// Residente: cargar estado de cuenta propio de inmediato
		if (!esAdmin) cargarEstadoCuenta();
		setModal('crear');
	};

	const abrirVer = async (pago) => {
		setSeleccion(pago);
		setPagoDetalle(null);
		setCargandoDetalle(true);
		setModal('ver');
		try {
			const res = await pagosApi.obtenerPorId(pago.ID_PAGO);
			setPagoDetalle(res.data);
		} catch {
			setPagoDetalle(null);
		} finally {
			setCargandoDetalle(false);
		}
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');

		// Validar que haya cargos pendientes antes de intentar
		if (estadoCuenta && estadoCuenta.cantidadCargosPendientes === 0) {
			setErrorModal('Esta propiedad no tiene cargos pendientes.');
			return;
		}

		try {
			const datos = {
				idPropiedad: esAdmin ? Number(form.idPropiedad) : undefined,
				numeroBoleta: form.numeroBoleta.trim(),
				observaciones: form.observaciones.trim() || undefined,
			};
			// Residente: el backend usa su usuario para identificar la propiedad (RN-F4)
			// Admin: envía idPropiedad explícitamente
			if (!esAdmin) delete datos.idPropiedad;

			await crear(
				esAdmin ? datos : { numeroBoleta: datos.numeroBoleta, observaciones: datos.observaciones },
			);
			setModal(null);
			cargarPagos();
		} catch (err) {
			setErrorModal(extraerError(err));
		}
	};

	// Filtrado de tabla
	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? pagos.filter(
				(p) =>
					limpiar(p.NUMERO_BOLETA).includes(termino) ||
					limpiar(p.NUMERO_PROPIEDAD).includes(termino) ||
					limpiar(p.NOMBRE_USUARIO).includes(termino) ||
					limpiar(p.MONTO_TOTAL?.toString()).includes(termino),
			)
		: pagos;

	// Métricas
	const totalPagado = pagos.reduce((acc, p) => acc + Number(p.MONTO_TOTAL ?? 0), 0);
	const pagosEsteMes = pagos.filter((p) => {
		const fecha = new Date(p.FECHA_PAGO);
		const ahora = new Date();
		return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
	}).length;

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando pagos...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			{/* Métricas */}
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total pagos"
					valor={pagos.length}
					Icono={Receipt}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Este mes"
					valor={pagosEsteMes}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Monto total"
					valor={formatQ(totalPagado)}
					Icono={Wallet}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Recaudado hoy"
					valor={formatQ(
						pagos
							.filter((p) => {
								const f = new Date(p.FECHA_PAGO);
								const h = new Date();
								return (
									f.getDate() === h.getDate() &&
									f.getMonth() === h.getMonth() &&
									f.getFullYear() === h.getFullYear()
								);
							})
							.reduce((acc, p) => acc + Number(p.MONTO_TOTAL ?? 0), 0),
					)}
					Icono={CreditCard}
					fondo="bg-violet-500/10"
				/>
			</div>

			{/* Tabla principal */}
			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirCrear}>
						<Plus className="w-4 h-4" /> Registrar Pago
					</BtnPrimario>
				</div>

				<table className="w-full">
					<CabeceraTabla
						columnas={
							esAdmin
								? ['#', 'Boleta', 'Propiedad', 'Residente', 'Monto', 'Fecha', 'Acciones']
								: ['#', 'Boleta', 'Propiedad', 'Monto', 'Fecha', 'Acciones']
						}
					/>
					<tbody>
						{filtrados.length === 0 ? (
							<tr>
								<td
									colSpan={esAdmin ? 7 : 6}
									className="px-4 py-10 text-center text-secundario text-sm"
								>
									No hay pagos registrados.
								</td>
							</tr>
						) : (
							filtrados.map((p) => (
								<Fila
									key={p.ID_PAGO}
									seleccionada={filaActiva === p.ID_PAGO}
									onClick={() => setFilaActiva(filaActiva === p.ID_PAGO ? null : p.ID_PAGO)}
								>
									<Celda mono>{p.ID_PAGO}</Celda>
									<Celda mono>{p.NUMERO_BOLETA}</Celda>
									<Celda>{p.NUMERO_PROPIEDAD ?? `#${p.ID_PROPIEDAD}`}</Celda>
									{esAdmin && <Celda>{p.NOMBRE_USUARIO ?? '—'}</Celda>}
									<Celda>
										<span className="text-emerald-400 font-bold font-mono">
											{formatQ(p.MONTO_TOTAL)}
										</span>
									</Celda>
									<Celda>{formatearFecha(p.FECHA_PAGO)}</Celda>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<BtnAccion onClick={() => abrirVer(p)} Icono={Eye} titulo="Ver detalle" />
										</div>
									</td>
								</Fila>
							))
						)}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={pagos.length} unidad="pagos" />
			</div>

			{/* ── Modal crear pago ── */}
			{modal === 'crear' && (
				<Modal titulo="Registrar Pago" alCerrar={() => setModal(null)}>
					<form onSubmit={guardar} className="space-y-5">
						{/* Admin: ingresa idPropiedad */}
						{esAdmin && (
							<Campo etiqueta="ID de Propiedad">
								<Entrada
									type="number"
									placeholder="Ej: 5"
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}
									required
								/>
							</Campo>
						)}

						{/* Preview de cargos pendientes */}
						<div className="rounded-xl border border-borde bg-fondo overflow-hidden">
							<div className="px-4 py-3 border-b border-borde bg-tarjeta/50 flex items-center gap-2">
								<AlertCircle className="w-4 h-4 text-amber-400" />
								<span className="text-[11px] font-bold uppercase tracking-wide text-secundario">
									Cargos pendientes
								</span>
							</div>

							{cargandoEstado ? (
								<div className="px-4 py-6 text-center text-secundario text-sm">
									Consultando cargos...
								</div>
							) : !estadoCuenta ? (
								<div className="px-4 py-6 text-center text-zinc-600 text-sm">
									{esAdmin
										? 'Ingresa un ID de propiedad para ver los cargos pendientes.'
										: 'No se pudieron cargar los cargos pendientes.'}
								</div>
							) : estadoCuenta.cantidadCargosPendientes === 0 ? (
								<div className="px-4 py-6 text-center space-y-2">
									<CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
									<p className="text-emerald-400 text-sm font-medium">Sin cargos pendientes</p>
									<p className="text-zinc-600 text-xs">Esta propiedad está al día.</p>
								</div>
							) : (
								<div>
									{/* Lista de cargos */}
									<div className="divide-y divide-borde">
										{estadoCuenta.cargosPendientes.map((cargo) => (
											<div key={cargo.ID_CARGO} className="flex items-center justify-between px-4 py-3">
												<div>
													<p className="text-sm text-primario font-medium">{cargo.DESCRIPCION}</p>
													<p className="text-[11px] text-zinc-500 mt-0.5">
														{cargo.TIPO_CARGO}
														{cargo.FECHA_EMISION ? ` · ${formatearFecha(cargo.FECHA_EMISION)}` : ''}
													</p>
												</div>
												<span
													className={`text-sm font-bold font-mono ${
														cargo.ES_MULTA ? 'text-red-400' : 'text-primario'
													}`}
												>
													{formatQ(cargo.MONTO)}
												</span>
											</div>
										))}
									</div>

									{/* Total */}
									<div className="flex items-center justify-between px-4 py-3 bg-tarjeta/50 border-t border-borde">
										<span className="text-[12px] font-bold uppercase tracking-wide text-secundario">
											Total a pagar
										</span>
										<span className="text-lg font-bold font-mono text-emerald-400">
											{formatQ(estadoCuenta.totalPendiente)}
										</span>
									</div>

									{/* Último pago */}
									{estadoCuenta.ultimoPago && (
										<div className="px-4 py-2 bg-fondo border-t border-borde">
											<p className="text-[11px] text-zinc-600">
												Último pago:{' '}
												<span className="text-zinc-400">
													{estadoCuenta.ultimoPago.NUMERO_BOLETA} —{' '}
													{formatearFecha(estadoCuenta.ultimoPago.FECHA_PAGO)}
												</span>
											</p>
										</div>
									)}
								</div>
							)}
						</div>

						{/* Número de boleta */}
						<Campo etiqueta="Número de Boleta">
							<Entrada
								required
								placeholder="Ej: BOL-2026-001"
								value={form.numeroBoleta}
								onChange={(e) => setForm({ ...form, numeroBoleta: e.target.value })}
							/>
						</Campo>

						{/* Observaciones (opcional) */}
						<Campo etiqueta="Observaciones (opcional)">
							<Entrada
								placeholder="Ej: Pago en efectivo en caja"
								value={form.observaciones}
								onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
							/>
						</Campo>

						{errorModal && (
							<p className="text-red-400 text-xs flex items-center gap-1.5">
								<AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
								{errorModal}
							</p>
						)}

						<BotonesModal
							alCancelar={() => setModal(null)}
							textoGuardar="Confirmar Pago"
							IconoGuardar={CreditCard}
						/>
					</form>
				</Modal>
			)}

			{/* ── Modal ver detalle ── */}
			{modal === 'ver' && seleccion && (
				<Modal
					titulo={`Detalle — Boleta ${seleccion.NUMERO_BOLETA}`}
					alCerrar={() => setModal(null)}
				>
					{cargandoDetalle ? (
						<div className="text-secundario text-sm text-center py-8">Cargando detalle...</div>
					) : (
						<div className="space-y-4">
							{/* Info general del pago */}
							<div className="space-y-2">
								{[
									['# Pago', seleccion.ID_PAGO],
									['Boleta', seleccion.NUMERO_BOLETA],
									['Propiedad', seleccion.NUMERO_PROPIEDAD ?? `#${seleccion.ID_PROPIEDAD}`],
									esAdmin ? ['Residente', seleccion.NOMBRE_USUARIO ?? '—'] : null,
									['Fecha', formatearFecha(seleccion.FECHA_PAGO)],
									['Observaciones', seleccion.OBSERVACIONES ?? '—'],
								]
									.filter(Boolean)
									.map(([lbl, val]) => (
										<div key={lbl} className="flex justify-between border-b border-borde pb-2 text-sm">
											<span className="text-secundario">{lbl}</span>
											<span className="text-primario font-medium">{val}</span>
										</div>
									))}
							</div>

							{/* Desglose de cargos cubiertos */}
							<div className="rounded-xl border border-borde overflow-hidden">
								<div className="px-4 py-2.5 bg-tarjeta/50 border-b border-borde">
									<span className="text-[11px] font-bold uppercase tracking-wide text-secundario">
										Cargos cubiertos
									</span>
								</div>
								{pagoDetalle?.detalles?.length > 0 ? (
									<div className="divide-y divide-borde">
										{pagoDetalle.detalles.map((d) => (
											<div key={d.ID_DETALLE} className="flex items-center justify-between px-4 py-3">
												<div>
													<p className="text-sm text-primario">{d.DESCRIPCION_CARGO}</p>
													<p className="text-[11px] text-zinc-500">{d.TIPO_CARGO}</p>
												</div>
												<span className="text-sm font-bold font-mono text-emerald-400">
													{formatQ(d.MONTO_APLICADO)}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-secundario text-sm text-center py-4">Sin detalles disponibles.</p>
								)}

								{/* Total */}
								<div className="flex justify-between px-4 py-3 bg-tarjeta/50 border-t border-borde">
									<span className="text-[12px] font-bold uppercase tracking-wide text-secundario">
										Total pagado
									</span>
									<span className="text-base font-bold font-mono text-emerald-400">
										{formatQ(seleccion.MONTO_TOTAL)}
									</span>
								</div>
							</div>
						</div>
					)}
				</Modal>
			)}
		</div>
	);
}
