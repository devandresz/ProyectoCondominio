// ============================================================
// 📁 RUTA: frontend/src/paginas/UsuariosPagina.jsx
// ============================================================
import { useState } from 'react';
import { Plus, Eye, Pencil, Ban, Users, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios.js';
import { TarjetaMetrica } from '../componentes/ui/Etiquetas.jsx';
import { Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import { toast } from 'sonner';

const ROLES = ['Administrador', 'Residente', 'Guardia', 'Colaborador'];

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function UsuariosPagina({ filtroGlobal = '' }) {
	const { usuarios, cargando, error, crear, actualizar, desactivar } = useUsuarios();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'crear' | 'editar' | 'ver'
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aDesactivar, setADesactivar] = useState(null);
	const [errorModal, setErrorModal] = useState('');

	const [form, setForm] = useState({
		nombreUsuario: '',
		nombre: '',
		apellido: '',
		correo: '',
		contrasena: '',
		telefono: '',
		idRol: 2,
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? usuarios.filter(
				(u) =>
					limpiar(u.NOMBRE_USUARIO).includes(termino) ||
					limpiar(u.NOMBRE).includes(termino) ||
					limpiar(u.APELLIDO).includes(termino) ||
					limpiar(u.CORREO).includes(termino) ||
					limpiar(u.ROL).includes(termino),
			)
		: usuarios;

	const abrirCrear = () => {
		setForm({
			nombreUsuario: '',
			nombre: '',
			apellido: '',
			correo: '',
			contrasena: '',
			telefono: '',
			idRol: 2,
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (u) => {
		setSeleccion(u);
		setForm({
			nombreUsuario: u.NOMBRE_USUARIO,
			nombre: u.NOMBRE,
			apellido: u.APELLIDO,
			correo: u.CORREO,
			contrasena: '',
			telefono: u.TELEFONO ?? '',
			idRol: u.ID_ROL,
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (u) => {
		setSeleccion(u);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			if (modal === 'crear') {
				const datos = { ...form, idRol: Number(form.idRol) };
				await crear(datos);
				toast.success('Usuario creado exitosamente');
			} else {
				const datos = { ...form, idRol: Number(form.idRol) };
				if (!datos.contrasena) delete datos.contrasena;
				await actualizar(seleccion.ID_USUARIO, datos);
				toast.success('Usuario actualizado exitosamente');
			}
			setModal(null);
		} catch (err) {
			setErrorModal(extraerError(err));
			toast.error('Error al guardar el usuario');
		}
	};

	const confirmarDesactivar = async () => {
		try {
			await desactivar(aDesactivar.ID_USUARIO);
			toast.success('Usuario desactivado exitosamente');
		} catch (err) {
			console.error('Error al desactivar:', extraerError(err));
			toast.error('Error al desactivar el usuario');
		}
		setADesactivar(null);
	};

	const varianteActivo = (activo) => (activo ? 'activo' : 'inactivo');

	if (cargando) return <div className="text-secundario text-sm p-8">Cargando usuarios...</div>;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Usuarios"
					valor={usuarios.length}
					Icono={Users}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={usuarios.filter((u) => u.ACTIVO).length}
					Icono={UserCheck}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={usuarios.filter((u) => !u.ACTIVO).length}
					Icono={UserX}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Administradores"
					valor={usuarios.filter((u) => u.ROL === 'Administrador').length}
					Icono={ShieldCheck}
					fondo="bg-sky-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirCrear}>
						<Plus className="w-4 h-4" /> Nuevo Usuario
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla columnas={['Usuario', 'Nombre', 'Correo', 'Rol', 'Estado', 'Acciones']} />
					<tbody>
						{filtrados.map((u) => (
							<Fila
								key={u.ID_USUARIO}
								seleccionada={filaActiva === u.ID_USUARIO}
								onClick={() => setFilaActiva(filaActiva === u.ID_USUARIO ? null : u.ID_USUARIO)}
							>
								<Celda mono>{u.NOMBRE_USUARIO}</Celda>
								<Celda>
									{u.NOMBRE} {u.APELLIDO}
								</Celda>
								<Celda>{u.CORREO}</Celda>
								<Celda>
									<Etiqueta texto={u.ROL} />
								</Celda>
								<Celda>
									<Etiqueta
										texto={u.ACTIVO ? 'Activo' : 'Inactivo'}
										variante={varianteActivo(u.ACTIVO)}
									/>
								</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(u)} Icono={Eye} titulo="Ver" />
										<BtnAccion onClick={() => abrirEditar(u)} Icono={Pencil} titulo="Editar" />
										{u.ACTIVO === 1 && (
											<BtnAccion
												onClick={() => setADesactivar(u)}
												Icono={Ban}
												titulo="Desactivar"
												colorHover="hover:text-red-400"
											/>
										)}
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={usuarios.length} unidad="usuarios" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Usuario' : 'Editar Usuario'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre de usuario">
								<Entrada
									required
									value={form.nombreUsuario}
									onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })}
									placeholder="ej: jperez"
								/>
							</Campo>
							<Campo etiqueta="Rol">
								<Selector
									value={form.idRol}
									onChange={(e) => setForm({ ...form, idRol: e.target.value })}
								>
									<option value={1}>Administrador</option>
									<option value={2}>Residente</option>
									<option value={3}>Guardia</option>
									<option value={4}>Colaborador</option>
								</Selector>
							</Campo>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre">
								<Entrada
									required
									value={form.nombre}
									onChange={(e) => setForm({ ...form, nombre: e.target.value })}
									placeholder="Juan"
								/>
							</Campo>
							<Campo etiqueta="Apellido">
								<Entrada
									required
									value={form.apellido}
									onChange={(e) => setForm({ ...form, apellido: e.target.value })}
									placeholder="Pérez"
								/>
							</Campo>
						</div>
						<Campo etiqueta="Correo">
							<Entrada
								required
								type="email"
								value={form.correo}
								onChange={(e) => setForm({ ...form, correo: e.target.value })}
								placeholder="juan@ejemplo.com"
							/>
						</Campo>
						<Campo
							etiqueta={
								modal === 'editar' ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'
							}
						>
							<Entrada
								required={modal === 'crear'}
								type="password"
								value={form.contrasena}
								onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
								placeholder="••••••••"
							/>
						</Campo>
						<Campo etiqueta="Teléfono (opcional)">
							<Entrada
								value={form.telefono}
								onChange={(e) => setForm({ ...form, telefono: e.target.value })}
								placeholder="502 1234 5678"
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
				<Modal titulo="Detalle de Usuario" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['Usuario', seleccion.NOMBRE_USUARIO],
							['Nombre', `${seleccion.NOMBRE} ${seleccion.APELLIDO}`],
							['Correo', seleccion.CORREO],
							['Teléfono', seleccion.TELEFONO ?? '—'],
							['Rol', seleccion.ROL],
							['Estado', seleccion.ACTIVO ? 'Activo' : 'Inactivo'],
						].map(([lbl, val]) => (
							<div key={lbl} className="flex justify-between border-b border-borde pb-2">
								<span className="text-secundario">{lbl}</span>
								<span className="text-primario font-medium">{val}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{aDesactivar && (
				<ModalConfirmacion
					titulo="¿Desactivar usuario?"
					mensaje={`El usuario "${aDesactivar.NOMBRE_USUARIO}" no podrá iniciar sesión.`}
					onConfirmar={confirmarDesactivar}
					onCancelar={() => setADesactivar(null)}
				/>
			)}
		</div>
	);
}
