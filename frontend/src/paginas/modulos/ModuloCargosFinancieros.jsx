import { useState } from 'react';
import { CreditCard, Search, FileText } from 'lucide-react';
import { cargosFinancierosApi } from '../../api/cargosFinancieros';

export default function ModuloCargosFinancieros() {
  const [idPropiedad, setIdPropiedad] = useState('');
  const [cargos, setCargos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

const consultar = async () => {
  if (!idPropiedad) {
    setError('Debes ingresar un ID de propiedad.');
    setCargos([]);
    return;
  }

  try {
    setCargando(true);
    setError('');

    const res = await cargosFinancierosApi.obtenerPorPropiedad(idPropiedad);
    setCargos(res.data);
  } catch (err) {
    console.error(err);
    setError('No se pudo consultar el estado de cuenta.');
    setCargos([]);
  } finally {
    setCargando(false);
  }
};

  return (
    <div className="space-y-6 p-6 text-white">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold">Cargos Financieros</h1>
            <p className="text-sm text-zinc-400">
              Consulta de estado de cuenta por propiedad. Módulo de solo lectura.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            value={idPropiedad}
            onChange={(e) => setIdPropiedad(e.target.value)}
            placeholder="Ingrese ID de propiedad"
            className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 outline-none"
          />
          <button
            onClick={consultar}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500"
          >
            <Search className="h-4 w-4" />
            Consultar
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-sky-400" />
          <h2 className="text-lg font-semibold">Estado de cuenta</h2>
        </div>

        {cargando ? (
          <p className="text-zinc-400">Cargando...</p>
        ) : cargos.length === 0 ? (
          <p className="text-zinc-400">No hay datos para mostrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-zinc-400">
                <tr>
                  <th className="px-3 py-3">Periodo</th>
                  <th className="px-3 py-3">Descripción</th>
                  <th className="px-3 py-3">Monto</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3">Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {cargos.map((cargo, index) => (
                  <tr key={cargo.ID_CARGO || index} className="border-b border-white/5">
                    <td className="px-3 py-3">{cargo.PERIODO}</td>
                    <td className="px-3 py-3">{cargo.DESCRIPCION}</td>
                    <td className="px-3 py-3">Q {cargo.MONTO}</td>
                    <td className="px-3 py-3">{cargo.ESTADO}</td>
                    <td className="px-3 py-3">{cargo.FECHA_VENCIMIENTO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}