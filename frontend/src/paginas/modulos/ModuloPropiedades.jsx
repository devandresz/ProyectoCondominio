// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloPropiedades.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Building, CheckCircle, Users, Plus, Eye, Pencil, Ban, Trash2 } from 'lucide-react';
import { propiedadesApi } from '../../api/propiedadesApi.js';
import { categoriasApi } from '../../api/categoriasApi.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloPropiedades({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [categoriasBD, setCategoriasBD] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);

	const [form, setForm] = useState({
		numero: '',
		idCategoria: '',
		propietario: '',
		inquilino: '',
	});

	const cargarDatos = async () => {
		setCargando(true);
		try {
			const [resProp, resCat] = await Promise.all([
				propiedadesApi.obtenerTodas(),
				categoriasApi.obtenerTodas(),
			]);

			setCategoriasBD(resCat.data || []);

			const datosFormateados = resProp.data.map((p) => {
				const desc = p.DESCRIPCION || '';
				const partes = desc.split(' | INQ: ');
				const prop = partes[0] || 'Sin asignar';
				const inq = partes[1] || null;

				return {
					id: p.ID_PROPIEDAD,
					numero: p.NUMERO_PROPIEDAD,
					idCategoria: p.ID_CATEGORIA,
					categoria: p.CATEGORIA_NOMBRE,
					cuota: p.CUOTA_MENSUAL,
					parqueos: p.MAX_PARQUEOS,
					estado: p.ACTIVO === 1 ? 'Activo' : 'Inactivo',
					propietario: prop,
					inquilino: inq,
				};
			});
			setDatos(datosFormateados);
		} catch (error) {
			console.error('Error al cargar propiedades:', error);
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		cargarDatos();
	}, []);

	const termino = (busqueda || filtroGlobal).toLowerCase().trim();
	const filtrados = termino
		? datos.filter(
				(p) =>
					p.numero.toLowerCase().includes(termino) ||
					p.propietario.toLowerCase().includes(termino) ||
					(p.inquilino && p.inquilino.toLowerCase().includes(termino)),
			)
		: datos;

	const guardarNuevo = async (e) => {
		e.preventDefault();
		if (!form.numero.trim() || !form.propietario.trim() || !form.idCategoria) return;

		const descFinal = form.inquilino.trim()
			? `${form.propietario.trim()} | INQ: ${form.inquilino.trim()}`
			: form.propietario.trim();

		const payload = {
			idCategoria: Number(form.idCategoria),
			numeroPropiedad: form.numero.trim().toUpperCase(),
			descripcion: descFinal,
			activo: 1,
		};

		try {
			if (editandoId) {
				await propiedadesApi.actualizar(editandoId, payload);
				toast.success('Propiedad actualizada correctamente');
			} else {
				await propiedadesApi.crear(payload);
				toast.success('Propiedad registrada correctamente');
			}
			await cargarDatos();
			setModal(null);
			setEditandoId(null);
		} catch (error) {
			toast.error(error.response?.data?.mensaje || 'Error al guardar la propiedad');
		}
	};

	function abrirEditar(p) {
		setForm({
			numero: p.numero,
			idCategoria: p.idCategoria,
			propietario: p.propietario !== 'Sin asignar' ? p.propietario : '',
			inquilino: p.inquilino || '',
		});
		setEditandoId(p.id);
		setModal('nuevo');
	}

	const toggleEstado = async (id, estadoActual) => {
		try {
			const nuevoActivo = estadoActual === 'Activo' ? 0 : 1;
			await propiedadesApi.actualizar(id, { activo: nuevoActivo });
			await cargarDatos();
			toast.success('Estado actualizado');
		} catch (error) {
			console.error('Error al cambiar estado:', error);
			toast.error('Error al intentar cambiar el estado en la base de datos.');
		}
	};

	const categoriaSeleccionada = categoriasBD.find(
		(c) => c.ID_CATEGORIA === Number(form.idCategoria),
	);

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
					etiqueta="Total Unidades"
					valor={datos.length}
					Icono={Building}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activas"
					valor={datos.filter((p) => p.estado === 'Activo').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Con Inquilino"
					valor={datos.filter((p) => p.inquilino).length}
					Icono={Users}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Cuota promedio"
					valor={`Q${datos.length > 0 ? Math.round(datos.reduce((s, p) => s + p.cuota, 0) / datos.length) : 0}`}
					textoIcono="Q"
					fondo="bg-amber-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({
								numero: '',
								idCategoria: categoriasBD[0]?.ID_CATEGORIA || '',
								propietario: '',
								inquilino: '',
							});
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Registrar Propiedad
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['Número', 'Categoría', 'Cuota', 'Usuarios Registrados', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((p, i) => (
							<Fila key={p.id} indice={i}>
								<Celda mono>{p.numero}</Celda>
								<td className="px-4 py-3">
									<span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
										{p.categoria}
									</span>
								</td>
								<Celda>Q{p.cuota.toFixed(2)}</Celda>
								<td className="px-4 py-3">
									<div className="text-xs">
										<div className="flex items-center gap-1.5 mb-1">
											<span className="text-zinc-500 w-4">P:</span>
											<span className={!p.inquilino ? 'text-primario font-bold' : 'text-zinc-400'}>
												{p.propietario}
											</span>
										</div>
										{p.inquilino && (
											<div className="flex items-center gap-1.5">
												<span className="text-zinc-500 w-4">I:</span>
												<span className="text-primario font-bold">{p.inquilino}</span>
											</div>
										)}
									</div>
								</td>
								<td className="px-4 py-3">
									<Etiqueta texto={p.estado} variante={p.estado.toLowerCase()} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Eye}
											titulo="Ver detalle"
											onClick={() => {
												setSeleccion(p);
												setModal('detalle');
											}}
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(p)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Ban}
											titulo="Activar/Inactivar"
											onClick={() => toggleEstado(p.id, p.estado)}
											colorHover="hover:text-amber-400"
										/>
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar propiedad"
											onClick={() => setAEliminar(p)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="propiedades" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Propiedad' : 'Registrar Propiedad'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardarNuevo} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Número de propiedad">
								<Entrada
									value={form.numero}
									onChange={(e) => setForm({ ...form, numero: e.target.value })}
									placeholder="Ej: A-101"
									required
								/>
							</Campo>
							<Campo etiqueta="Categoría">
								<Selector
									required
									value={form.idCategoria}
									onChange={(e) => setForm({ ...form, idCategoria: e.target.value })}
								>
									<option value="">Seleccione una...</option>
									{categoriasBD.map((c) => (
										<option key={c.ID_CATEGORIA} value={c.ID_CATEGORIA}>
											{c.NOMBRE}
										</option>
									))}
								</Selector>
							</Campo>
						</div>
						<Campo etiqueta="Nombre del Propietario (Obligatorio)">
							<Entrada
								value={form.propietario}
								onChange={(e) => setForm({ ...form, propietario: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>
						<Campo etiqueta="Nombre del Inquilino (Opcional)">
							<Entrada
								value={form.inquilino}
								onChange={(e) => setForm({ ...form, inquilino: e.target.value })}
								placeholder="Dejar en blanco si no hay"
							/>
						</Campo>

						<div className="p-3 rounded-lg bg-zinc-800/60 border border-borde text-xs text-secundario space-y-1">
							<p>
								Cuota a cobrar:{' '}
								<span className="text-primario font-bold">
									{categoriaSeleccionada ? `Q${categoriaSeleccionada.CUOTA_MENSUAL.toFixed(2)}` : '---'}
								</span>
							</p>
							<p>
								Parqueos asignados:{' '}
								<span className="text-primario font-bold">
									{categoriaSeleccionada ? categoriaSeleccionada.MAX_PARQUEOS : '---'}
								</span>
							</p>
						</div>

						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'detalle' && seleccion && (
				<Modal titulo={`Detalle — ${seleccion.numero}`} alCerrar={() => setModal(null)}>
					<div className="space-y-0">
						{[
							['Número', seleccion.numero],
							['Categoría', seleccion.categoria],
							['Cuota', `Q${seleccion.cuota.toFixed(2)} / mes`],
							['Parqueos', seleccion.parqueos],
							['Propietario', seleccion.propietario],
							['Inquilino', seleccion.inquilino || 'No aplica'],
							['Estado', seleccion.estado],
						].map(([k, v]) => (
							<div
								key={k}
								className="flex justify-between py-3 border-b border-borde/50 last:border-0"
							>
								<span className="text-xs text-secundario">{k}</span>
								<span className="text-sm font-bold text-primario">{v}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Propiedad?"
					mensaje={`Se borrará la propiedad ${aEliminar.numero}. Esta acción no se puede deshacer.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={async () => {
						try {
							await propiedadesApi.eliminar(aEliminar.id);
							await cargarDatos();
							setAEliminar(null);
							toast.success('Propiedad eliminada correctamente');
						} catch (error) {
							toast.error(error.response?.data?.mensaje || 'Error al eliminar en la BD.');
						}
					}}
				/>
			)}
		</div>
	);
}
