// ============================================================
// 📁 RUTA: frontend/src/paginas/LlamadasAtencionPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, PhoneCall } from 'lucide-react';
import { useLlamadasAtencion } from '../hooks/useLlamadasAtencion.js';
import { propiedadesApi } from '../api/propiedadesApi.js';

import { tiposCargoApi } from '../api/tiposCargo.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { formatearFecha } from '../utilidades/formatearFecha.js';
import { toast } from 'sonner';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function LlamadasAtencionPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { llamadasAtencion, llamadasAgrupadas, cargando, error, crear, actualizar, eliminar } =
		useLlamadasAtencion();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [propiedades, setPropiedades] = useState([]);
	const [cargos, setCargos] = useState([]);
	const [estadoLista, setEstadoLista] = useState(false);

	useEffect(() => {
		propiedadesApi
			.obtenerTodas()
			.then((res) => {
				setPropiedades(res.data);
			})
			.catch((e) => console.error('Error al cargar propiedades:', extraerError(e)));

		tiposCargoApi
			.obtenerTodos()
			.then((res) => {
				setCargos(res.data);
			})
			.catch((e) => console.error('Error al cargar tipos de cargo:', extraerError(e)));
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
			idAdmin: usuario.ID_USUARIO,
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
				idAdmin: usuario.ID_USUARIO,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Llamada de atención creada exitosamente');
			} else {
				await actualizar(seleccion.ID_LLAMADO, datosAEnviar);
				toast.success('Llamada de atención actualizada exitosamente');
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
			toast.error('Ocurrió un error al guardar la llamada de atención');
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_LLAMADO);
			toast.success('Llamada de atención eliminada con éxito');
		} catch (err) {
			console.error('Error al eliminar:', extraerError(err));
			toast.error('No se pudo eliminar la llamada de atención');
		}
		setAEliminar(null);
	};

	if (cargando)
		return <div className="text-secundario text-sm p-8">Cargando llamadas de atención...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={llamadasAtencion.length}
					Icono={PhoneCall}
					fondo="bg-zinc-800"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={() => setEstadoLista(!estadoLista)}>
						{estadoLista ? 'Ver detalles' : 'Agrupar conteo'}
					</BtnPrimario>
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nueva llamada de atención
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={
							!estadoLista
								? ['#', 'Nombre', 'Descripción', 'Fecha', 'Acciones']
								: ['#', 'Propiedad', 'Descripción', 'Cantidad', 'Acciones']
						}
					/>
					<tbody>
						{!estadoLista
							? filtrados.map((la, index) => (
									<Fila
										key={la.ID_LLAMADO}
										seleccionada={filaActiva === la.ID_LLAMADO}
										onClick={() => setFilaActiva(filaActiva === la.ID_LLAMADO ? null : la.ID_LLAMADO)}
									>
										<Celda mono>{index + 1}</Celda>
										<Celda>{la.NOMBRE}</Celda>
										<Celda>{la.DESCRIPCION}</Celda>
										<Celda>{formatearFecha(la.FECHA_EMISION)}</Celda>
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
								))
							: llamadasAgrupadas.map((la, index) => (
									<Fila
										key={la.ID_LLAMADO}
										seleccionada={filaActiva === la.ID_LLAMADO}
										onClick={() => setFilaActiva(filaActiva === la.ID_LLAMADO ? null : la.ID_LLAMADO)}
									>
										<Celda mono>{index + 1}</Celda>
										<Celda>{la.NUMERO_PROPIEDAD}</Celda>
										<Celda>{la.DESCRIPCION}</Celda>
										<Celda>{la.CANTIDAD}</Celda>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<BtnAccion onClick={() => abrirVer(la)} Icono={Eye} titulo="Ver" />
											</div>
										</td>
									</Fila>
								))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={llamadasAtencion.length} unidad="llamados" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nueva llamada' : 'Editar llamada'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Propiedad">
								<Selector
									required
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: Number(e.target.value) })}
								>
									<option value="">Seleccionar...</option>
									{propiedades.map((p) => (
										<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>
											{p.NUMERO_PROPIEDAD}
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Tipo de Cargo">
								<Selector
									required
									value={form.idTipoCargo}
									onChange={(e) => setForm({ ...form, idTipoCargo: Number(e.target.value) })}
								>
									<option value="">Seleccionar...</option>
									{cargos.map(
										(c) =>
											c.NOMBRE.includes('Multa') && (
												<option key={c.ID_TIPO_CARGO} value={c.ID_TIPO_CARGO}>
													{c.NOMBRE}
												</option>
											),
									)}
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

			{modal === 'ver' && seleccion && (
				<Modal titulo="Detalle de la llamada" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['Cargo', seleccion.NOMBRE],
							['Descripcion', seleccion.DESCRIPCION],
							['Fecha de Emisión', formatearFecha(seleccion.FECHA_EMISION)],
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
					titulo="¿Eliminar llamado?"
					mensaje={`Se eliminará el llamado "${aEliminar.ID_LLAMADO}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
