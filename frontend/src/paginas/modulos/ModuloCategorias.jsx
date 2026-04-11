// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloCategorias.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react';
import { categoriasApi } from '../../api/categoriasApi.js';
import { TarjetaMetrica } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloCategorias({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'nuevo', 'editar'
	const [aEliminar, setAEliminar] = useState(null);

	const [form, setForm] = useState({
		id: null,
		nombre: '',
		descripcion: '',
		maxParqueos: 1,
		cuotaMensual: 0,
	});

	const cargarDatos = async () => {
		setCargando(true);
		try {
			const respuesta = await categoriasApi.obtenerTodas();
			const formateados = respuesta.data.map((c) => ({
				id: c.ID_CATEGORIA,
				nombre: c.NOMBRE,
				descripcion: c.DESCRIPCION,
				maxParqueos: c.MAX_PARQUEOS,
				cuotaMensual: c.CUOTA_MENSUAL,
			}));
			setDatos(formateados);
		} catch (error) {
			console.error('Error al cargar categorías:', error);
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		cargarDatos();
	}, []);

	const termino = (busqueda || filtroGlobal).toLowerCase().trim();
	const filtrados = termino
		? datos.filter((c) => c.nombre.toLowerCase().includes(termino))
		: datos;

	const abrirModalNuevo = () => {
		setForm({ id: null, nombre: '', descripcion: '', maxParqueos: 1, cuotaMensual: 0 });
		setModal('nuevo');
	};

	const abrirModalEditar = (cat) => {
		setForm({
			id: cat.id,
			nombre: cat.nombre,
			descripcion: cat.descripcion || '',
			maxParqueos: cat.maxParqueos,
			cuotaMensual: cat.cuotaMensual,
		});
		setModal('editar');
	};

	const guardarCategoria = async (e) => {
		e.preventDefault();
		const payload = {
			nombre: form.nombre,
			descripcion: form.descripcion,
			maxParqueos: Number(form.maxParqueos),
			cuotaMensual: Number(form.cuotaMensual),
		};

		try {
			if (form.id) {
				await categoriasApi.actualizar(form.id, payload);
				toast.success('Categoría actualizada exitosamente');
			} else {
				await categoriasApi.crear(payload);
				toast.success('Categoría creada exitosamente');
			}
			await cargarDatos();
			setModal(null);
		} catch (error) {
			toast.error(error.response?.data?.mensaje || 'Error al guardar la categoría.');
		}
	};

	const confirmarEliminar = async () => {
		try {
			await categoriasApi.eliminar(aEliminar.id);
			await cargarDatos();
			setAEliminar(null);
			toast.success('Categoría eliminada exitosamente');
		} catch (error) {
			toast.error(error.response?.data?.mensaje || 'Error al eliminar.');
		}
	};

	if (cargando)
		return (
			<div className="p-8 text-center text-zinc-400 animate-pulse">Cargando catálogo...</div>
		);

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-3 gap-4">
				<TarjetaMetrica
					etiqueta="Total Categorías"
					valor={datos.length}
					Icono={Tags}
					fondo="bg-zinc-800"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirModalNuevo}>
						<Plus className="w-4 h-4" /> Nueva Categoría
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['Nombre', 'Descripción', 'Cuota Mensual', 'Máx Parqueos', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((cat, i) => (
							<Fila key={cat.id} indice={i}>
								<Celda className="font-bold text-primario">{cat.nombre}</Celda>
								<Celda className="text-zinc-400 text-xs">{cat.descripcion || 'Sin descripción'}</Celda>
								<Celda>Q{cat.cuotaMensual.toFixed(2)}</Celda>
								<Celda>{cat.maxParqueos}</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Pencil}
											onClick={() => abrirModalEditar(cat)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Trash2}
											onClick={() => setAEliminar(cat)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="categorías" />
			</div>

			{modal && (
				<Modal
					titulo={modal === 'nuevo' ? 'Nueva Categoría' : 'Editar Categoría'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardarCategoria} className="space-y-4">
						<Campo etiqueta="Nombre de Categoría">
							<Entrada
								required
								value={form.nombre}
								onChange={(e) => setForm({ ...form, nombre: e.target.value })}
								placeholder="Ej: Premium"
							/>
						</Campo>
						<Campo etiqueta="Descripción">
							<Entrada
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Breve descripción..."
							/>
						</Campo>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Cuota Mensual (Q)">
								<Entrada
									required
									type="number"
									step="0.01"
									min="1"
									value={form.cuotaMensual}
									onChange={(e) => setForm({ ...form, cuotaMensual: e.target.value })}
								/>
							</Campo>
							<Campo etiqueta="Límite de Parqueos">
								<Entrada
									required
									type="number"
									min="0"
									value={form.maxParqueos}
									onChange={(e) => setForm({ ...form, maxParqueos: e.target.value })}
								/>
							</Campo>
						</div>
						<BotonesModal alCancelar={() => setModal(null)} textoGuardar="Guardar Categoría" />
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Categoría?"
					mensaje={`Se borrará la categoría "${aEliminar.nombre}". Solo se puede eliminar si no hay propiedades usándola.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminar}
				/>
			)}
		</div>
	);
}
