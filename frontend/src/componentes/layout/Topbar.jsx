import { Search, Sun, Moon, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../estado/useStore.js';
import { usuariosApi } from '../../api/usuariosApi.js';

export function Topbar({ moduloActivo, busquedaGlobal, setBusquedaGlobal, subtitulo }) {
	const { temaOscuro, toggleTema, limpiarUsuario } = useStore();
	const navigate = useNavigate();

	const cerrarSesion = async () => {
		try {
			await usuariosApi.logout();
		} catch (_) {
			// si falla igual limpiamos el estado local
		} finally {
			limpiarUsuario();
			navigate('/login');
		}
	};

	return (
		<header className="flex items-center justify-between h-16 px-8 border-b border-borde bg-fondo/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-30">
			<div>
				<h1 className="text-[17px] font-bold font-title text-primario leading-tight">
					{moduloActivo}
				</h1>
				<p className="text-[11px] text-zinc-500 leading-tight font-medium mt-0.5">{subtitulo}</p>
			</div>

			<div className="flex items-center gap-4">
				{/* Búsqueda global */}
				<div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-tarjeta border-borde w-64 focus-within:border-zinc-500 transition-all shadow-sm">
					<Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
					<input
						type="text"
						value={busquedaGlobal}
						onChange={(e) => setBusquedaGlobal(e.target.value)}
						placeholder="Búsqueda General"
						className="w-full text-[13px] bg-transparent border-none outline-none text-primario placeholder:text-zinc-600"
					/>
					{busquedaGlobal && (
						<button
							onClick={() => setBusquedaGlobal('')}
							className="text-zinc-600 hover:text-zinc-300 transition-colors bg-zinc-800 rounded-full p-0.5"
						>
							<X className="w-3 h-3" />
						</button>
					)}
				</div>

				{/* Toggle tema */}
				<button
					onClick={toggleTema}
					className="p-2 rounded-lg text-zinc-400 hover:text-primario hover:bg-tarjeta transition-colors"
					title={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
				>
					{temaOscuro ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
				</button>

				<div className="h-6 w-px bg-borde mx-1" />

				{/* Cerrar sesión */}
				<button
					onClick={cerrarSesion}
					className="px-4 py-2 text-[13px] font-bold rounded-lg bg-primario text-fondo hover:bg-white/90 transition-all shadow-sm"
				>
					Cerrar sesión
				</button>
			</div>
		</header>
	);
}
