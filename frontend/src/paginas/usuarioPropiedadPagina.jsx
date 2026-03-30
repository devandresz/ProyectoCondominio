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
	CarFront,
	PersonStanding,
} from 'lucide-react';
import { useUsuarioPropiedad } from '../hooks/useUsuarioPropiedad.js';
import { usuariosApi } from '../api/usuariosApi.js';
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

export default function UsuarioPropiedadPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { up, cargando, error, crear, actualizar, eliminar } = useUsuarioPropiedad();

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
		idUsuario: '',
		idPropiedad: '',
		tipoVinculo: '',
		fechaFin: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? up.filter(
				(p) =>
					limpiar(p.ID_PROPIEDAD).includes(termino) || limpiar(p.ID_USUARIO).includes(termino),
			)
		: up;

	const abrirCrear = () => {
		setForm({
			idUsuario: '',
			idPropiedad: '',
			tipoVinculo: '',
			fechaFin: '',
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (p) => {
		setSeleccion(p);
		setForm({
			idUsuario: p.ID_USUARIO,
			idPropiedad: p.ID_PROPIEDAD,
			tipoVinculo: p.TIPO_VINCULO,
			fechaFin: p.FECHA_FIN,
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
				idUsuario: Number(form.idUsuario),
				idPropiedad: Number(form.idPropiedad),
				tipoVinculo: form.tipoVinculo,
				fechaFin: form.fechaFin,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
			} else {
				await actualizar(seleccion.ID_USUARIO_PROPIEDAD, datosAEnviar);
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_USUARIO_PROPIEDAD);
		} catch (err) {
			console.error('Error al eliminar:', extraerError(err));
		}
		setAEliminar(null);
	};

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando up...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			{/* Métricas */}
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica etiqueta="Total" valor={up.length} Icono={CarFront} fondo="bg-zinc-800" />
				<TarjetaMetrica
					etiqueta="Propietarios"
					valor={up.filter((p) => p.TIPO_VINCULO === 'Propietario').length}
					Icono={PersonStanding}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inquilino"
					valor={up.filter((p) => p.TIPO_VINCULO === 'Inquilino').length}
					Icono={PersonStanding}
					fondo="bg-zinc-500/10"
				/>
			</div>

			{/* Tabla */}
			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nuevo Propietario / Inquilino
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['#', 'No. Usuario', 'No. Propiedad', 'Vínculo', 'Duración', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((up) => (
							<Fila
								key={up.ID_USUARIO_PROPIEDAD}
								seleccionada={filaActiva === up.ID_USUARIO_PROPIEDAD}
								onClick={() =>
									setFilaActiva(filaActiva === up.ID_USUARIO_PROPIEDAD ? null : up.ID_USUARIO_PROPIEDAD)
								}
							>
								<Celda mono>{up.ID_USUARIO_PROPIEDAD}</Celda>
								<Celda>{up.ID_USUARIO}</Celda>
								<Celda>{up.ID_PROPIEDAD}</Celda>
								<Celda>{up.TIPO_VINCULO}</Celda>
								<Celda>{formatearFecha(up.FECHA_FIN)}</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(up)} Icono={Eye} titulo="Ver" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(up)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(up)}
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
				<PieTabla mostrados={filtrados.length} total={up.length} unidad="up" />
			</div>

			{/* Modal crear/editar */}
			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Vinculo' : 'Editar Vinculo'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Usuario">
								<Selector
									required
									value={form.idUsuario}
									onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									{personal.map((u) => (
										<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
											{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})
										</option>
									))}
								</Selector>
							</Campo>
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
							<Campo etiqueta="Tipo de Vinculo">
								<Selector
									required
									value={form.tipoVinculo}
									onChange={(e) => setForm({ ...form, tipoVinculo: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									<option value="Propietario">Propietario</option>
									<option value="Inquilino">Inquilino</option>
								</Selector>
							</Campo>
							<Campo etiqueta="Fecha Fin">
								<input
									type="text"
									required
									value={form.fechaFin}
									onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
									placeholder="Fecha de pago"
									className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
								/>
							</Campo>
						</div>
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
							['#', seleccion.ID_USUARIO_PROPIEDAD],
							['No. Usuario', seleccion.ID_USUARIO],
							['No. Propiedad', seleccion.ID_PROPIEDAD],
							['Tipo de Vínculo', seleccion.TIPO_VINCULO],
							['Fecha de Pago', formatearFecha(seleccion.FECHA_FIN)],
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
					titulo="¿Eliminar vinculo de propiedad?"
					mensaje={`Se eliminará el vinculo "${aEliminar.ID_USUARIO_PROPIEDAD}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
