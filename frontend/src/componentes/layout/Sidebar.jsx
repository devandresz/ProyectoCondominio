import { ChevronDown, ChevronRight, Lock, Building } from 'lucide-react';
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { GRUPOS } from '../../datos/datosDePrueba.js';
import useStore from '../../estado/useStore.js';

export function Sidebar({ moduloActivo, setModuloActivo }) {
	const usuario = useStore((s) => s.usuario);
	const [grupoExpandido, setGrupoExpandido] = useState(0);
	const [hovered, setHovered] = useState(false);

	const gruposPermitidos = GRUPOS.map((g) => ({
		...g,
		modulos: g.modulos.filter((m) => m.roles.includes(usuario?.ROL)),
	})).filter((g) => g.modulos.length > 0);

	return (
		<aside
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className={`flex flex-col border-r border-borde bg-tarjeta flex-shrink-0 transition-[width] duration-300 ease-in-out relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] overflow-hidden ${hovered ? 'w-[280px]' : 'w-[80px]'}`}
		>
			<div className="flex flex-col h-full w-[280px]">
				{/* Logo */}
				<div className="flex items-center h-16 pl-[24px] pr-6 border-b border-borde flex-shrink-0">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primario text-fondo flex-shrink-0 shadow-sm">
						<Building className="w-4 h-4" />
					</div>
					<span
						className={`ml-4 text-[15px] font-bold tracking-tight font-title whitespace-nowrap transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
					>
						Condominio PuraFé
					</span>
				</div>

				{/* Navegación */}
				<nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4">
					{gruposPermitidos.map((grupo, gi) => {
						const expandido = grupoExpandido === gi;
						const tieneActivo = grupo.modulos.some((m) => m.id === moduloActivo);
						const resaltado = hovered ? tieneActivo || expandido : tieneActivo;

						return (
							<div key={gi} className="mb-2 px-3 relative">
								{!hovered && tieneActivo && (
									<div className="absolute left-0 top-[14px] w-1 h-6 bg-primario rounded-r-full" />
								)}
								<button
									onClick={() => setGrupoExpandido(gi === grupoExpandido ? null : gi)}
									className={`flex items-center w-full pl-[12px] pr-4 py-3 rounded-xl transition-colors group ${resaltado ? 'bg-zinc-800/80 shadow-md' : 'hover:bg-zinc-800/50'}`}
								>
									<div className="flex items-center justify-center w-[32px] h-[32px] flex-shrink-0">
										<grupo.IconoGrupo
											className={`w-[22px] h-[22px] transition-colors ${resaltado ? 'text-primario' : 'text-zinc-400 group-hover:text-primario'}`}
										/>
									</div>
									<div
										className={`ml-3 flex-1 flex items-center justify-between transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
									>
										<span
											className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap ${expandido ? 'text-primario' : 'text-zinc-400 group-hover:text-zinc-300'}`}
										>
											{grupo.titulo}
										</span>
										{expandido ? (
											<ChevronDown className="w-4 h-4 text-zinc-500" />
										) : (
											<ChevronRight className="w-4 h-4 text-zinc-500" />
										)}
									</div>
								</button>

								<div
									className={`overflow-hidden transition-all duration-300 ease-in-out ${hovered && expandido ? 'max-h-[400px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}
								>
									<div className="space-y-1 pl-[52px] pr-2 py-1 border-l-2 border-borde/50 ml-[27px] mt-1">
										{grupo.modulos.map(({ id, Icono, propio }) => {
											const activo = moduloActivo === id;
											const bloqueado = !propio;
											return (
												<button
													key={id}
													onClick={() => {
														if (!bloqueado) setModuloActivo(id);
													}}
													className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activo ? 'bg-primario/10 text-primario font-bold' : bloqueado ? 'text-zinc-600 cursor-not-allowed opacity-60' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
												>
													<Icono
														className={`w-[18px] h-[18px] flex-shrink-0 ${activo ? 'text-primario' : 'text-zinc-500'}`}
													/>
													<span className="text-[12px] whitespace-nowrap truncate leading-tight">{id}</span>
													{bloqueado && <Lock className="w-3 h-3 ml-auto text-zinc-700 flex-shrink-0" />}
												</button>
											);
										})}
									</div>
								</div>
							</div>
						);
					})}
				</nav>

				{/* Perfil */}
				<div className="flex-shrink-0 border-t border-borde bg-fondo/50 py-4 px-[20px]">
					<div
						className={`flex items-center p-1 rounded-xl transition-colors ${hovered ? 'bg-tarjeta border border-borde shadow-sm' : 'border border-transparent'}`}
					>
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 flex-shrink-0">
							<ShieldCheck className="w-[18px] h-[18px] text-emerald-400" />
						</div>
						<div
							className={`ml-3 min-w-0 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
						>
							<p className="text-[13px] font-bold text-primario leading-tight whitespace-nowrap">
								{usuario ? `${usuario.NOMBRE} ${usuario.APELLIDO}` : '—'}
							</p>
							<p className="text-[10px] font-bold text-emerald-500 leading-tight truncate">
								{usuario?.ROL ?? '—'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
