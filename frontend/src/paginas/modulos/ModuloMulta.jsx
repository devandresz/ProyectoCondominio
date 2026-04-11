// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloMulta.jsx
// ============================================================
// import { useState } from 'react';
// import { CheckCircle, Plus, Pencil, Trash2, AlertTriangle, Zap } from 'lucide-react';
// import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
// import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
// import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
// import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
// import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
// import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
// import { toast } from 'sonner';

// export default function ModuloMulta({ }) {
// 	const [busqueda, setBusqueda] = useState('');
// 	const [modal, setModal] = useState(false);
// 	const [filaActiva, setFilaActiva] = useState(null);
// 	const [aEliminar, setAEliminar] = useState(null);
// 	const [editandoId, setEditandoId] = useState(null);
// 	const [form, setForm] = useState({ propiedad: '', infraccion: '', descripcion: '' });

// 	function abrirEditar(m) {
// 		setForm({
// 			propiedad: m.propiedad,
// 			infraccion: m.infraccion,
// 			descripcion: m.descripcion || '',
// 		});
// 		setEditandoId(m.id);
// 		setModal(true);
// 	}

// 	function IndicadorLlamados({ cantidad }) {
// 		const progreso = cantidad % 3 === 0 && cantidad > 0 ? 3 : cantidad % 3;
// 		const esMulta = cantidad >= 3;
// 		return (
// 			<div className="flex items-center gap-1.5">
// 				<div className="flex gap-0.5">
// 					{[1, 2, 3].map((n) => (
// 						<div
// 							key={n}
// 							className={`w-2 h-2 rounded-full transition-colors ${n <= progreso ? (esMulta ? 'bg-red-500' : 'bg-amber-400') : 'bg-zinc-700'}`}
// 						/>
// 					))}
// 				</div>
// 				<span className={`text-xs font-bold ${esMulta ? 'text-red-400' : 'text-secundario'}`}>
// 					{cantidad} total
// 				</span>
// 			</div>
// 		);
// 	}

//  function registrar(e) {
//      e.preventDefault();
//      // toast.success("Llamado guardado exitosamente");
//      setModal(false);
//  }

// 	return (
// 		<div className="space-y-6 animate-in fade-in duration-300">
// 			<div className="grid grid-cols-4 gap-4">
// 				<TarjetaMetrica
// 					etiqueta="Sanciones Registradas"
// 					valor={datos.length}
// 					Icono={AlertTriangle}
// 					fondo="bg-zinc-800"
// 				/>
// 				<TarjetaMetrica
// 					etiqueta="Multas Activas"
// 					valor={datos.filter((m) => m.estado === 'MULTA ACTIVA').length}
// 					Icono={AlertTriangle}
// 					fondo="bg-red-500/10"
// 				/>
// 				<TarjetaMetrica
// 					etiqueta="Multas Pagadas"
// 					valor={datos.filter((m) => m.estado === 'PAGADO').length}
// 					Icono={CheckCircle}
// 					fondo="bg-emerald-500/10"
// 				/>
// 				<TarjetaMetrica
// 					etiqueta="Llamados de Atención"
// 					valor={datos.reduce((s, m) => s + m.llamados, 0)}
// 					Icono={Zap}
// 					fondo="bg-amber-500/10"
// 				/>
// 			</div>

