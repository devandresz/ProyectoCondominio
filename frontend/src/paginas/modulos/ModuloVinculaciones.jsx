// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloVinculaciones.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Link, Plus, Pencil, Trash2, Ban } from 'lucide-react';
import { vinculacionesApi } from '../../api/vinculacionesApi.js';
import { usuariosApi } from '../../api/usuariosApi.js';
import { propiedadesApi } from '../../api/propiedadesApi.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloVinculaciones({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [propiedades, setPropiedades] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'nuevo', 'editar'
	const [aEliminar, setAEliminar] = useState(null);

	const [form, setForm] = useState({
		id: null,
		idUsuario: '',
		idPropiedad: '',
		tipoVinculo: 'Propietario',
	});

	const cargarTodo = async () => {
		setCargando(true);
		try {
			const [resVinc, resUsu, resProp] = await Promise.all([
				vinculacionesApi.obtenerTodas(),
				usuariosApi.obtenerTodos(),
				propiedadesApi.obtenerTodas(),
			]);

			const formateados = resVinc.data.map((v) => ({
				id: v.ID_USUARIO_PROPIEDAD,
				usuario: v.USUARIO_NOMBRE,
				idUsuario: v.ID_USUARIO,
				propiedad: v.PROPIEDAD_NUMERO,
				idPropiedad: v.ID_PROPIEDAD,
				tipoVinculo: v.TIPO_VINCULO,
				fechaInicio: new Date(v.FECHA_INICIO).toLocaleDateString(),
				estado: v.ACTIVO === 1 ? 'Activo' : 'Inactivo',
			}));

			setDatos(formateados);
			setUsuarios(resUsu.data || []);
			setPropiedades(resProp.data || []);
		} catch (error) {
			console.error('Error al cargar datos:', error);
			if (error.response?.status === 401) {
				toast.error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
			}
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		cargarTodo();
	}, []);

	const termino = (busqueda || filtroGlobal).toLowerCase().trim();
	const filtrados = termino
		? datos.filter(
				(v) =>
					v.usuario.toLowerCase().includes(termino) || v.propiedad.toLowerCase().includes(termino),
			)
		: datos;

	const abrirModalNuevo = () => {
		setForm({ id: null, idUsuario: '', idPropiedad: '', tipoVinculo: 'Propietario' });
		setModal('nuevo');
	};

	const abrirModalEditar = (vinculo) => {
		setForm({
			id: vinculo.id,
			idUsuario: vinculo.idUsuario,
			idPropiedad: vinculo.idPropiedad,
			tipoVinculo: vinculo.tipoVinculo,
		});
		setModal('editar');
	};

	const guardarVinculo = async (e) => {
		e.preventDefault();
		const payload = {
			idUsuario: Number(form.idUsuario),
			idPropiedad: Number(form.idPropiedad),
			tipoVinculo: form.tipoVinculo,
		};

		try {
			if (form.id) {
				await vinculacionesApi.actualizar(form.id, payload);
				toast.success('Vínculo actualizado exitosamente');
			} else {
				await vinculacionesApi.crear(payload);
				toast.success('Vínculo creado exitosamente');
			}
			await cargarTodo();
			setModal(null);
		} catch (error) {
			toast.error(error.response?.data?.mensaje || 'Error al guardar el vínculo.');
		}
	};

	const toggleEstado = async (id, estadoActual) => {
		try {
			const nuevoActivo = estadoActual === 'Activo' ? 0 : 1;
			await vinculacionesApi.actualizar(id, { activo: nuevoActivo });
			await cargarTodo();
			toast.success('Estado de vínculo actualizado');
		} catch (error) {
			toast.error('Error al cambiar el estado.');
		}
	};

	const confirmarEliminar = async () => {
		try {
			await vinculacionesApi.eliminar(aEliminar.id);
			await cargarTodo();
			setAEliminar(null);
			toast.success('Vínculo eliminado exitosamente');
		} catch (error) {
			toast.error(error.response?.data?.mensaje || 'Error al eliminar.');
		}
	};

	if (cargando)
		return (
			<div className="p-8 text-center text-zinc-400 animate-pulse">Cargando vinculaciones...</div>
		);

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-3 gap-4">
				<TarjetaMetrica
					etiqueta="Total de Vínculos"
					valor={datos.length}
					Icono={Link}
					fondo="bg-zinc-800"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirModalNuevo}>
						<Plus className="w-4 h-4" /> Asignar Usuario
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['Propiedad', 'Usuario Residente', 'Tipo', 'Inicio', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((vinc, i) => (
							<Fila key={vinc.id} indice={i}>
								<Celda mono>{vinc.propiedad}</Celda>
								<Celda className="font-bold text-primario">{vinc.usuario}</Celda>
								<td className="px-4 py-3">
									<span
										className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${vinc.tipoVinculo === 'Propietario' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'}`}
									>
										{vinc.tipoVinculo}
									</span>
								</td>
								<Celda className="text-xs text-zinc-500">{vinc.fechaInicio}</Celda>
								<td className="px-4 py-3">
									<Etiqueta
										texto={vinc.estado}
										variante={vinc.estado === 'Activo' ? 'activo' : 'inactivo'}
									/>
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Pencil}
											onClick={() => abrirModalEditar(vinc)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Ban}
											onClick={() => toggleEstado(vinc.id, vinc.estado)}
											colorHover="hover:text-amber-400"
										/>
										<BtnAccion
											Icono={Trash2}
											onClick={() => setAEliminar(vinc)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="vínculos" />
			</div>

			{modal && (
				<Modal
					titulo={modal === 'nuevo' ? 'Asignar Usuario a Propiedad' : 'Editar Vínculo'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardarVinculo} className="space-y-4">
						<Campo etiqueta="Usuario / Residente">
							<Selector
								required
								value={form.idUsuario}
								onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}
							>
								<option value="">Seleccione una persona...</option>
								{usuarios.map((u) => (
									<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
										{u.NOMBRE} {u.APELLIDO}
									</option>
								))}
							</Selector>
						</Campo>

						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Propiedad (Casa/Apto)">
								<Selector
									required
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}
									disabled={modal === 'editar'}
								>
									<option value="">Seleccione propiedad...</option>
									{propiedades.map((p) => (
										<option key={p.id} value={p.id}>
											{p.numero} - {p.categoria}
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Tipo de Vínculo">
								<Selector
									value={form.tipoVinculo}
									onChange={(e) => setForm({ ...form, tipoVinculo: e.target.value })}
									disabled={modal === 'editar'}
								>
									<option>Propietario</option>
									<option>Inquilino</option>
								</Selector>
							</Campo>
						</div>

						{modal === 'nuevo' && (
							<p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-2">
								Nota: No puede haber dos propietarios activos en la misma casa.
							</p>
						)}

						<BotonesModal alCancelar={() => setModal(null)} textoGuardar="Guardar Vínculo" />
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Desvincular Usuario?"
					mensaje={`Se eliminará permanentemente la conexión entre ${aEliminar.usuario} y la propiedad ${aEliminar.propiedad}.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminar}
				/>
			)}
		</div>
	);
}
