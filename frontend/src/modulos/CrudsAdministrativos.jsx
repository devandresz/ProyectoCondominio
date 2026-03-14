import { useState, useEffect } from 'react';
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
	invitacionesEjemplo,
	multasEjemplo,
	limpiarBusqueda,
	colorVehiculo,
} from '../login/datos/datosDePrueba.js';
import {
	TarjetaMetrica,
	BuscadorCasa,
	BtnPrimario,
	CabeceraTabla,
	Fila,
	Celda,
	Etiqueta,
	BtnAccion,
	PieTabla,
	Modal,
	Campo,
	Entrada,
	Selector,
	BotonesModal,
	ModalConfirmacion,
} from '../componentes/UiGeneral';

/* ============================================================
   1. GESTIÓN DE PROPIEDADES
============================================================ */
export function ModuloPropiedades({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(propiedadesEjemplo);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({
		numero: '',
		categoria: 'Básica',
		propietario: '',
		inquilino: '',
	});

	const cuotaPorCategoria = { Básica: 500, Intermedia: 800, Completa: 1200 };
	const parqueosPorCategoria = { Básica: 1, Intermedia: 2, Completa: 3 };
	const colorCategoria = {
		Básica: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
		Intermedia: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
		Completa: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
	};

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(p) =>
					limpiarBusqueda(p.numero).includes(termino) ||
					limpiarBusqueda(p.propietario).includes(termino) ||
					(p.inquilino && limpiarBusqueda(p.inquilino).includes(termino)),
			)
		: datos;

	function guardarNuevo(e) {
		if (e) e.preventDefault();
		if (!form.numero.trim() || !form.propietario.trim()) return;
		if (editandoId) {
			setDatos(
				datos.map((d) =>
					d.id === editandoId
						? {
								...d,
								numero: form.numero.trim().toUpperCase(),
								categoria: form.categoria,
								cuota: cuotaPorCategoria[form.categoria],
								parqueos: parqueosPorCategoria[form.categoria],
								propietario: form.propietario,
								inquilino: form.inquilino.trim() ? form.inquilino : null,
							}
						: d,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					numero: form.numero.trim().toUpperCase(),
					categoria: form.categoria,
					cuota: cuotaPorCategoria[form.categoria],
					parqueos: parqueosPorCategoria[form.categoria],
					propietario: form.propietario,
					inquilino: form.inquilino.trim() ? form.inquilino : null,
					estado: 'Activo',
				},
			]);
		}
		setModal(null);
		setEditandoId(null);
	}

	function abrirEditar(p) {
		setForm({
			numero: p.numero,
			categoria: p.categoria,
			propietario: p.propietario,
			inquilino: p.inquilino || '',
		});
		setEditandoId(p.id);
		setModal('nuevo');
	}

	function toggleEstado(id) {
		setDatos(
			datos.map((p) =>
				p.id === id ? { ...p, estado: p.estado === 'Activo' ? 'Inactivo' : 'Activo' } : p,
			),
		);
	}

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
					valor={`Q${Math.round(datos.reduce((s, p) => s + p.cuota, 0) / datos.length)}`}
					textoIcono="Q"
					fondo="bg-amber-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ numero: '', categoria: 'Básica', propietario: '', inquilino: '' });
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
							<Fila
								key={p.id}
								indice={i}
								seleccionada={filaActiva === p.id}
								onClick={() => setFilaActiva(filaActiva === p.id ? null : p.id)}
							>
								<Celda mono>{p.numero}</Celda>
								<td className="px-4 py-3">
									<span
										className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${colorCategoria[p.categoria]}`}
									>
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
											{!p.inquilino && (
												<span className="ml-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded border border-emerald-500/20">
													Responsable Pago
												</span>
											)}
										</div>
										{p.inquilino && (
											<div className="flex items-center gap-1.5">
												<span className="text-zinc-500 w-4">I:</span>
												<span className="text-primario font-bold">{p.inquilino}</span>
												<span className="ml-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded border border-emerald-500/20">
													Responsable Pago
												</span>
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
											onClick={() => toggleEstado(p.id)}
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
									value={form.categoria}
									onChange={(e) => setForm({ ...form, categoria: e.target.value })}
								>
									<option>Básica</option>
									<option>Intermedia</option>
									<option>Completa</option>
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
									Q{cuotaPorCategoria[form.categoria]}.00
								</span>
							</p>
							<p>
								Parqueos asignados:{' '}
								<span className="text-primario font-bold">{parqueosPorCategoria[form.categoria]}</span>
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
					mensaje={`Borrando la propiedad ${aEliminar.numero}. Esta acción no se puede deshacer.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={() => {
						setDatos(datos.filter((p) => p.id !== aEliminar.id));
						setAEliminar(null);
					}}
				/>
			)}
		</div>
	);
}

