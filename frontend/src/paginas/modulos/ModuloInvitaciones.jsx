// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloInvitaciones.jsx
// ============================================================

import { useState, useEffect } from 'react';
import { QrCode, Plus, Ban, Trash2, Pencil, CheckCircle, Clock } from 'lucide-react';
import { invitacionesApi } from '../../api/invitacionesApi.js';
import useStore from '../../estado/useStore.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloInvitaciones({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);

	const [datos, setDatos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({
		visitante: '',
		tipo: 'Normal',
	});

	const cargarDatos = async (silencioso = false) => {
		if (!silencioso) setCargando(true);
		try {
			const respuesta = await invitacionesApi.obtenerTodas();

			const datosFormateados = respuesta.data.map((inv) => {
				let estado = 'Activo';
				if (inv.ACTIVO === 0) {
					if (inv.ID_TIPO === 1 && inv.FECHA_EXPIRACION) {
						const expiracion = new Date(inv.FECHA_EXPIRACION);
						estado = expiracion < new Date() ? 'Expirado' : 'Inactivo';
					} else {
						estado = 'Inactivo';
					}
				}

				return {
					id: inv.ID_INVITACION,
					idUsuario: inv.ID_USUARIO,
					idTipo: inv.ID_TIPO,
					tipo: inv.TIPO_NOMBRE,
					visitante: inv.NOMBRE_VISITANTE,
					codigoQR: inv.CODIGO_QR,
					activo: inv.ACTIVO,
					estado,
					fechaGeneracion: inv.FECHA_GENERACION
						? new Date(inv.FECHA_GENERACION).toLocaleDateString('es-GT')
						: null,
					fechaExpiracion: inv.FECHA_EXPIRACION
						? new Date(inv.FECHA_EXPIRACION).toLocaleDateString('es-GT')
						: null,
				};
			});

			setDatos(datosFormateados);
		} catch (error) {
			console.error('Error al cargar invitaciones:', error);
		} finally {
			if (!silencioso) setCargando(false);
		}
	};

	useEffect(() => {
		cargarDatos();

		const intervalo = setInterval(() => {
			cargarDatos(true);
		}, 3000);

		return () => clearInterval(intervalo);
	}, []);

	useEffect(() => {
		if (modal === 'qr' && seleccion) {
			const invitacionActualizada = datos.find((inv) => inv.id === seleccion.id);
			if (invitacionActualizada && invitacionActualizada.activo !== seleccion.activo) {
				setSeleccion(invitacionActualizada);
			}
		}
	}, [datos, modal, seleccion]);

	const termino = (busqueda || filtroGlobal).toLowerCase().trim();
	const filtrados = termino
		? datos.filter(
				(inv) =>
					inv.visitante.toLowerCase().includes(termino) ||
					inv.tipo.toLowerCase().includes(termino) ||
					inv.codigoQR?.toLowerCase().includes(termino),
			)
		: datos;

	const guardar = async (e) => {
		if (e) e.preventDefault();
		if (!form.visitante.trim()) return;

		try {
			if (editandoId) {
				await invitacionesApi.actualizar(editandoId, {
					nombreVisitante: form.visitante.trim(),
				});
				toast.success('Invitación actualizada exitosamente');
			} else {
				await invitacionesApi.crear({
					nombreVisitante: form.visitante.trim(),
					tipo: form.tipo,
					idUsuario: usuario?.ID_USUARIO,
				});
				toast.success('Pase QR generado exitosamente');
			}
			await cargarDatos(true);
			setModal(null);
			setEditandoId(null);
		} catch (error) {
			console.error('Error al guardar:', error);
			toast.error(error.response?.data?.mensaje || 'Error al guardar la invitación');
		}
	};

	function abrirEditar(inv) {
		setForm({ visitante: inv.visitante, tipo: inv.tipo });
		setEditandoId(inv.id);
		setModal('nuevo');
	}

	const desactivar = async (inv) => {
		try {
			await invitacionesApi.desactivar(inv.id);
			await cargarDatos(true);
			toast.success('Pase QR invalidado correctamente');
		} catch (error) {
			console.error('Error al desactivar:', error);
			toast.error(error.response?.data?.mensaje || 'Error al desactivar la invitación');
		}
	};

	if (cargando)
		return (
			<div className="p-8 text-center text-zinc-400 animate-pulse">
				Cargando datos desde Oracle...
			</div>
		);

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Pases"
					valor={datos.length}
					Icono={QrCode}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={datos.filter((i) => i.activo === 1).length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Expirados"
					valor={datos.filter((i) => i.estado === 'Expirado').length}
					Icono={Clock}
					fondo="bg-amber-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={datos.filter((i) => i.activo === 0).length}
					Icono={Ban}
					fondo="bg-red-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ visitante: '', tipo: 'Normal' });
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Generar Pase QR
					</BtnPrimario>
				</div>

				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Visitante',
							'Tipo',
							'Código QR',
							'Generado',
							'Vencimiento',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((inv, i) => (
							<Fila
								key={inv.id}
								indice={i}
								seleccionada={filaActiva === inv.id}
								onClick={() => setFilaActiva(filaActiva === inv.id ? null : inv.id)}
							>
								<Celda>{inv.visitante}</Celda>

								<td className="px-4 py-3">
									<span
										className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border
                                        ${
											inv.tipo === 'Normal'
												? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
												: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
										}`}
									>
										{inv.tipo}
									</span>
								</td>

								<Celda mono>{inv.codigoQR}</Celda>
								<td className="px-4 py-3 text-sm text-primario">{inv.fechaGeneracion ?? '—'}</td>
								<td className="px-4 py-3 text-sm text-primario">
									{inv.tipo === 'Servicio' ? (
										<span className="italic font-normal text-zinc-500 text-xs">Sin vencimiento</span>
									) : (
										(inv.fechaExpiracion ?? '—')
									)}
								</td>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.estado} variante={inv.estado.toLowerCase()} />
								</td>

								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={QrCode}
											titulo="Ver código QR"
											onClick={() => {
												setSeleccion(inv);
												setModal('qr');
											}}
											colorHover="hover:text-sky-400"
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(inv)}
											colorHover="hover:text-blue-400"
										/>
										{inv.activo === 1 && (
											<BtnAccion
												Icono={Ban}
												titulo="Invalidar QR"
												onClick={() => desactivar(inv)}
												colorHover="hover:text-amber-400"
											/>
										)}
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar registro"
											onClick={() => setAEliminar(inv)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>

				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="invitaciones" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Invitación' : 'Generar Pase de Visita'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardar} className="space-y-4">
						<Campo etiqueta="Nombre del visitante">
							<Entrada
								value={form.visitante}
								onChange={(e) => setForm({ ...form, visitante: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>

						{!editandoId && (
							<Campo etiqueta="Tipo de invitación">
								<Selector
									value={form.tipo}
									onChange={(e) => setForm({ ...form, tipo: e.target.value })}
								>
									<option value="Normal">Normal</option>
									<option value="Servicio">Servicio</option>
								</Selector>
							</Campo>
						)}

						{!editandoId && form.tipo === 'Normal' && (
							<div className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
								<Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-amber-400">
									<p className="font-bold mb-1">Pase Temporal</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>Expira automáticamente a las 23:59 del día de hoy.</li>
										<li>Un solo uso — se desactiva tras escanearse.</li>
									</ul>
								</div>
							</div>
						)}
						{!editandoId && form.tipo === 'Servicio' && (
							<div className="flex gap-2 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
								<CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-violet-400">
									<p className="font-bold mb-1">Pase Permanente</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>Sin fecha de caducidad.</li>
										<li>Reutilizable hasta desactivación manual.</li>
									</ul>
								</div>
							</div>
						)}

						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Generar QR'}
							IconoGuardar={editandoId ? undefined : QrCode}
						/>
					</form>
				</Modal>
			)}

			{modal === 'qr' && seleccion && (
				<Modal titulo={`Código QR — ${seleccion.visitante}`} alCerrar={() => setModal(null)}>
					<div className="flex flex-col items-center gap-5">
						<div className="p-4 bg-white rounded-xl shadow-lg relative transition-all duration-500">
							{seleccion.activo === 0 && (
								<div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10 animate-in zoom-in-90 duration-300">
									<span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-lg">
										{seleccion.estado}
									</span>
								</div>
							)}
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(seleccion.codigoQR)}&color=09090b`}
								alt={`QR ${seleccion.codigoQR}`}
								className="w-[180px] h-[180px] rounded-sm object-contain"
							/>
						</div>

						<div className="w-full space-y-0">
							{[
								['Código', seleccion.codigoQR],
								['Tipo', seleccion.tipo],
								['Estado', seleccion.estado],
								['Generado', seleccion.fechaGeneracion ?? '—'],
								[
									'Vencimiento',
									seleccion.tipo === 'Servicio'
										? 'Sin vencimiento'
										: (seleccion.fechaExpiracion ?? '—'),
								],
							].map(([k, v]) => (
								<div
									key={k}
									className="flex justify-between py-3 border-b border-borde/50 last:border-0"
								>
									<span className="text-xs text-secundario">{k}</span>
									<span
										className={`text-sm font-bold font-mono ${k === 'Estado' && v === 'Inactivo' ? 'text-red-400' : 'text-primario'}`}
									>
										{v}
									</span>
								</div>
							))}
						</div>

						{seleccion.activo === 1 && (
							<button
								onClick={() => {
									desactivar(seleccion);
									setModal(null);
								}}
								className="w-full px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold transition-colors"
							>
								Invalidar este QR manualmente
							</button>
						)}
					</div>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Invitación?"
					mensaje={`Vas a eliminar permanentemente el pase de ${aEliminar.visitante}. Esta acción no se puede deshacer.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={async () => {
						try {
							await invitacionesApi.eliminar(aEliminar.id);
							setDatos(datos.filter((inv) => inv.id !== aEliminar.id));
							setAEliminar(null);
							toast.success('Invitación eliminada correctamente');
						} catch (error) {
							console.error('Error al eliminar:', error);
							const msgError =
								error.response?.data?.mensaje || 'Error al intentar eliminar la invitación';
							toast.error(`⚠️ ALERTA DE SEGURIDAD:\n\n${msgError}`);
							setAEliminar(null);
						}
					}}
				/>
			)}
		</div>
	);
}
