import { useState, useEffect } from 'react';
import {
    Building,
    CheckCircle,
    Users,
    Plus,
    Eye,
    Pencil,
    Ban,
    Trash2
} from 'lucide-react';
import { propiedadesApi } from '../../api/propiedadesApi.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';

export default function ModuloPropiedades({ filtroGlobal = '' }) {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);
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

    const mapCategoriaId = { 'Básica': 1, 'Intermedia': 2, 'Completa': 3 };
    const cuotaPorCategoria = { Básica: 500, Intermedia: 800, Completa: 1200 };
    const parqueosPorCategoria = { Básica: 1, Intermedia: 2, Completa: 3 };
    const colorCategoria = {
        Básica: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        Intermedia: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        Completa: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    };

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const respuesta = await propiedadesApi.obtenerTodas();
            const datosFormateados = respuesta.data.map((p) => {
                // Truco: Separamos el propietario y el inquilino de la descripción
                const desc = p.DESCRIPCION || '';
                const partes = desc.split(' | INQ: ');
                const prop = partes[0] || 'Sin asignar';
                const inq = partes[1] || null;

                return {
                    id: p.ID_PROPIEDAD,
                    numero: p.NUMERO_PROPIEDAD,
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
                    (p.inquilino && p.inquilino.toLowerCase().includes(termino))
            )
        : datos;

    const guardarNuevo = async (e) => {
        if (e) e.preventDefault();
        if (!form.numero.trim() || !form.propietario.trim()) return;

        // Truco: Unimos al propietario y al inquilino para guardarlos en Oracle
        const descFinal = form.inquilino.trim() 
            ? `${form.propietario.trim()} | INQ: ${form.inquilino.trim()}` 
            : form.propietario.trim();

        const payload = {
            idCategoria: mapCategoriaId[form.categoria] || 1,
            numeroPropiedad: form.numero.trim().toUpperCase(),
            descripcion: descFinal,
            activo: 1
        };

        try {
            if (editandoId) {
                await propiedadesApi.actualizar(editandoId, payload);
            } else {
                await propiedadesApi.crear(payload);
            }
            await cargarDatos();
            setModal(null);
            setEditandoId(null);
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(error.response?.data?.mensaje || 'Error al guardar la propiedad');
        }
    };

    function abrirEditar(p) {
        setForm({
            numero: p.numero,
            categoria: p.categoria,
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
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
    };

    if (cargando) return <div className="p-8 text-center text-zinc-400 animate-pulse">Cargando datos desde Oracle...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-4 gap-4">
                <TarjetaMetrica etiqueta="Total Unidades" valor={datos.length} Icono={Building} fondo="bg-zinc-800" />
                <TarjetaMetrica etiqueta="Activas" valor={datos.filter((p) => p.estado === 'Activo').length} Icono={CheckCircle} fondo="bg-emerald-500/10" />
                <TarjetaMetrica etiqueta="Con Inquilino" valor={datos.filter((p) => p.inquilino).length} Icono={Users} fondo="bg-sky-500/10" />
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
                    <BtnPrimario onClick={() => { setForm({ numero: '', categoria: 'Básica', propietario: '', inquilino: '' }); setEditandoId(null); setModal('nuevo'); }}>
                        <Plus className="w-4 h-4" /> Registrar Propiedad
                    </BtnPrimario>
                </div>
                <table className="w-full">
                    <CabeceraTabla columnas={['Número', 'Categoría', 'Cuota', 'Usuarios Registrados', 'Estado', 'Acciones']} />
                    <tbody>
                        {filtrados.map((p, i) => (
                            <Fila key={p.id} indice={i} seleccionada={filaActiva === p.id} onClick={() => setFilaActiva(filaActiva === p.id ? null : p.id)}>
                                <Celda mono>{p.numero}</Celda>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${colorCategoria[p.categoria]}`}>
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
                                        <BtnAccion Icono={Eye} titulo="Ver detalle" onClick={() => { setSeleccion(p); setModal('detalle'); }} />
                                        <BtnAccion Icono={Pencil} titulo="Editar" onClick={() => abrirEditar(p)} colorHover="hover:text-blue-400" />
                                        <BtnAccion Icono={Ban} titulo="Activar/Inactivar" onClick={() => toggleEstado(p.id, p.estado)} colorHover="hover:text-amber-400" />
                                        <BtnAccion Icono={Trash2} titulo="Eliminar propiedad" onClick={() => setAEliminar(p)} colorHover="hover:text-red-500" />
                                    </div>
                                </td>
                            </Fila>
                        ))}
                    </tbody>
                </table>
                <PieTabla mostrados={filtrados.length} total={datos.length} unidad="propiedades" />
            </div>

            {modal === 'nuevo' && (
                <Modal titulo={editandoId ? 'Editar Propiedad' : 'Registrar Propiedad'} alCerrar={() => { setModal(null); setEditandoId(null); }}>
                    <form onSubmit={guardarNuevo} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Campo etiqueta="Número de propiedad">
                                <Entrada value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} placeholder="Ej: A-101" required />
                            </Campo>
                            <Campo etiqueta="Categoría">
                                <Selector value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                                    <option>Básica</option>
                                    <option>Intermedia</option>
                                    <option>Completa</option>
                                </Selector>
                            </Campo>
                        </div>
                        <Campo etiqueta="Nombre del Propietario (Obligatorio)">
                            <Entrada value={form.propietario} onChange={(e) => setForm({ ...form, propietario: e.target.value })} placeholder="Nombre completo" required />
                        </Campo>
                        <Campo etiqueta="Nombre del Inquilino (Opcional)">
                            <Entrada value={form.inquilino} onChange={(e) => setForm({ ...form, inquilino: e.target.value })} placeholder="Dejar en blanco si no hay" />
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
                        <BotonesModal alCancelar={() => { setModal(null); setEditandoId(null); }} textoGuardar={editandoId ? 'Actualizar' : 'Guardar'} />
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
                            <div key={k} className="flex justify-between py-3 border-b border-borde/50 last:border-0">
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
                        // Eliminación visual temporal (el backend de eliminar lo haremos después si lo necesitan)
                        setDatos(datos.filter((p) => p.id !== aEliminar.id));
                        setAEliminar(null);
                    }}
                />
            )}
        </div>
    );
}