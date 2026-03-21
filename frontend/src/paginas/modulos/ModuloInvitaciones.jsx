import { useState, useEffect } from 'react';
import {
    QrCode,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Ban,
    Eye,
    User,
    CalendarClock
} from 'lucide-react';
import { invitacionesApi } from '../../api/invitacionesApi.js';
import { usuariosApi } from '../../api/usuariosApi.js'; // Para traer los residentes
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
import { formatearFecha } from '../../utilidades/formatearFecha.js'; // Asumiendo que tienes esto

export default function ModuloInvitaciones({ filtroGlobal = '' }) {
    const [datos, setDatos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [modal, setModal] = useState(null);
    const [seleccion, setSeleccion] = useState(null);
    const [filaActiva, setFilaActiva] = useState(null);
    
    const [form, setForm] = useState({
        idUsuario: '',
        tipo: 'Normal',
        nombreVisitante: '',
    });

    // Mapeo de tipos para Oracle
    const mapTipoId = { 'Normal': 1, 'Servicio': 2 };

    const cargarDatos = async () => {
        setCargando(true);
        try {
            // Traemos las invitaciones
            const resInvitaciones = await invitacionesApi.obtenerTodas();
            
            // Formateamos para la tabla
            const datosFormateados = resInvitaciones.data.map((i) => ({
                id: i.ID_INVITACION,
                residente: i.NOMBRE_RESIDENTE,
                tipo: i.TIPO_INVITACION,
                visitante: i.NOMBRE_VISITANTE,
                codigoQr: i.CODIGO_QR,
                fechaGeneracion: i.FECHA_GENERACION,
                fechaExpiracion: i.FECHA_EXPIRACION,
                estado: i.ACTIVO === 1 ? 'Activa' : 'Inactiva',
            }));
            setDatos(datosFormateados);

            // Traemos los usuarios para el selector del formulario
            const resUsuarios = await usuariosApi.obtenerTodos();
            setUsuarios(resUsuarios.data || []);
            
        } catch (error) {
            console.error('Error al cargar datos:', error);
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
                (i) =>
                    i.visitante.toLowerCase().includes(termino) ||
                    i.residente.toLowerCase().includes(termino) ||
                    i.codigoQr.toLowerCase().includes(termino)
            )
        : datos;

    const guardarNuevo = async (e) => {
        if (e) e.preventDefault();
        if (!form.idUsuario || !form.nombreVisitante.trim()) return;

        const payload = {
            idUsuario: Number(form.idUsuario),
            idTipo: mapTipoId[form.tipo],
            nombreVisitante: form.nombreVisitante.trim(),
        };

        try {
            await invitacionesApi.crear(payload);
            await cargarDatos();
            setModal(null);
        } catch (error) {
            console.error('Error al crear invitación:', error);
            alert('Error al generar la invitación. Verifica la consola.');
        }
    };

    const toggleEstado = async (id, estadoActual) => {
        try {
            const nuevoActivo = estadoActual === 'Activa' ? 0 : 1;
            await invitacionesApi.actualizar(id, { activo: nuevoActivo });
            await cargarDatos();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
    };

    if (cargando) return <div className="p-8 text-center text-zinc-400 animate-pulse">Cargando invitaciones desde Oracle...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-4 gap-4">
                <TarjetaMetrica etiqueta="Total Generadas" valor={datos.length} Icono={QrCode} fondo="bg-zinc-800" />
                <TarjetaMetrica etiqueta="Activas" valor={datos.filter((i) => i.estado === 'Activa').length} Icono={CheckCircle} fondo="bg-emerald-500/10" />
                <TarjetaMetrica etiqueta="Tipo Normal" valor={datos.filter((i) => i.tipo === 'Normal').length} Icono={User} fondo="bg-blue-500/10" />
                <TarjetaMetrica etiqueta="Tipo Servicio" valor={datos.filter((i) => i.tipo === 'Servicio').length} Icono={CalendarClock} fondo="bg-amber-500/10" />
            </div>

            <div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
                    <BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
                    <BtnPrimario onClick={() => { setForm({ idUsuario: '', tipo: 'Normal', nombreVisitante: '' }); setModal('nuevo'); }}>
                        <Plus className="w-4 h-4" /> Generar Invitación
                    </BtnPrimario>
                </div>
                <table className="w-full">
                    <CabeceraTabla columnas={['Código QR', 'Visitante', 'Residente que invita', 'Tipo', 'Expiración', 'Estado', 'Acciones']} />
                    <tbody>
                        {filtrados.map((inv, i) => (
                            <Fila key={inv.id} indice={i} seleccionada={filaActiva === inv.id} onClick={() => setFilaActiva(filaActiva === inv.id ? null : inv.id)}>
                                <Celda mono>
                                    <div className="flex items-center gap-2">
                                        <QrCode className="w-4 h-4 text-zinc-500" />
                                        {inv.codigoQr.split('-')[2]} {/* Mostramos solo el fragmento final para no saturar */}
                                    </div>
                                </Celda>
                                <Celda className="font-bold text-primario">{inv.visitante}</Celda>
                                <Celda>{inv.residente}</Celda>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${inv.tipo === 'Normal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        {inv.tipo}
                                    </span>
                                </td>
                                <Celda className="text-xs">
                                    {inv.tipo === 'Normal' && inv.fechaExpiracion ? (
                                        <span className="text-red-400">Hoy 23:59</span>
                                    ) : (
                                        <span className="text-emerald-400">Sin expiración</span>
                                    )}
                                </Celda>
                                <td className="px-4 py-3">
                                    <Etiqueta texto={inv.estado} variante={inv.estado === 'Activa' ? 'activo' : 'inactivo'} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <BtnAccion Icono={Eye} titulo="Ver Detalle y QR" onClick={() => { setSeleccion(inv); setModal('detalle'); }} />
                                        <BtnAccion Icono={Ban} titulo="Activar/Desactivar" onClick={() => toggleEstado(inv.id, inv.estado)} colorHover="hover:text-amber-400" />
                                    </div>
                                </td>
                            </Fila>
                        ))}
                    </tbody>
                </table>
                <PieTabla mostrados={filtrados.length} total={datos.length} unidad="invitaciones" />
            </div>

            {modal === 'nuevo' && (
                <Modal titulo="Generar Nueva Invitación" alCerrar={() => setModal(null)}>
                    <form onSubmit={guardarNuevo} className="space-y-4">
                        <Campo etiqueta="Residente que invita">
                            <Selector required value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}>
                                <option value="">Seleccione un usuario...</option>
                                {usuarios.map(u => (
                                    <option key={u.ID_USUARIO} value={u.ID_USUARIO}>{u.NOMBRE} {u.APELLIDO}</option>
                                ))}
                            </Selector>
                        </Campo>
                        <div className="grid grid-cols-2 gap-4">
                            <Campo etiqueta="Nombre del Visitante">
                                <Entrada required value={form.nombreVisitante} onChange={(e) => setForm({ ...form, nombreVisitante: e.target.value })} placeholder="Ej: Juan Pérez" />
                            </Campo>
                            <Campo etiqueta="Tipo de Invitación">
                                <Selector value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                                    <option value="Normal">Normal (Expira hoy)</option>
                                    <option value="Servicio">Servicio (Reutilizable)</option>
                                </Selector>
                            </Campo>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/60 border border-borde text-xs text-secundario space-y-1">
                            <p>⚠️ <strong>Nota de Seguridad:</strong> El código QR se generará automáticamente en el sistema y será validado por la garita de seguridad.</p>
                        </div>
                        <BotonesModal alCancelar={() => setModal(null)} textoGuardar="Generar Invitación" />
                    </form>
                </Modal>
            )}

            {modal === 'detalle' && seleccion && (
                <Modal titulo={`Pase de Acceso`} alCerrar={() => setModal(null)}>
                    <div className="flex flex-col items-center justify-center space-y-4 pb-4 border-b border-borde/50 mb-4">
                        {/* Simulador visual de código QR */}
                        <div className="bg-white p-4 rounded-xl">
                            <QrCode className="w-32 h-32 text-black" strokeWidth={1.5} />
                        </div>
                        <p className="font-mono text-sm tracking-widest text-primario bg-zinc-800 px-3 py-1 rounded-md">{seleccion.codigoQr}</p>
                    </div>

                    <div className="space-y-0">
                        {[
                            ['Visitante', seleccion.visitante],
                            ['Invitado por', seleccion.residente],
                            ['Tipo de Pase', seleccion.tipo],
                            ['Expiración', seleccion.tipo === 'Normal' ? 'Vence hoy a las 23:59 hrs' : 'No expira automáticamente'],
                            ['Estado del Pase', seleccion.estado],
                        ].map(([k, v]) => (
                            <div key={k} className="flex justify-between py-3 border-b border-borde/50 last:border-0">
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