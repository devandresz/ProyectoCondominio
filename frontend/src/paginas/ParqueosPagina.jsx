// ============================================================
// 📁 RUTA: frontend/src/paginas/ParqueosPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, Clock, XCircle, CarFront } from 'lucide-react';
import { useParqueos } from '../hooks/useParqueo.js';
import { propiedadesApi } from '../api/propiedadesApi.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { toast } from 'sonner';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function ParqueosPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { parqueos, cargando, error, crear, actualizar, eliminar } = useParqueos();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [propiedades, setPropiedades] = useState([]);

	useEffect(() => {
		propiedadesApi
			.obtenerTodas()
			.then((res) => {
				setPropiedades(res.data);
			})
			.catch((e) => console.error('Error al cargar propiedades:', extraerError(e)));
	}, []);

	const [form, setForm] = useState({
		idPropiedad: '',
		numeroParqueo: '',
		descripcion: '',
		activo: 1,
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? parqueos.filter(
				(p) =>
					limpiar(p.NUMERO_PARQUEO).includes(termino) ||
					limpiar(p.ACTIVO).includes(termino) ||
					limpiar(p.ID_PARQUEO?.toString()).includes(termino),
			)
		: parqueos;

	const abrirCrear = () => {
		setForm({
			idPropiedad: '',
			numeroParqueo: '',
			descripcion: '',
			activo: 1,
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (p) => {
		setSeleccion(p);
		setForm({
			idPropiedad: p.ID_PROPIEDAD,
			numeroParqueo: p.NUMERO_PARQUEO,
			descripcion: p.DESCRIPCION,
			activo: p.ACTIVO,
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (p) => {
		setSeleccion(p);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			const datosAEnviar = {
				...form,
				idPropiedad: Number(form.idPropiedad),
				numeroParqueo: form.numeroParqueo,
				descripcion: form.descripcion,
				activo: form.activo,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Parqueo creado exitosamente');
			} else {
				await actualizar(seleccion.ID_PARQUEO, datosAEnviar);
				toast.success('Parqueo actualizado exitosamente');
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
			toast.error('Error al guardar el parqueo');
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_PARQUEO);
			toast.success('Parqueo eliminado exitosamente');
		} catch (err) {
			console.error('Error al eliminar:', extraerError(err));
			toast.error('Error al eliminar el parqueo');
		}
		setAEliminar(null);
	};

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando parqueos...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={parqueos.length}
					Icono={CarFront}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={parqueos.filter((p) => p.ACTIVO === 1).length}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={parqueos.filter((p) => p.ACTIVO === 0).length}
					Icono={XCircle}
					fondo="bg-zinc-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nuevo Parqueo
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['#', 'No. Parqueo', 'Descripción', 'Propiedad', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((p) => (
							<Fila
								key={p.ID_PARQUEO}
								seleccionada={filaActiva === p.ID_PARQUEO}
								onClick={() => setFilaActiva(filaActiva === p.ID_PARQUEO ? null : p.ID_PARQUEO)}
							>
								<Celda mono>{p.ID_PARQUEO}</Celda>
								<Celda>{p.NUMERO_PARQUEO}</Celda>
								<Celda>{p.DESCRIPCION}</Celda>
								<Celda>{p.NUMERO_PROPIEDAD}</Celda>
								<Celda>
									<Etiqueta
										texto={p.ACTIVO === 1 ? 'ACTIVO' : 'INACTIVO'}
										variante={p.ACTIVO === 1 ? 'activo' : 'inactivo'}
									/>
								</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(p)} Icono={Eye} titulo="Ver" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(p)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(p)}
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
				<PieTabla mostrados={filtrados.length} total={parqueos.length} unidad="parqueos" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Parqueo' : 'Editar Parqueo'}
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
									{propiedades.map((p) => (
										<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>
											{p.NUMERO_PROPIEDAD}
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Numero de parqueo">
								<input
									type="text"
									required
									value={form.numeroParqueo}
									onChange={(e) => setForm({ ...form, numeroParqueo: e.target.value })}
									placeholder="Detalle del parqueo"
									className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
								/>
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
						<Campo etiqueta="Estado">
							<br />
							<Celda>
								<Etiqueta texto={'Activo'} variante={'activo'} />
								<input
									name="activo"
									id="activo"
									required
									type="radio"
									value={1}
									onChange={() => setForm({ ...form, activo: 1 })}
									checked={form.activo === 1}
								/>
							</Celda>

							<Celda>
								<Etiqueta texto={'Inactivo'} variante={'inactivo'} />
								<input
									name="activo"
									id="activo"
									required
									type="radio"
									value={0}
									onChange={() => setForm({ ...form, activo: 0 })}
									checked={form.activo === 0}
								/>
							</Celda>
						</Campo>
						{errorModal && <p className="text-red-400 text-xs">{errorModal}</p>}
						<BotonesModal
							alCancelar={() => setModal(null)}
							textoGuardar={modal === 'crear' ? 'Crear' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'ver' && seleccion && (
				<Modal titulo="Detalle del Parqueo" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['#', seleccion.ID_PARQUEO],
							['No. Parqueo', seleccion.NUMERO_PARQUEO],
							['No. Propiedad', seleccion.NUMERO_PROPIEDAD],
							['Descripcion', seleccion.DESCRIPCION],
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

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar parqueo?"
					mensaje={`Se eliminará el parqueo "${aEliminar.NUMERO_PARQUEO}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