/* ============================================================
   2. CONTROL VEHICULAR
============================================================ */
export function ModuloVehiculos({ filtroGlobal = '' }) {
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
export function ModuloInvitaciones({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(invitacionesEjemplo);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({ visitante: '', tipo: 'Normal', propiedad: '' });

	const estadoVariante = {
		Activo: 'activo',
		Pendiente: 'pendiente',
		Expirado: 'expirado',
		Inactivo: 'inactivo',
		Utilizado: 'utilizado',
	};
	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(inv) =>
					limpiarBusqueda(inv.propiedad).includes(termino) ||
					limpiarBusqueda(inv.visitante).includes(termino),
			)
		: datos;

	useEffect(() => {
		const hoy = new Date().toISOString().split('T')[0];
		const iv = setInterval(() => {
			setDatos((prev) => {
				const next = prev.map((inv) =>
					inv.tipo === 'Normal' &&
					(inv.estado === 'Activo' || inv.estado === 'Pendiente') &&
					inv.fecha &&
					inv.fecha < hoy
						? { ...inv, estado: 'Expirado' }
						: inv,
				);
				return JSON.stringify(next) !== JSON.stringify(prev) ? next : prev;
			});
		}, 60000);
		return () => clearInterval(iv);
	}, []);

	function crear(e) {
		if (e) e.preventDefault();
		if (!form.visitante.trim() || !form.propiedad) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);
		const residente = propObj?.inquilino || propObj?.propietario || '—';
		if (editandoId) {
			setDatos(
				datos.map((inv) =>
					inv.id === editandoId
						? {
								...inv,
								visitante: form.visitante.trim(),
								tipo: form.tipo,
								residente,
								propiedad: form.propiedad,
								fecha: form.tipo === 'Normal' ? new Date().toISOString().split('T')[0] : null,
							}
						: inv,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					visitante: form.visitante.trim(),
					tipo: form.tipo,
					residente,
					propiedad: form.propiedad,
					fecha: form.tipo === 'Normal' ? new Date().toISOString().split('T')[0] : null,
					estado: 'Pendiente',
					codigo: `QR-${Date.now()}`,
				},
			]);
		}
		setModal(null);
		setEditandoId(null);
	}

	function abrirEditar(inv) {
		setForm({ visitante: inv.visitante, tipo: inv.tipo, propiedad: inv.propiedad });
		setEditandoId(inv.id);
		setModal('nuevo');
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Visitas"
					valor={datos.length}
					Icono={QrCode}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Pases Pendientes"
					valor={datos.filter((i) => i.estado === 'Pendiente').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Expiradas"
					valor={datos.filter((i) => i.estado === 'Expirado').length}
					Icono={Clock}
					fondo="bg-amber-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Desactivadas / Usadas"
					valor={datos.filter((i) => i.estado === 'Inactivo' || i.estado === 'Utilizado').length}
					Icono={Ban}
					fondo="bg-red-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ visitante: '', tipo: 'Normal', propiedad: '' });
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Generar Pase QR
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Visitante',
							'Tipo',
							'Residente',
							'Propiedad',
							'Vencimiento',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((inv, i) => (
							<Fila
								key={inv.id}
								indice={i}
								seleccionada={filaActiva === inv.id}
								onClick={() => setFilaActiva(filaActiva === inv.id ? null : inv.id)}
							>
								<Celda>{inv.visitante}</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.tipo} variante={inv.tipo.toLowerCase()} />
								</td>
								<Celda>{inv.residente}</Celda>
								<Celda mono>{inv.propiedad}</Celda>
								<Celda>
									{inv.fecha ?? (
										<span className="italic font-normal text-zinc-600">Sin vencimiento</span>
									)}
								</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.estado} variante={estadoVariante[inv.estado]} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={QrCode}
											titulo="Ver código QR"
											onClick={() => {
												setSeleccion(inv);
												setModal('qr');
											}}
											colorHover="hover:text-sky-400"
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(inv)}
											colorHover="hover:text-blue-400"
										/>
										{(inv.estado === 'Pendiente' || inv.estado === 'Activo') && (
											<BtnAccion
												Icono={Ban}
												titulo="Invalidar QR"
												onClick={() =>
													setDatos(datos.map((d) => (d.id === inv.id ? { ...d, estado: 'Inactivo' } : d)))
												}
												colorHover="hover:text-amber-400"
											/>
										)}
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar registro"
											onClick={() => setAEliminar(inv)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="invitaciones" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Pase de Visita' : 'Generar Pase de Visita'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={crear} className="space-y-4">
						<Campo etiqueta="Nombre del visitante">
							<Entrada
								value={form.visitante}
								onChange={(e) => setForm({ ...form, visitante: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>
						<Campo etiqueta="Tipo de invitación">
							<Selector
								value={form.tipo}
								onChange={(e) => setForm({ ...form, tipo: e.target.value })}
							>
								<option>Normal</option>
								<option>Servicio</option>
							</Selector>
						</Campo>
						<Campo etiqueta="Propiedad que autoriza">
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
						{form.tipo === 'Normal' && (
							<div className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
								<Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-amber-400">
									<p className="font-bold mb-1">Pase Temporal</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>Expira automáticamente a las 23:59 del día de hoy.</li>
										<li>Código QR de un solo uso (se invalida tras escanear).</li>
									</ul>
								</div>
							</div>
						)}
						{form.tipo === 'Servicio' && (
							<div className="flex gap-2 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
								<CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-violet-400">
									<p className="font-bold mb-1">Pase Permanente</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>No tiene fecha de caducidad.</li>
										<li>Puede utilizarse múltiples veces hasta ser desactivado manualmente.</li>
									</ul>
								</div>
							</div>
						)}
						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Generar QR'}
							IconoGuardar={editandoId ? Save : QrCode}
						/>
					</form>
				</Modal>
			)}

			{modal === 'qr' && seleccion && (
				<Modal titulo={`Código QR — ${seleccion.visitante}`} alCerrar={() => setModal(null)}>
					<div className="flex flex-col items-center gap-5">
						<div className="p-4 bg-white rounded-xl shadow-lg relative">
							{seleccion.estado !== 'Activo' && seleccion.estado !== 'Pendiente' && (
								<div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
									<span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg uppercase tracking-wider">
										{seleccion.estado}
									</span>
								</div>
							)}
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${window.location.origin}/garita/validar/${seleccion.codigo}`)}&color=09090b`}
								alt={`QR para ${seleccion.codigo}`}
								className="w-[160px] h-[160px] rounded-sm object-contain"
							/>
						</div>
						<p className="text-xs font-mono text-zinc-500 text-center">
							{seleccion.codigo}
							<br />
							<span className="text-[10px] opacity-70">(Escanea este QR con tu celular)</span>
						</p>
						{(seleccion.estado === 'Activo' || seleccion.estado === 'Pendiente') && (
							<button
								onClick={() => {
									setDatos(
										datos.map((d) => (d.id === seleccion.id ? { ...d, estado: 'Utilizado' } : d)),
									);
									setModal(null);
								}}
								className="mt-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-colors w-full"
							>
								Simular Escaneo en Garita (PC)
							</button>
						)}
					</div>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Invitación?"
					mensaje={`Vas a eliminar permanentemente el registro de visita para ${aEliminar.visitante}.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={() => {
						setDatos(datos.filter((inv) => inv.id !== aEliminar.id));
						setAEliminar(null);
					}}
				/>
			)}
		</div>
	);
}

/* ============================================================
   4. INFRACCIONES Y MULTAS
============================================================ */
export function ModuloMulta({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(multasEjemplo);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(false);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({ propiedad: '', infraccion: '', descripcion: '' });

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter((m) => limpiarBusqueda(m.propiedad).includes(termino))
		: datos;

	function registrar(e) {
		if (e) e.preventDefault();
		if (!form.propiedad || !form.infraccion) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);
		if (editandoId) {
			setDatos(
				datos.map((m) =>
					m.id === editandoId
						? {
								...m,
								propiedad: form.propiedad,
								infraccion: form.infraccion,
								residente: propObj?.inquilino || propObj?.propietario || '—',
							}
						: m,
				),
			);
		} else {
			const existente = datos.find(
				(m) => m.propiedad === form.propiedad && m.infraccion === form.infraccion,
			);
			if (existente) {
				const nuevosLlamados = existente.llamados + 1;
				if (nuevosLlamados === 3)
					alert(
						`¡Atención! Propiedad ${form.propiedad} alcanzó 3 llamados por "${form.infraccion}". Multa automática generada.`,
					);
				setDatos(
					datos.map((m) =>
						m.id === existente.id
							? {
									...m,
									llamados: nuevosLlamados,
									estado: nuevosLlamados >= 3 ? 'MULTA ACTIVA' : m.estado,
								}
							: m,
					),
				);
			} else {
				setDatos([
					...datos,
					{
						id: Date.now(),
						propiedad: form.propiedad,
						residente: propObj?.inquilino || propObj?.propietario || '—',
						infraccion: form.infraccion,
						llamados: 1,
						estado: 'ADVERTENCIA',
						fecha: new Date().toISOString().split('T')[0],
					},
				]);
			}
		}
		setModal(false);
		setEditandoId(null);
	}

	function abrirEditar(m) {
		setForm({
			propiedad: m.propiedad,
			infraccion: m.infraccion,
			descripcion: m.descripcion || '',
		});
		setEditandoId(m.id);
		setModal(true);
	}

	function IndicadorLlamados({ cantidad }) {
		const progreso = cantidad % 3 === 0 && cantidad > 0 ? 3 : cantidad % 3;
		const esMulta = cantidad >= 3;
		return (
			<div className="flex items-center gap-1.5">
				<div className="flex gap-0.5">
					{[1, 2, 3].map((n) => (
						<div
							key={n}
							className={`w-2 h-2 rounded-full transition-colors ${n <= progreso ? (esMulta ? 'bg-red-500' : 'bg-amber-400') : 'bg-zinc-700'}`}
						/>
					))}
				</div>
				<span className={`text-xs font-bold ${esMulta ? 'text-red-400' : 'text-secundario'}`}>
					{cantidad} total
				</span>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Sanciones Registradas"
					valor={datos.length}
					Icono={AlertTriangle}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Multas Activas"
					valor={datos.filter((m) => m.estado === 'MULTA ACTIVA').length}
					Icono={AlertTriangle}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Multas Pagadas"
					valor={datos.filter((m) => m.estado === 'PAGADO').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Llamados de Atención"
					valor={datos.reduce((s, m) => s + m.llamados, 0)}
					Icono={Zap}
					fondo="bg-amber-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ propiedad: '', infraccion: '', descripcion: '' });
							setEditandoId(null);
							setModal(true);
						}}
					>
						<Plus className="w-4 h-4" /> Nuevo Llamado
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Propiedad',
							'Responsable',
							'Motivo',
							'Llamados',
							'Fecha',
							'Estado Financiero',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((m, i) => (
							<Fila
								key={m.id}
								indice={i}
								seleccionada={filaActiva === m.id}
								onClick={() => setFilaActiva(filaActiva === m.id ? null : m.id)}
							>
								<Celda mono>{m.propiedad}</Celda>
								<Celda>{m.residente}</Celda>
								<Celda>{m.infraccion}</Celda>
								<td className="px-4 py-3">
									<IndicadorLlamados cantidad={m.llamados} />
								</td>
								<Celda>{m.fecha}</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={m.estado} variante={m.estado.toLowerCase()} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-2">
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(m)}
											colorHover="hover:text-blue-400"
										/>
										{m.estado === 'MULTA ACTIVA' && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													setDatos(datos.map((d) => (d.id === m.id ? { ...d, estado: 'PAGADO' } : d)));
												}}
												className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
											>
												Marcar pagado
											</button>
										)}
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar registro"
											onClick={() => setAEliminar(m)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="registros" />
			</div>

			{modal && (
				<Modal
					titulo={editandoId ? 'Editar Llamado de Atención' : 'Emitir Llamado de Atención'}
					alCerrar={() => {
						setModal(false);
						setEditandoId(null);
					}}
				>
					<form onSubmit={registrar} className="space-y-4">
						<Campo etiqueta="Propiedad infractora">
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
						<Campo etiqueta="Reglamento violado">
							<Selector
								value={form.infraccion}
								onChange={(e) => setForm({ ...form, infraccion: e.target.value })}
								required
							>
								<option value="">Seleccionar motivo...</option>
								<option>Ruido nocturno</option>
								<option>Mascotas sin bozal</option>
								<option>Basura fuera de hora</option>
								<option>Uso indebido de áreas comunes</option>
								<option>Daño a propiedad común</option>
							</Selector>
						</Campo>
						<Campo etiqueta="Observaciones">
							<textarea
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								rows={3}
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none transition-colors resize-none"
							/>
						</Campo>
						{!editandoId && (
							<div className="flex gap-2 p-3 rounded-lg bg-zinc-800/50 border border-borde">
								<AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<p className="text-xs text-zinc-400">
									Al llegar a 3 llamados por el mismo motivo, el estado cambiará a{' '}
									<strong className="text-red-400">MULTA ACTIVA</strong>.
								</p>
							</div>
						)}
						<BotonesModal
							alCancelar={() => {
								setModal(false);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Registrar Falta'}
						/>
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Registro?"
					mensaje={`Borrando este registro de la propiedad ${aEliminar.propiedad}. El conteo de llamados bajará.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={() => {
						setDatos(datos.filter((m) => m.id !== aEliminar.id));
						setAEliminar(null);
					}}
				/>
			)}
		</div>
	);
}
