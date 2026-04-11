// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloTiposCargo.jsx
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { Layers, ShieldAlert, Coins, CheckCircle, Plus, Eye, Pencil, Ban } from 'lucide-react';
import { tiposCargoApi } from '../../api/tiposCargo.js';
import { limpiarBusqueda } from '../../datos/datosDePrueba.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloTiposCargo({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [cargando, setCargando] = useState(true);
	const [guardando, setGuardando] = useState(false);

	const [form, setForm] = useState({
		nombre: '',
		descripcion: '',
		monto: 0,
		esMulta: 0,
	});

	useEffect(() => {
		cargarTiposCargo();
	}, []);

	async function cargarTiposCargo() {
		try {
			setCargando(true);
			const respuesta = await tiposCargoApi.obtenerTodos();
			setDatos(respuesta.data);
		} catch (error) {
			console.error('Error al cargar tipos de cargo:', error);
		} finally {
			setCargando(false);
		}
	}

	const termino = limpiarBusqueda(busqueda || filtroGlobal);

	const filtrados = useMemo(() => {
		if (!termino) return datos;

		return datos.filter(
			(t) =>
				limpiarBusqueda(t.NOMBRE).includes(termino) ||
				limpiarBusqueda(t.DESCRIPCION).includes(termino),
		);
	}, [datos, termino]);

	function abrirNuevo() {
		setForm({
			nombre: '',
			descripcion: '',
			monto: 0,
			esMulta: 0,
		});
		setEditandoId(null);
		setModal('nuevo');
	}

	function abrirEditar(tipo) {
		setForm({
			nombre: tipo.NOMBRE ?? '',
			descripcion: tipo.DESCRIPCION ?? '',
			monto: Number(tipo.MONTO ?? 0),
			esMulta: Number(tipo.ES_MULTA ?? 0),
		});
		setEditandoId(tipo.ID_TIPO_CARGO);
		setModal('nuevo');
	}

	async function guardarTipoCargo(e) {
		e.preventDefault();

		try {
			setGuardando(true);

			const payload = {
				nombre: form.nombre.trim(),
				descripcion: form.descripcion.trim(),
				monto: Number(form.monto),
				esMulta: Number(form.esMulta),
			};

			if (editandoId) {
				await tiposCargoApi.actualizar(editandoId, payload);
				toast.success('Tipo de cargo actualizado exitosamente');
			} else {
				await tiposCargoApi.crear(payload);
				toast.success('Tipo de cargo creado exitosamente');
			}

			await cargarTiposCargo();
			setModal(null);
			setEditandoId(null);
		} catch (error) {
			console.error('Error al guardar tipo de cargo:', error);
			toast.error(error?.response?.data?.mensaje || 'No se pudo guardar el tipo de cargo.');
		} finally {
			setGuardando(false);
		}
	}

	async function toggleEstado(tipo) {
		try {
			if (tipo.ACTIVO === 1) {
				await tiposCargoApi.desactivar(tipo.ID_TIPO_CARGO);
			} else {
				await tiposCargoApi.actualizar(tipo.ID_TIPO_CARGO, { activo: 1 });
			}

			await cargarTiposCargo();
			toast.success('Estado actualizado correctamente');
		} catch (error) {
			console.error('Error al cambiar estado:', error);
			toast.error('No se pudo cambiar el estado.');
		}
	}

	const total = datos.length;
	const multas = datos.filter((t) => t.ES_MULTA === 1).length;
	const dinamicos = datos.filter((t) => t.ES_MULTA === 0).length;
	const activos = datos.filter((t) => t.ACTIVO === 1).length;

	if (cargando) {
		return <div className="text-secundario">Cargando tipos de cargo...</div>;
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total conceptos"
					valor={total}
					Icono={Layers}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Multas"
					valor={multas}
					Icono={ShieldAlert}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Dinámicos"
					valor={dinamicos}
					Icono={Coins}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={activos}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirNuevo}>
						<Plus className="w-4 h-4" /> Nuevo Tipo de Cargo
					</BtnPrimario>
				</div>

				<table className="w-full">
					<CabeceraTabla
						columnas={['Nombre', 'Descripción', 'Monto', 'Tipo', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((tipo, i) => (
							<Fila
								key={tipo.ID_TIPO_CARGO}
								indice={i}
								seleccionada={filaActiva === tipo.ID_TIPO_CARGO}
								onClick={() =>
									setFilaActiva(filaActiva === tipo.ID_TIPO_CARGO ? null : tipo.ID_TIPO_CARGO)
								}
							>
								<Celda mono>{tipo.NOMBRE}</Celda>

								<Celda>{tipo.DESCRIPCION || 'Sin descripción'}</Celda>

								<Celda>
									{Number(tipo.MONTO) > 0 ? `Q${Number(tipo.MONTO).toFixed(2)}` : 'Dinámico'}
								</Celda>

								<td className="px-4 py-3">
									<Etiqueta
										texto={tipo.ES_MULTA === 1 ? 'Multa' : 'Dinámico'}
										variante={tipo.ES_MULTA === 1 ? 'inactivo' : 'activo'}
									/>
								</td>

								<td className="px-4 py-3">
									<Etiqueta
										texto={tipo.ACTIVO === 1 ? 'Activo' : 'Inactivo'}
										variante={tipo.ACTIVO === 1 ? 'activo' : 'inactivo'}
									/>
								</td>

								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Eye}
											titulo="Ver detalle"
											onClick={() => {
												setSeleccion(tipo);
												setModal('detalle');
											}}
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(tipo)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Ban}
											titulo="Activar/Inactivar"
											onClick={() => toggleEstado(tipo)}
											colorHover="hover:text-amber-400"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>

				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="tipos de cargo" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Tipo de Cargo' : 'Registrar Tipo de Cargo'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardarTipoCargo} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre">
								<Entrada
									value={form.nombre}
									onChange={(e) => setForm({ ...form, nombre: e.target.value })}
									placeholder="Ej: Multa ruido excesivo"
									required
								/>
							</Campo>

							<Campo etiqueta="Tipo">
								<Selector
									value={form.esMulta}
									onChange={(e) =>
										setForm({
											...form,
											esMulta: Number(e.target.value),
										})
									}
								>
									<option value={0}>Cargo dinámico</option>
									<option value={1}>Multa fija</option>
								</Selector>
							</Campo>
						</div>

						<Campo etiqueta="Descripción">
							<Entrada
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Descripción del concepto financiero"
							/>
						</Campo>

						<Campo etiqueta="Monto">
							<Entrada
								type="number"
								min="0"
								step="0.01"
								value={form.monto}
								onChange={(e) =>
									setForm({
										...form,
										monto: e.target.value === '' ? '' : Number(e.target.value),
									})
								}
								placeholder="0.00"
								required
							/>
						</Campo>

						<div className="p-3 rounded-lg bg-zinc-800/60 border border-borde text-xs text-secundario space-y-1">
							<p>
								Tipo seleccionado:{' '}
								<span className="text-primario font-bold">
									{Number(form.esMulta) === 1 ? 'Multa con monto fijo' : 'Cargo dinámico'}
								</span>
							</p>
							<p>
								Comportamiento esperado:{' '}
								<span className="text-primario font-bold">
									{Number(form.esMulta) === 1
										? 'Se usará el monto del catálogo.'
										: 'El sistema podrá calcular el monto dinámicamente.'}
								</span>
							</p>
						</div>

						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'detalle' && seleccion && (
				<Modal titulo={`Detalle — ${seleccion.NOMBRE}`} alCerrar={() => setModal(null)}>
					<div className="space-y-0">
						{[
							['ID', seleccion.ID_TIPO_CARGO],
							['Nombre', seleccion.NOMBRE],
							['Descripción', seleccion.DESCRIPCION || 'Sin descripción'],
							[
								'Monto',
								Number(seleccion.MONTO) > 0
									? `Q${Number(seleccion.MONTO).toFixed(2)}`
									: 'Dinámico / 0.00',
							],
							['Es multa', seleccion.ES_MULTA === 1 ? 'Sí' : 'No'],
							['Estado', seleccion.ACTIVO === 1 ? 'Activo' : 'Inactivo'],
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
		</div>
	);
}
