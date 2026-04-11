// ============================================================
// 📁 RUTA: frontend/src/paginas/TicketsPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import {
	Plus,
	Eye,
	Pencil,
	Trash2,
	Ticket,
	Clock,
	CheckCircle,
	XCircle,
	History,
} from 'lucide-react';
import { useTickets } from '../hooks/useTickets.js';
import { ticketsApi } from '../api/ticketsApi.js';
import { usuariosApi } from '../api/usuariosApi.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { formatearFecha } from '../utilidades/formatearFecha.js';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { toast } from 'sonner';

const ESTADOS = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO', 'CANCELADO'];

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function TicketsPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { tickets, cargando, error, crear, actualizar, eliminar } = useTickets();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [historial, setHistorial] = useState([]);
	const [errorModal, setErrorModal] = useState('');
	const [personal, setPersonal] = useState([]);

	useEffect(() => {
		usuariosApi
			.obtenerTodos()
			.then((res) => {
				const filtrados = res.data.filter(
					(u) => (u.ROL === 'Guardia' || u.ROL === 'Colaborador') && u.ACTIVO === 1,
				);
				setPersonal(filtrados);
			})
			.catch(() => setPersonal([]));
	}, []);

	const [form, setForm] = useState({
		idAsignadoA: '',
		idPrioridad: 2,
		titulo: '',
		descripcion: '',
		fechaLimite: '',
		estado: 'ABIERTO',
		notasCierre: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? tickets.filter(
				(t) =>
					limpiar(t.TITULO).includes(termino) ||
					limpiar(t.ESTADO).includes(termino) ||
					limpiar(t.ID_TICKET?.toString()).includes(termino),
			)
		: tickets;

	const abrirCrear = () => {
		setForm({
			idAsignadoA: '',
			idPrioridad: 2,
			titulo: '',
			descripcion: '',
			fechaLimite: '',
			estado: 'ABIERTO',
			notasCierre: '',
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (t) => {
		setSeleccion(t);
		setForm({
			idAsignadoA: t.ID_ASIGNADO_A,
			idPrioridad: t.ID_PRIORIDAD,
			titulo: t.TITULO,
			descripcion: t.DESCRIPCION,
			fechaLimite: t.FECHA_LIMITE?.split('T')[0] ?? '',
			estado: t.ESTADO,
			notasCierre: t.NOTAS_CIERRE ?? '',
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (t) => {
		setSeleccion(t);
		setModal('ver');
	};

	const abrirHistorial = async (t) => {
		setSeleccion(t);
		try {
			const res = await ticketsApi.obtenerHistorial(t.ID_TICKET);
			setHistorial(res.data);
		} catch (err) {
			console.error('Error al obtener historial:', extraerError(err));
			setHistorial([]);
		}
		setModal('historial');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			let fechaLimiteFormateada = null;
			if (form.fechaLimite) {
				fechaLimiteFormateada = new Date(`${form.fechaLimite}T00:00:00`).toISOString();
			}

			const datosAEnviar = {
				...form,
				idAsignadoA: Number(form.idAsignadoA),
				idPrioridad: Number(form.idPrioridad),
				fechaLimite: fechaLimiteFormateada,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Ticket creado exitosamente');
			} else {
				await actualizar(seleccion.ID_TICKET, datosAEnviar);
				toast.success('Ticket actualizado exitosamente');
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
			toast.error('Error al guardar el ticket');
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_TICKET);
			toast.success('Ticket eliminado exitosamente');
		} catch (err) {
			console.error('Error al eliminar:', extraerError(err));
			toast.error('Error al eliminar el ticket');
		}
		setAEliminar(null);
	};

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando tickets...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={tickets.length}
					Icono={Ticket}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Abiertos"
					valor={tickets.filter((t) => t.ESTADO === 'ABIERTO').length}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="En progreso"
					valor={tickets.filter((t) => t.ESTADO === 'EN_PROGRESO').length}
					Icono={CheckCircle}
					fondo="bg-amber-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Cerrados"
					valor={tickets.filter((t) => t.ESTADO === 'CERRADO').length}
					Icono={XCircle}
					fondo="bg-zinc-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nuevo Ticket
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'#',
							'Título',
							'Asignado a',
							'Estado',
							'Prioridad',
							'Fecha límite',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((t) => (
							<Fila
								key={t.ID_TICKET}
								seleccionada={filaActiva === t.ID_TICKET}
								onClick={() => setFilaActiva(filaActiva === t.ID_TICKET ? null : t.ID_TICKET)}
							>
								<Celda mono>{t.ID_TICKET}</Celda>
								<Celda>{t.TITULO}</Celda>
								<Celda>{t.NOMBRE_ASIGNADO ?? t.ID_ASIGNADO_A}</Celda>
								<Celda>
									<Etiqueta texto={t.ESTADO} />
								</Celda>
								<Celda>{t.ID_PRIORIDAD}</Celda>
								<Celda>{t.FECHA_LIMITE ? formatearFecha(t.FECHA_LIMITE) : '—'}</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(t)} Icono={Eye} titulo="Ver" />
										<BtnAccion onClick={() => abrirHistorial(t)} Icono={History} titulo="Historial" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(t)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(t)}
													Icono={Trash2}
													titulo="Eliminar"
													colorHover="hover:text-red-400"
												/>
											</>
										)}
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={tickets.length} unidad="tickets" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Ticket' : 'Editar Ticket'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Asignar a">
								<Selector
									required
									value={form.idAsignadoA}
									onChange={(e) => setForm({ ...form, idAsignadoA: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									{personal.map((u) => (
										<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
											{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Prioridad">
								<Selector
									value={form.idPrioridad}
									onChange={(e) => setForm({ ...form, idPrioridad: e.target.value })}
								>
									<option value={1}>Baja</option>
									<option value={2}>Media</option>
									<option value={3}>Alta</option>
									<option value={4}>Urgente</option>
								</Selector>
							</Campo>
						</div>
						<Campo etiqueta="Título">
							<Entrada
								required
								value={form.titulo}
								onChange={(e) => setForm({ ...form, titulo: e.target.value })}
								placeholder="Descripción corta del ticket"
							/>
						</Campo>
						<Campo etiqueta="Descripción">
							<textarea
								required
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Detalle del problema o tarea"
								rows={3}
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
							/>
						</Campo>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Fecha límite (opcional)">
								<Entrada
									type="date"
									value={form.fechaLimite}
									onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
								/>
							</Campo>
							{modal === 'editar' && (
								<Campo etiqueta="Estado">
									<Selector
										value={form.estado}
										onChange={(e) => setForm({ ...form, estado: e.target.value })}
									>
										{ESTADOS.map((s) => (
											<option key={s} value={s}>
												{s}
											</option>
										))}
									</Selector>
								</Campo>
							)}
						</div>
						{(form.estado === 'CERRADO' || form.estado === 'RESUELTO') && (
							<Campo etiqueta="Notas de cierre">
								<Entrada
									value={form.notasCierre}
									onChange={(e) => setForm({ ...form, notasCierre: e.target.value })}
									placeholder="Resumen de la resolución"
								/>
							</Campo>
						)}
						{errorModal && <p className="text-red-400 text-xs">{errorModal}</p>}
						<BotonesModal
							alCancelar={() => setModal(null)}
							textoGuardar={modal === 'crear' ? 'Crear' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'ver' && seleccion && (
				<Modal titulo="Detalle del Ticket" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['#', seleccion.ID_TICKET],
							['Título', seleccion.TITULO],
							['Descripción', seleccion.DESCRIPCION],
							['Estado', seleccion.ESTADO],
							['Prioridad', seleccion.ID_PRIORIDAD],
							['Asignado a', seleccion.NOMBRE_ASIGNADO ?? seleccion.ID_ASIGNADO_A],
							['Fecha límite', seleccion.FECHA_LIMITE ? formatearFecha(seleccion.FECHA_LIMITE) : '—'],
							['Notas cierre', seleccion.NOTAS_CIERRE ?? '—'],
						].map(([lbl, val]) => (
							<div key={lbl} className="flex justify-between border-b border-borde pb-2">
								<span className="text-secundario">{lbl}</span>
								<span className="text-primario font-medium">{val}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{modal === 'historial' && seleccion && (
				<Modal
					titulo={`Historial — Ticket #${seleccion.ID_TICKET}`}
					alCerrar={() => setModal(null)}
				>
					{historial.length === 0 ? (
						<p className="text-secundario text-sm text-center py-4">Sin cambios registrados aún.</p>
					) : (
						<div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
							{historial.map((h) => (
								<div
									key={h.ID_HISTORIAL}
									className="flex items-start gap-3 p-3 rounded-lg border border-borde bg-fondo"
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<Etiqueta texto={h.ESTADO_ANTERIOR ?? '—'} />
											<span className="text-zinc-500 text-xs">→</span>
											<Etiqueta texto={h.ESTADO_NUEVO} />
										</div>
										{h.COMENTARIO && <p className="text-xs text-zinc-400">{h.COMENTARIO}</p>}
										<p className="text-[10px] text-zinc-600 mt-1">{formatearFecha(h.FECHA_CAMBIO)}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar ticket?"
					mensaje={`Se eliminará el ticket "${aEliminar.TITULO}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
