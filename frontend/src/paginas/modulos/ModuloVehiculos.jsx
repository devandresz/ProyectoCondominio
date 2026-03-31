import { useState } from 'react';
import {
	Building,
	CheckCircle,
	Users,
	Plus,
	Eye,
	Pencil,
	Ban,
	Trash2,
	Car,
	Tag,
	RefreshCw,
	QrCode,
	Clock,
	Save,
	AlertTriangle,
	Zap,
} from 'lucide-react';
import {
	propiedadesEjemplo,
	vehiculosEjemplo,
	limpiarBusqueda,
	colorVehiculo,
} from '../../datos/datosDePrueba.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
export default function ModuloVehiculos({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(vehiculosEjemplo);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(false);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({
		placa: '',
		marca: '',
		modelo: '',
		color: '',
		propiedad: '',
	});

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(v) =>
					limpiarBusqueda(v.propiedad).includes(termino) ||
					limpiarBusqueda(v.placa).includes(termino),
			)
		: datos;

	function guardar(e) {
		if (e) e.preventDefault();
		if (!form.placa.trim() || !form.propiedad) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);
		const responsable = propObj?.inquilino || propObj?.propietario || '—';
		if (editandoId) {
			setDatos(
				datos.map((v) =>
					v.id === editandoId
						? {
								...v,
								placa: form.placa.trim().toUpperCase(),
								marca: form.marca,
								modelo: form.modelo,
								color: form.color,
								propiedad: form.propiedad,
								responsable,
							}
						: v,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					placa: form.placa.trim().toUpperCase(),
					marca: form.marca,
					modelo: form.modelo,
					color: form.color,
					propiedad: form.propiedad,
					responsable,
					estado: 'Activo',
				},
			]);
		}
		setModal(false);
		setEditandoId(null);
	}

	function abrirEditar(v) {
		setForm({
			placa: v.placa,
			marca: v.marca,
			modelo: v.modelo,
			color: v.color,
			propiedad: v.propiedad,
		});
		setEditandoId(v.id);
		setModal(true);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Vehículos"
					valor={datos.length}
					Icono={Car}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={datos.filter((v) => v.estado === 'Activo').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={datos.filter((v) => v.estado !== 'Activo').length}
					Icono={Ban}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Marcas distintas"
					valor={new Set(datos.map((v) => v.marca)).size}
					Icono={Tag}
					fondo="bg-sky-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ placa: '', marca: '', modelo: '', color: '', propiedad: '' });
							setEditandoId(null);
							setModal(true);
						}}
					>
						<Plus className="w-4 h-4" /> Registrar vehículo
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Placa',
							'Vehículo',
							'Color',
							'Propiedad',
							'Responsable',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((v, i) => {
							const cv = colorVehiculo(v.color);
							return (
								<Fila
									key={v.id}
									indice={i}
									seleccionada={filaActiva === v.id}
									onClick={() => setFilaActiva(filaActiva === v.id ? null : v.id)}
								>
									<Celda mono>{v.placa}</Celda>
									<td className="px-4 py-3">
										<p className="text-sm font-bold text-primario">{v.marca}</p>
										<p className="text-xs font-semibold text-secundario">{v.modelo}</p>
									</td>
									<td className="px-4 py-3">
										<span
											className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-sm"
											style={{
												backgroundColor: cv.bg,
												color: cv.text,
												border: cv.border !== 'transparent' ? `1px solid ${cv.border}` : 'none',
											}}
										>
											{v.color}
										</span>
									</td>
									<Celda mono>{v.propiedad}</Celda>
									<Celda>{v.responsable}</Celda>
									<td className="px-4 py-3">
										<Etiqueta texto={v.estado} variante={v.estado.toLowerCase()} />
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<BtnAccion
												Icono={Pencil}
												titulo="Editar"
												onClick={() => abrirEditar(v)}
												colorHover="hover:text-blue-400"
											/>
											<BtnAccion
												Icono={RefreshCw}
												titulo="Activar/Inactivar"
												onClick={() =>
													setDatos(
														datos.map((d) =>
															d.id === v.id
																? { ...d, estado: d.estado === 'Activo' ? 'Inactivo' : 'Activo' }
																: d,
														),
													)
												}
												colorHover="hover:text-amber-400"
											/>
											<BtnAccion
												Icono={Trash2}
												titulo="Eliminar"
												onClick={() => setAEliminar(v)}
												colorHover="hover:text-red-500"
											/>
										</div>
									</td>
								</Fila>
							);
						})}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="vehículos" />
			</div>

			{modal && (
				<Modal
					titulo={editandoId ? 'Editar vehículo' : 'Registrar vehículo'}
					alCerrar={() => {
						setModal(false);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardar} className="space-y-4">
						<Campo etiqueta="Placa">
							<Entrada
								value={form.placa}
								onChange={(e) => setForm({ ...form, placa: e.target.value })}
								placeholder="P-123ABC"
								required
							/>
						</Campo>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Marca">
								<Entrada
									value={form.marca}
									onChange={(e) => setForm({ ...form, marca: e.target.value })}
									placeholder="Toyota"
									required
								/>
							</Campo>
							<Campo etiqueta="Modelo">
								<Entrada
									value={form.modelo}
									onChange={(e) => setForm({ ...form, modelo: e.target.value })}
									placeholder="Corolla"
									required
								/>
							</Campo>
						</div>
						<Campo etiqueta="Color">
							<Selector
								value={form.color}
								onChange={(e) => setForm({ ...form, color: e.target.value })}
								required
							>
								<option value="">Seleccionar color...</option>
								{['Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja'].map(
									(c) => (
										<option key={c}>{c}</option>
									),
								)}
							</Selector>
						</Campo>
						<Campo etiqueta="Propiedad Autorizada">
							<Selector
								value={form.propiedad}
								onChange={(e) => setForm({ ...form, propiedad: e.target.value })}
								required
							>
								<option value="">Seleccionar propiedad...</option>
								{propiedadesEjemplo
									.filter((p) => p.estado === 'Activo')
									.map((p) => (
										<option key={p.id} value={p.numero}>
											{p.numero} — {p.inquilino || p.propietario}
										</option>
									))}
							</Selector>
						</Campo>
						<BotonesModal
							alCancelar={() => {
								setModal(false);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Vehículo?"
					mensaje={`Estás a punto de borrar el vehículo con placa ${aEliminar.placa}. Ya no tendrá autorización para ingresar.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={() => {
						setDatos(datos.filter((v) => v.id !== aEliminar.id));
						setAEliminar(null);
					}}
				/>
			)}
		</div>
	);
}

/* ============================================================
   3. PASES DE VISITA (QR)
============================================================ */
