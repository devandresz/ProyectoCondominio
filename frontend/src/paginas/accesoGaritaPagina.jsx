import { useState } from 'react';
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
	CarFront,
	FileWarningIcon,
} from 'lucide-react';
import { useAccesoGarita } from '../hooks/useAccesoGarita.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { formatearFecha } from '../utilidades/formatearFecha.js';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function AccesoGaritaPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { accesoGarita, cargando, error, crear, actualizar, eliminar } = useAccesoGarita();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');

	// Cargar guardias y colaboradores activos al montar

	const [form, setForm] = useState({
		idInvitacion: '',
		idGuardia: '',
		tipoDocumento: '',
		numeroDocumento: '',
		nombreCompletoReal: '',
		observaciones: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? accesoGarita.filter(
				(ag) =>
					limpiar(ag.ID_ACCESO).includes(termino) ||
					limpiar(ag.ID_INVITACION).includes(termino) ||
					limpiar(ag.NUMERO_DOCUMENTO?.toString()).includes(termino),
			)
		: accesoGarita;

	const abrirEditar = (ag) => {
		setSeleccion(ag);
		setForm({
			tipoDocumento: '',
			numeroDocumento: '',
			nombreCompletoReal: '',
			observaciones: '',
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (ag) => {
		setSeleccion(ag);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			//Aqui haré cambios con los ID
			const datosAEnviar = {
				...form,
				idInvitacion: Number(form.idInvitacion),
				idGuardia: Number(form.idGuardia),
				tipoDocumento: form.tipoDocumento,
				numeroDocumento: form.numeroDocumento,
				nombreCompletoReal: form.nombreCompletoReal,
				observaciones: form.observaciones,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
			} else {
				await actualizar(seleccion.ID_ACCESO, datosAEnviar);
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_ACCESO);
		} catch (err) {
			console.error('Error al eliminar:', extraerError(err));
		}
		setAEliminar(null);
	};

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando bitácora...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			{/* Métricas */}
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={accesoGarita.length}
					Icono={FileWarningIcon}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Invitaciones activas"
					valor={accesoGarita.filter((p) => p.ACTIVO === 1).length}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Invitaciones Inactivas"
					valor={accesoGarita.filter((p) => p.ACTIVO === 0).length}
					Icono={XCircle}
					fondo="bg-zinc-500/10"
				/>
			</div>

			{/* Tabla */}
			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'#',
							'No. Invitacion',
							'Tipo Documento',
							'No. Documento',
							'Nombre',
							'Observaciones',
							'Hora de ingreso',
							'Fecha expiración',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((ag) => (
							<Fila
								key={ag.ID_ACCESO}
								seleccionada={filaActiva === ag.ID_ACCESO}
								onClick={() => setFilaActiva(filaActiva === ag.ID_ACCESO ? null : ag.ID_ACCESO)}
							>
								<Celda mono>{ag.ID_ACCESO}</Celda>
								<Celda>{ag.ID_INVITACION}</Celda>
								<Celda>{ag.TIPO_DOCUMENTO}</Celda>
								<Celda>{ag.NUMERO_DOCUMENTO}</Celda>
								<Celda>{ag.NOMBRE_COMPLETO_REAL}</Celda>
								<Celda>{ag.OBSERVACIONES}</Celda>
								<Celda>{formatearFecha(ag.HORA_INGRESO)}</Celda>
								<Celda>{formatearFecha(ag.FECHA_EXPIRACION)}</Celda>
								<Celda>
									<Etiqueta texto={ag.ACTIVO === 1 ? 'ACTIVO' : 'INACTIVO'} />
								</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(ag)} Icono={Eye} titulo="Ver" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(ag)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(ag)}
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
				<PieTabla mostrados={filtrados.length} total={accesoGarita.length} unidad="accesos" />
			</div>

			{/* Modal crear/editar */}
			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo acceso' : 'Editar acceso'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Tipo Documento">
								<Selector
									required
									value={form.tipoDocumento}
									onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									<option value="DPI">DPI</option>
									<option value="Licencia">Licencia</option>
								</Selector>
							</Campo>
							<Campo etiqueta="Numero Documento">
								<input
									type="text"
									required
									value={form.numeroDocumento}
									onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
									placeholder="Número del documento"
									className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
								/>
							</Campo>
						</div>
						<Campo etiqueta="Nombre completo">
							<input
								type="text"
								required
								value={form.nombreCompletoReal}
								onChange={(e) => setForm({ ...form, nombreCompletoReal: e.target.value })}
								placeholder="Nombre completo del invitado"
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
							/>
						</Campo>
						<Campo etiqueta="Observaciones">
							<input
								type="text"
								required
								value={form.observaciones}
								onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
								placeholder="Observaciones"
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
							/>
						</Campo>
						{errorModal && <p className="text-red-400 text-xs">{errorModal}</p>}
						<BotonesModal
							alCancelar={() => setModal(null)}
							textoGuardar={modal === 'crear' ? 'Crear' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{/* Modal ver */}
			{modal === 'ver' && seleccion && (
				<Modal titulo="Detalle del Parqueo" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['#', seleccion.ID_LLAMADO],
							['No. Invitacion', seleccion.ID_INVITACION],
							['No. Guardia', seleccion.ID_GUARDIA],
							['Nombre', seleccion.NOMBRE_COMPLETO_REAL],
							['Tipo de Documento', seleccion.TIPO_DOCUMENTO],
							['Numero de Documento', seleccion.NUMERO_DOCUMENTO],
							['Observaciones', seleccion.observaciones],
							['Hora de ingreso', formatearFecha(seleccion.HORA_INGRESO)],
							['Fecha de generación', formatearFecha(seleccion.FECHA_GENERACION)],
							['Fecha de expiracion', formatearFecha(seleccion.FECHA_EXPIRACION)],
							['Estado', seleccion.ACTIVO],
						].map(([lbl, val]) => (
							<div key={lbl} className="flex justify-between border-b border-borde pb-2">
								<span className="text-secundario">{lbl}</span>
								<span className="text-primario font-medium">{val}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{/* Modal confirmación eliminar */}
			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar parqueo?"
					mensaje={`Se eliminará la invitación "${aEliminar.ID_INVITACION}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
