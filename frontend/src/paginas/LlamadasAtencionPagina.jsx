import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, PhoneCall } from 'lucide-react';
import { useLlamadasAtencion } from '../hooks/useLlamadasAtencion.js';
import { usuariosApi } from '../api/usuariosApi.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function LlamadasAtencionPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { llamadasAtencion, cargando, error, crear, actualizar, eliminar } =
		useLlamadasAtencion();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [personal, setPersonal] = useState([]);

	// Cargar guardias y colaboradores activos al montar
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
		idPropiedad: '',
		idTipoCargo: '',
		descripcion: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? llamadasAtencion.filter(
				(la) =>
					limpiar(la.idPropiedad).includes(termino) || limpiar(la.idTipoCargo).includes(termino),
			)
		: llamadasAtencion;

	const abrirCrear = () => {
		setForm({
			idPropiedad: '',
			idTipoCargo: '',
			descripcion: '',
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (la) => {
		setSeleccion(la);
		setForm({
			idPropiedad: la.ID_PROPIEDAD,
			idTipoCargo: la.ID_TIPO_CARGO,
			descripcion: la.DESCRIPCION,
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (la) => {
		setSeleccion(la);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			const datosAEnviar = {
				...form,
				idPropiedad: Number(form.idPropiedad),
				idTipoCargo: Number(form.idTipoCargo),
				descripcion: form.descripcion,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
			} else {
				await actualizar(seleccion.ID_LLAMADO, datosAEnviar);
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_LLAMADO);
		} catch (err) {
			console.error('Error al eliminar:', extraerError(err));
		}
		setAEliminar(null);
	};

	if (cargando)
		return <div className="text-secundario text-sm p-8">Cargando llamadas de atención...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			{/* Métricas */}
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={llamadasAtencion.length}
					Icono={PhoneCall}
					fondo="bg-zinc-800"
				/>
			</div>

			{/* Tabla */}
			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nueva llamada de atención
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla columnas={['#', 'Cantidad', 'Propiedad', 'Descripción', 'Acciones']} />
					<tbody>
						{filtrados.map((la, index) => (
							<Fila
								key={la.ID_LLAMADO}
								seleccionada={filaActiva === la.ID_LLAMADO}
								onClick={() => setFilaActiva(filaActiva === la.ID_LLAMADO ? null : la.ID_LLAMADO)}
							>
								<Celda mono>{index}</Celda>
								<Celda>{la.CANTIDAD}</Celda>
								<Celda>{la.NUMERO_PROPIEDAD}</Celda>
								<Celda>{la.DESCRIPCION}</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(la)} Icono={Eye} titulo="Ver" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(la)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(la)}
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
				<PieTabla mostrados={filtrados.length} total={llamadasAtencion.length} unidad="llamados" />
			</div>

			{/* Modal crear/editar */}
			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nueva llamada' : 'Editaa llamada'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Propiedad">
								<Selector
									required
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									{personal.map((u) => (
										<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
											{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Tipo de Cargo">
								<Selector
									required
									value={form.idTipoCargo}
									onChange={(e) => setForm({ ...form, idTipoCargo: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									{personal.map((u) => (
										<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
											{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})
										</option>
									))}
								</Selector>
							</Campo>
						</div>
						<Campo etiqueta="Descripción">
							<textarea
								required
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Detalle del parqueo"
								rows={3}
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
				<Modal titulo="Detalle de la llamada" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['No. Propiedad', seleccion.NUMERO_PROPIEDAD],
							['Descripcion', seleccion.DESCRIPCION],
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
					mensaje={`Se eliminará el parqueo "${aEliminar.ID_PROPIEDAD}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