// 			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
// 				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
// 					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
// 					<BtnPrimario
// 						onClick={() => {
// 							setForm({ propiedad: '', infraccion: '', descripcion: '' });
// 							setEditandoId(null);
// 							setModal(true);
// 						}}
// 					>
// 						<Plus className="w-4 h-4" /> Nuevo Llamado
// 					</BtnPrimario>
// 				</div>
// 				<table className="w-full">
// 					<CabeceraTabla
// 						columnas={[
// 							'Propiedad',
// 							'Responsable',
// 							'Motivo',
// 							'Llamados',
// 							'Fecha',
// 							'Estado Financiero',
// 							'Acciones',
// 						]}
// 					/>
// 					<tbody>
// 						{filtrados.map((m, i) => (
// 							<Fila
// 								key={m.id}
// 								indice={i}
// 								seleccionada={filaActiva === m.id}
// 								onClick={() => setFilaActiva(filaActiva === m.id ? null : m.id)}
// 							>
// 								<Celda mono>{m.propiedad}</Celda>
// 								<Celda>{m.residente}</Celda>
// 								<Celda>{m.infraccion}</Celda>
// 								<td className="px-4 py-3">
// 									<IndicadorLlamados cantidad={m.llamados} />
// 								</td>
// 								<Celda>{m.fecha}</Celda>
// 								<td className="px-4 py-3">
// 									<Etiqueta texto={m.estado} variante={m.estado.toLowerCase()} />
// 								</td>
// 								<td className="px-4 py-3">
// 									<div className="flex items-center gap-2">
// 										<BtnAccion
// 											Icono={Pencil}
// 											titulo="Editar"
// 											onClick={() => abrirEditar(m)}
// 											colorHover="hover:text-blue-400"
// 										/>
// 										{m.estado === 'MULTA ACTIVA' && (
// 											<button
// 												onClick={(e) => {
// 													e.stopPropagation();
// 													setDatos(datos.map((d) => (d.id === m.id ? { ...d, estado: 'PAGADO' } : d)));
//                                                     // toast.success("Multa marcada como pagada");
// 												}}
// 												className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
// 											>
// 												Marcar pagado
// 											</button>
// 										)}
// 										<BtnAccion
// 											Icono={Trash2}
// 											titulo="Eliminar registro"
// 											onClick={() => setAEliminar(m)}
// 											colorHover="hover:text-red-500"
// 										/>
// 									</div>
// 								</td>
// 							</Fila>
// 						))}
// 					</tbody>
// 				</table>
// 				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="registros" />
// 			</div>

// 			{modal && (
// 				<Modal
// 					titulo={editandoId ? 'Editar Llamado de Atención' : 'Emitir Llamado de Atención'}
// 					alCerrar={() => {
// 						setModal(false);
// 						setEditandoId(null);
// 					}}
// 				>
// 					<form onSubmit={registrar} className="space-y-4">
// 						<Campo etiqueta="Propiedad infractora">
// 							<Selector
// 								value={form.propiedad}
// 								onChange={(e) => setForm({ ...form, propiedad: e.target.value })}
// 								required
// 							>
// 								<option value="">Seleccionar propiedad...</option>
// 								{propiedadesEjemplo
// 									.filter((p) => p.estado === 'Activo')
// 									.map((p) => (
// 										<option key={p.id} value={p.numero}>
// 											{p.numero} — {p.inquilino || p.propietario}
// 										</option>
// 									))}
// 							</Selector>
// 						</Campo>
// 						<Campo etiqueta="Reglamento violado">
// 							<Selector
// 								value={form.infraccion}
// 								onChange={(e) => setForm({ ...form, infraccion: e.target.value })}
// 								required
// 							>
// 								<option value="">Seleccionar motivo...</option>
// 								<option>Ruido nocturno</option>
// 								<option>Mascotas sin bozal</option>
// 								<option>Basura fuera de hora</option>
// 								<option>Uso indebido de áreas comunes</option>
// 								<option>Daño a propiedad común</option>
// 							</Selector>
// 						</Campo>
// 						<Campo etiqueta="Observaciones">
// 							<textarea
// 								value={form.descripcion}
// 								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
// 								rows={3}
// 								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none transition-colors resize-none"
// 							/>
// 						</Campo>
// 						{!editandoId && (
// 							<div className="flex gap-2 p-3 rounded-lg bg-zinc-800/50 border border-borde">
// 								<AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
// 								<p className="text-xs text-zinc-400">
// 									Al llegar a 3 llamados por el mismo motivo, el estado cambiará a{' '}
// 									<strong className="text-red-400">MULTA ACTIVA</strong>.
// 								</p>
// 							</div>
// 						)}
// 						<BotonesModal
// 							alCancelar={() => {
// 								setModal(false);
// 								setEditandoId(null);
// 							}}
// 							textoGuardar={editandoId ? 'Actualizar' : 'Registrar Falta'}
// 						/>
// 					</form>
// 				</Modal>
// 			)}

// 			{aEliminar && (
// 				<ModalConfirmacion
// 					titulo="¿Eliminar Registro?"
// 					mensaje={`Borrando este registro de la propiedad ${aEliminar.propiedad}. El conteo de llamados bajará.`}
// 					onCancelar={() => setAEliminar(null)}
// 					onConfirmar={() => {
// 						setDatos(datos.filter((m) => m.id !== aEliminar.id));
// 						setAEliminar(null);
//                      // toast.success("Llamado eliminado correctamente");
// 					}}
// 				/>
// 			)}
// 		</div>
// 	);
// }
