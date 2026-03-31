import { useEffect, useState } from 'react';
import { Trees, Pencil, Power } from 'lucide-react';
import { areasSocialesApi } from '../../api/areasSociales.js';

const estadoInicialFormulario = {
  NOMBRE: '',
  DESCRIPCION: '',
  HORA_APERTURA: '',
  HORA_CIERRE: '',
  PRECIO_POR_HORA: '',
  ACTIVO: 1,
};

export default function ModuloAreasSociales() {
  const [areas, setAreas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [areaEditando, setAreaEditando] = useState(null);
  const [formulario, setFormulario] = useState(estadoInicialFormulario);

  const cargarAreas = async () => {
    try {
      setCargando(true);
      setError('');
      const res = await areasSocialesApi.obtenerTodas();
      setAreas(res.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las áreas sociales.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAreas();
  }, []);

  const abrirModalEdicion = (area) => {
    setAreaEditando(area);
    setFormulario({
      NOMBRE: area.NOMBRE ?? '',
      DESCRIPCION: area.DESCRIPCION ?? '',
      HORA_APERTURA: area.HORA_APERTURA ?? '',
      HORA_CIERRE: area.HORA_CIERRE ?? '',
      PRECIO_POR_HORA: area.PRECIO_POR_HORA ?? '',
      ACTIVO: area.ACTIVO ?? 1,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setAreaEditando(null);
    setFormulario(estadoInicialFormulario);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();

    if (!areaEditando) return;

    try {
      setGuardando(true);
      setError('');

      await areasSocialesApi.actualizar(areaEditando.ID_AREA, {
        nombre: formulario.NOMBRE,
        descripcion: formulario.DESCRIPCION,
        hora_apertura: formulario.HORA_APERTURA,
        hora_cierre: formulario.HORA_CIERRE,
        precio_por_hora: Number(formulario.PRECIO_POR_HORA),
        activo: Number(formulario.ACTIVO),
      });

      await cargarAreas();
      cerrarModal();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el área social.');
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (area) => {
    try {
      setError('');
      await areasSocialesApi.cambiarEstado(
        area.ID_AREA,
        area.ACTIVO ? 0 : 1
      );
      await cargarAreas();
    } catch (err) {
      console.error(err);
      setError('No se pudo cambiar el estado del área social.');
    }
  };

  return (
    <div className="space-y-6 p-6 text-white">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Trees className="h-6 w-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold">Áreas Sociales</h1>
            <p className="text-sm text-zinc-400">
              Gestión de espacios comunes, horarios y precio por hora.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-zinc-400">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-zinc-400">
                <tr>
                  <th className="px-3 py-3">Área</th>
                  <th className="px-3 py-3">Descripción</th>
                  <th className="px-3 py-3">Horario</th>
                  <th className="px-3 py-3">Precio</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.ID_AREA} className="border-b border-white/5">
                    <td className="px-3 py-3 font-medium">{area.NOMBRE}</td>
                    <td className="px-3 py-3">{area.DESCRIPCION}</td>
                    <td className="px-3 py-3">
                      {area.HORA_APERTURA} - {area.HORA_CIERRE}
                    </td>
                    <td className="px-3 py-3">
                      Q {Number(area.PRECIO_POR_HORA).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          area.ACTIVO
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {area.ACTIVO ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => abrirModalEdicion(area)}
                          className="inline-flex items-center gap-2 rounded-lg bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-400 hover:bg-sky-500/20"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </button>

                        <button
                          onClick={() => cambiarEstado(area)}
                          className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
                        >
                          <Power className="h-4 w-4" />
                          {area.ACTIVO ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {areas.length === 0 && (
              <p className="px-3 py-6 text-zinc-400">
                No hay áreas sociales para mostrar.
              </p>
            )}
          </div>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Editar área social</h2>
              <p className="text-sm text-zinc-400">
                Modifica nombre, descripción, horarios, precio y estado.
              </p>
            </div>

            <form onSubmit={guardarEdicion} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Nombre</label>
                <input
                  type="text"
                  name="NOMBRE"
                  value={formulario.NOMBRE}
                  onChange={manejarCambio}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Descripción</label>
                <textarea
                  name="DESCRIPCION"
                  value={formulario.DESCRIPCION}
                  onChange={manejarCambio}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">Hora de apertura</label>
                  <input
                    type="time"
                    name="HORA_APERTURA"
                    value={formulario.HORA_APERTURA}
                    onChange={manejarCambio}
                    className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">Hora de cierre</label>
                  <input
                    type="time"
                    name="HORA_CIERRE"
                    value={formulario.HORA_CIERRE}
                    onChange={manejarCambio}
                    className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">Precio por hora</label>
                  <input
                    type="number"
                    name="PRECIO_POR_HORA"
                    value={formulario.PRECIO_POR_HORA}
                    onChange={manejarCambio}
                    className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">Estado</label>
                  <select
                    name="ACTIVO"
                    value={formulario.ACTIVO}
                    onChange={manejarCambio}
                    className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}