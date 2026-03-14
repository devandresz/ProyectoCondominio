import { useState, useRef, useEffect } from 'react';
import {
	Search,
	Bell,
	Building,
	ChevronDown,
	ChevronRight,
	Lock,
	Sun,
	Moon,
	CheckCircle2,
	Info,
	AlertTriangle,
	X,
	ShieldCheck,
} from 'lucide-react';

import { GRUPOS, notificacionesEjemplo } from './login/datos/datosDePrueba.js';
import { VistaLogin, VistaGarita } from './vistas/PantallasLibres';
import { AnimacionCarga } from './componentes/Animaciones';
import { ModuloPendiente, Modal } from './componentes/UiGeneral';
import {
	ModuloPropiedades,
	ModuloVehiculos,
	ModuloInvitaciones,
	ModuloMulta,
} from './modulos/CrudsAdministrativos';

/* ============================================================
   APP PRINCIPAL
============================================================ */
export default function App() {
	// Ruta de garita (fuera del admin)
	if (window.location.pathname.startsWith('/garita')) return <VistaGarita />;

	// ── Estado global ─────────────────────────────────────────
	const [pantallaActual, setPantallaActual] = useState('login');
	const [usuarioActual, setUsuarioActual] = useState(null);
	const [moduloActivo, setModuloActivo] = useState('Gestión de Propiedades');
	const [busquedaGlobal, setBusquedaGlobal] = useState('');
	const [dashboardKey, setDashboardKey] = useState(0);

	// ── Layout ────────────────────────────────────────────────
	const [grupoExpandido, setGrupoExpandido] = useState(0);
	const [isSidebarHovered, setIsSidebarHovered] = useState(false);
	const [notisAbiertas, setNotisAbiertas] = useState(false);
	const [hayNotisNuevas, setHayNotisNuevas] = useState(true);
	const [verHistorialNotis, setVerHistorialNotis] = useState(false);
	const [temaOscuro, setTemaOscuro] = useState(true);
	const [cargando, setCargando] = useState(false);
	const [mensajeCarga, setMensajeCarga] = useState('');

	const notisRef = useRef(null);

	useEffect(() => {
		const clickAfuera = (e) => {
			if (notisRef.current && !notisRef.current.contains(e.target)) setNotisAbiertas(false);
		};
		document.addEventListener('mousedown', clickAfuera);
		return () => document.removeEventListener('mousedown', clickAfuera);
	}, []);

	// ── Login contra backend Node.js ──────────────────────────
	const manejarLogin = async (usuario, contrasena) => {
		setMensajeCarga('Ingresando al panel de gestión');
		setCargando(true);
		try {
			const res = await fetch('http://localhost:1000/usuarios/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nombreUsuario: usuario, contrasena }),
			});
			const data = await res.json();
			if (res.ok) {
				setUsuarioActual(data);
				if (data.ROL === 'Administrador') {
					setModuloActivo('Gestión de Propiedades');
					setGrupoExpandido(0);
				} else if (data.ROL === 'Guardia') {
					setModuloActivo('Pases de Visita (QR)');
					setGrupoExpandido(0);
				} else {
					setModuloActivo('Pases de Visita (QR)');
				}
				setDashboardKey((k) => k + 1);
				setPantallaActual('dashboard');
			} else {
				alert(data.mensaje || 'Credenciales incorrectas');
			}
		} catch (error) {
			console.error('Error conectando al servidor:', error);
			alert(
				'Error: No se pudo conectar con el servidor backend. Verifica que esté corriendo en el puerto 1000.',
			);
		} finally {
			setCargando(false);
		}
	};

	// ── RBAC — filtrar menú por rol ───────────────────────────
	const gruposPermitidos = GRUPOS.map((g) => ({
		...g,
		modulos: g.modulos.filter((m) => m.roles.includes(usuarioActual?.ROL)),
	})).filter((g) => g.modulos.length > 0);

	// ── Vistas disponibles ────────────────────────────────────
	const VISTAS = {
		'Gestión de Propiedades': <ModuloPropiedades filtroGlobal={busquedaGlobal} />,
		'Control Vehicular': <ModuloVehiculos filtroGlobal={busquedaGlobal} />,
		'Pases de Visita (QR)': <ModuloInvitaciones filtroGlobal={busquedaGlobal} />,
		'Infracciones y Multas': <ModuloMulta filtroGlobal={busquedaGlobal} />,
	};

	const SUBTITULOS = {
		'Gestión de Propiedades': 'Administración general de unidades y responsables',
		'Control Vehicular': 'Padrón oficial de vehículos asociados a casas',
		'Pases de Visita (QR)': 'Generación de códigos de acceso temporales',
		'Infracciones y Multas': 'Bitácora de faltas y control de sanciones',
	};

	const infoModulo = GRUPOS.flatMap((g) => g.modulos).find((m) => m.id === moduloActivo);
	const vistaActual =
		VISTAS[moduloActivo] ??
		(infoModulo ? <ModuloPendiente nombre={infoModulo.id} Icono={infoModulo.Icono} /> : null);

	// ── Render ────────────────────────────────────────────────
	return (
		<div
			className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${temaOscuro ? 'bg-fondo text-primario' : 'tema-claro'}`}
		>
			{cargando ? (
				<AnimacionCarga mensaje={mensajeCarga} />
			) : (
				<>
					{/* LOGIN */}
					{pantallaActual === 'login' && (
						<VistaLogin
							onLogin={manejarLogin}
							temaOscuro={temaOscuro}
							setTemaOscuro={setTemaOscuro}
						/>
					)}

					{/* DASHBOARD */}
					{pantallaActual === 'dashboard' && (
						<>
							{/* ── SIDEBAR ─────────────────────────────────────── */}
							<aside
								onMouseEnter={() => setIsSidebarHovered(true)}
								onMouseLeave={() => setIsSidebarHovered(false)}
								className={`flex flex-col border-r border-borde bg-tarjeta flex-shrink-0 transition-[width] duration-300 ease-in-out relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] overflow-hidden ${isSidebarHovered ? 'w-[280px]' : 'w-[80px]'}`}
							>
								<div className="flex flex-col h-full w-[280px]">
									{/* Logo */}
									<div className="flex items-center h-16 pl-[24px] pr-6 border-b border-borde flex-shrink-0">
										<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primario text-fondo flex-shrink-0 shadow-sm">
											<Building className="w-4 h-4" />
										</div>
										<span
											className={`ml-4 text-[15px] font-bold tracking-tight font-title whitespace-nowrap transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0'}`}
										>
											Condominio PuraFé
										</span>
									</div>

									{/* Navegación */}
									<nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4">
										{gruposPermitidos.map((grupo, gi) => {
											const expandido = grupoExpandido === gi;
											const tieneModuloActivo = grupo.modulos.some((m) => m.id === moduloActivo);
											const resaltado = isSidebarHovered
												? tieneModuloActivo || expandido
												: tieneModuloActivo;

											return (
												<div key={gi} className="mb-2 px-3 relative">
													{!isSidebarHovered && tieneModuloActivo && (
														<div className="absolute left-0 top-[14px] w-1 h-6 bg-primario rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
													)}
													<button
														onClick={() => setGrupoExpandido(gi === grupoExpandido ? null : gi)}
														title={!isSidebarHovered ? grupo.titulo : undefined}
														className={`flex items-center w-full pl-[12px] pr-4 py-3 rounded-xl transition-colors group ${resaltado ? 'bg-zinc-800/80 shadow-md' : 'hover:bg-zinc-800/50'}`}
													>
														<div className="flex items-center justify-center w-[32px] h-[32px] flex-shrink-0">
															<grupo.IconoGrupo
																className={`w-[22px] h-[22px] transition-colors ${resaltado ? 'text-primario' : 'text-zinc-400 group-hover:text-primario'}`}
															/>
														</div>
														<div
															className={`ml-3 flex-1 flex items-center justify-between transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0'}`}
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
														className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarHovered && expandido ? 'max-h-[400px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}
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
																		<span className="text-[12px] whitespace-nowrap truncate leading-tight">
																			{id}
																		</span>
																		{bloqueado && (
																			<Lock className="w-3 h-3 ml-auto text-zinc-700 flex-shrink-0" />
																		)}
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
											className={`flex items-center p-1 rounded-xl transition-colors ${isSidebarHovered ? 'bg-tarjeta border border-borde shadow-sm' : 'border border-transparent bg-transparent hover:bg-zinc-800/50 cursor-pointer'}`}
										>
											<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 flex-shrink-0">
												<ShieldCheck className="w-[18px] h-[18px] text-emerald-400" />
											</div>
											<div
												className={`ml-3 min-w-0 transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0'}`}
											>
												<p className="text-[13px] font-bold text-primario leading-tight whitespace-nowrap">
													{usuarioActual
														? `${usuarioActual.NOMBRE} ${usuarioActual.APELLIDO}`
														: 'Administrador'}
												</p>
												<p className="text-[10px] font-bold text-emerald-500 leading-tight truncate">
													{usuarioActual?.ROL ?? 'Admin Principal'}
												</p>
											</div>
										</div>
									</div>
								</div>
							</aside>

							{/* ── PANEL DERECHO ────────────────────────────────── */}
							<div className="flex flex-col flex-1 min-w-0 relative z-10">
								{/* Topbar */}
								<header className="flex items-center justify-between h-16 px-8 border-b border-borde bg-fondo/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-30">
									<div>
										<h1 className="text-[17px] font-bold font-title text-primario leading-tight">
											{moduloActivo}
										</h1>
										<p className="text-[11px] text-zinc-500 leading-tight font-medium mt-0.5">
											{SUBTITULOS[moduloActivo] ?? 'Módulo en desarrollo'}
										</p>
									</div>

									<div className="flex items-center gap-4">
										{/* Búsqueda global */}
										<div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-tarjeta border-borde w-64 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-800 transition-all shadow-sm">
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
											onClick={() => setTemaOscuro(!temaOscuro)}
											className="p-2 rounded-lg text-zinc-400 hover:text-primario hover:bg-tarjeta transition-colors"
											title={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
										>
											{temaOscuro ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
										</button>

										{/* Notificaciones */}
										<div className="relative" ref={notisRef}>
											<button
												onClick={() => {
													setNotisAbiertas(!notisAbiertas);
													setHayNotisNuevas(false);
												}}
												className={`relative p-2 rounded-lg transition-colors ${notisAbiertas ? 'bg-zinc-800 text-primario' : 'text-zinc-400 hover:text-primario hover:bg-tarjeta'}`}
											>
												<Bell className="w-5 h-5" />
												{hayNotisNuevas && (
													<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-fondo" />
												)}
											</button>

											{notisAbiertas && (
												<div className="absolute right-0 mt-3 w-80 bg-tarjeta border border-borde rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
													<div className="flex items-center justify-between p-4 border-b border-borde bg-fondo/50">
														<h3 className="text-sm font-bold text-primario">Notificaciones</h3>
														{!hayNotisNuevas && (
															<span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-800 text-zinc-400 rounded-full">
																Vistas
															</span>
														)}
													</div>
													<div className="max-h-[300px] overflow-y-auto custom-scrollbar">
														{notificacionesEjemplo.map((n) => (
															<div
																key={n.id}
																onClick={() => {
																	if (n.moduloDestino) {
																		setModuloActivo(n.moduloDestino);
																		const ig = GRUPOS.findIndex((g) =>
																			g.modulos.some((m) => m.id === n.moduloDestino),
																		);
																		if (ig !== -1) setGrupoExpandido(ig);
																	}
																	setNotisAbiertas(false);
																}}
																className="flex items-start gap-3 p-4 border-b border-borde/50 hover:bg-fondo/50 transition-colors cursor-pointer"
															>
																<div
																	className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${n.tipo === 'alerta' ? 'bg-red-500/10 text-red-400' : n.tipo === 'exito' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sky-500/10 text-sky-400'}`}
																>
																	{n.tipo === 'alerta' ? (
																		<AlertTriangle className="w-4 h-4" />
																	) : n.tipo === 'exito' ? (
																		<CheckCircle2 className="w-4 h-4" />
																	) : (
																		<Info className="w-4 h-4" />
																	)}
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-[13px] font-bold text-primario truncate">{n.titulo}</p>
																	<p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{n.desc}</p>
																	<p className="text-[10px] font-medium text-zinc-600 mt-1.5">{n.tiempo}</p>
																</div>
															</div>
														))}
													</div>
													<div
														onClick={() => {
															setVerHistorialNotis(true);
															setNotisAbiertas(false);
														}}
														className="p-3 text-center bg-fondo/50 border-t border-borde hover:bg-zinc-800/50 transition-colors cursor-pointer"
													>
														<span className="text-xs font-semibold text-primario">
															Ver todo el historial
														</span>
													</div>
												</div>
											)}
										</div>

										<div className="h-6 w-px bg-borde mx-1" />

										{/* Cerrar sesión */}
										<button
											onClick={() => {
												setPantallaActual('login');
												setUsuarioActual(null);
											}}
											className="px-4 py-2 text-[13px] font-bold rounded-lg bg-primario text-fondo hover:bg-white/90 transition-all shadow-sm"
										>
											Cerrar sesión
										</button>
									</div>
								</header>

								{/* Área de contenido */}
								<main
									key={dashboardKey}
									className="flex-1 p-8 overflow-y-auto bg-fondo custom-scrollbar transition-colors duration-300 dashboard-main-anim"
								>
									<div className="max-w-7xl mx-auto">{vistaActual}</div>
								</main>
							</div>
						</>
					)}
				</>
			)}

			{/* Modal historial notificaciones */}
			{verHistorialNotis && pantallaActual === 'dashboard' && (
				<Modal titulo="Historial de Notificaciones" alCerrar={() => setVerHistorialNotis(false)}>
					<div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-2">
						{notificacionesEjemplo.map((n) => (
							<div
								key={n.id}
								onClick={() => {
									if (n.moduloDestino) {
										setModuloActivo(n.moduloDestino);
										const ig = GRUPOS.findIndex((g) => g.modulos.some((m) => m.id === n.moduloDestino));
										if (ig !== -1) setGrupoExpandido(ig);
									}
									setVerHistorialNotis(false);
								}}
								className="flex items-center gap-4 p-4 rounded-xl border border-borde bg-fondo hover:bg-zinc-800/50 transition-colors cursor-pointer"
							>
								<div
									className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.tipo === 'alerta' ? 'bg-red-500/10 text-red-400' : n.tipo === 'exito' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sky-500/10 text-sky-400'}`}
								>
									{n.tipo === 'alerta' ? (
										<AlertTriangle className="w-5 h-5" />
									) : n.tipo === 'exito' ? (
										<CheckCircle2 className="w-5 h-5" />
									) : (
										<Info className="w-5 h-5" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-1">
										<p className="text-[14px] font-bold text-primario truncate">{n.titulo}</p>
										<span className="text-[11px] text-zinc-500 font-medium">{n.tiempo}</span>
									</div>
									<p className="text-[12px] text-zinc-400">{n.desc}</p>
								</div>
							</div>
						))}
					</div>
				</Modal>
			)}

			{/* ── CSS GLOBAL ───────────────────────────────────────── */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes loginFadeIn  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
				@keyframes loginShake   { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-6px)} 60%{transform:translateX(5px)} 75%{transform:translateX(-3px)} 90%{transform:translateX(2px)} }
				@keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:0.4} }
				@keyframes barraProgreso{ 0%{width:0%;margin-left:0%} 50%{width:60%;margin-left:20%} 100%{width:0%;margin-left:100%} }
				@keyframes dashSlideUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
				@keyframes dashFadeIn   { from{opacity:0} to{opacity:1} }

				/* Dashboard entry stagger */
				.dashboard-main-anim > div > div:nth-child(1) { animation: dashSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
				.dashboard-main-anim > div > div:nth-child(2) { animation: dashSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
				.dashboard-main-anim > div > div:nth-child(3) { animation: dashSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
				.dashboard-main-anim .grid > div:nth-child(1) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
				.dashboard-main-anim .grid > div:nth-child(2) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.16s both; }
				.dashboard-main-anim .grid > div:nth-child(3) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.24s both; }
				.dashboard-main-anim .grid > div:nth-child(4) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.32s both; }

				/* Scrollbar */
				.custom-scrollbar::-webkit-scrollbar       { width:6px; }
				.custom-scrollbar::-webkit-scrollbar-track { background:transparent; }
				.custom-scrollbar::-webkit-scrollbar-thumb { background:#52525b; border-radius:10px; }
				.tema-claro .custom-scrollbar::-webkit-scrollbar-thumb { background:#94a3b8; }

				/* Filas tabla — modo oscuro */
				.fila-normal             { background-color:transparent; }
				.fila-normal:hover       { background-color:rgba(63,63,70,0.35) !important; }
				.fila-seleccionada       { background-color:rgba(63,63,70,0.55) !important; }

				/* ── MODO CLARO ─────────────────────────────────── */
				.tema-claro              { background-color:#f1f5f9 !important; color:#0f172a !important; }
				.tema-claro .bg-fondo    { background-color:#f1f5f9 !important; }
				.tema-claro .bg-fondo\\/80  { background-color:rgba(241,245,249,0.92) !important; }
				.tema-claro .bg-fondo\\/50  { background-color:rgba(241,245,249,0.75) !important; }
				.tema-claro .bg-tarjeta  { background-color:#ffffff !important; }
				.tema-claro .bg-tarjeta\\/50{ background-color:rgba(255,255,255,0.75) !important; }
				.tema-claro .bg-tarjeta\\/20{ background-color:transparent !important; }
				.tema-claro .border-borde       { border-color:#e2e8f0 !important; }
				.tema-claro .border-borde\\/50  { border-color:rgba(226,232,240,0.65) !important; }
				.tema-claro .border-borde\\/40  { border-color:rgba(226,232,240,0.5) !important; }
				.tema-claro .text-primario   { color:#0f172a !important; }
				.tema-claro .text-secundario { color:#64748b !important; }
				.tema-claro .text-zinc-300   { color:#334155 !important; }
				.tema-claro .text-zinc-400   { color:#475569 !important; }
				.tema-claro .text-zinc-500   { color:#64748b !important; }
				.tema-claro .text-zinc-600   { color:#94a3b8 !important; }
				.tema-claro .text-zinc-700   { color:#cbd5e1 !important; }
				.tema-claro .bg-zinc-800     { background-color:#e2e8f0 !important; }
				.tema-claro .bg-zinc-800\\/50{ background-color:rgba(226,232,240,0.55) !important; }
				.tema-claro .bg-zinc-800\\/60{ background-color:rgba(226,232,240,0.65) !important; }
				.tema-claro .bg-zinc-800\\/80{ background-color:rgba(226,232,240,0.85) !important; }
				.tema-claro .bg-zinc-900\\/40{ background-color:rgba(241,245,249,0.65) !important; }
				.tema-claro .bg-zinc-700\\/60{ background-color:rgba(203,213,225,0.7) !important; }
				.tema-claro .hover\\:bg-zinc-800:hover       { background-color:#cbd5e1 !important; }
				.tema-claro .hover\\:bg-zinc-800\\/50:hover  { background-color:rgba(203,213,225,0.5) !important; }
				.tema-claro .hover\\:bg-zinc-700\\/30:hover  { background-color:rgba(203,213,225,0.45) !important; }
				.tema-claro .hover\\:bg-fondo\\/50:hover     { background-color:rgba(241,245,249,0.85) !important; }
				.tema-claro .focus-within\\:ring-zinc-800:focus-within { --tw-ring-color:#94a3b8 !important; }
				.tema-claro .fila-normal       { background-color:#ffffff !important; }
				.tema-claro .fila-normal:hover { background-color:#f1f5f9 !important; }
				.tema-claro .fila-seleccionada { background-color:#e2e8f0 !important; }
				.tema-claro thead tr           { background-color:#f8fafc !important; }
				.tema-claro .shadow-sm  { box-shadow:0 1px 3px rgba(15,23,42,0.07) !important; }
				.tema-claro .shadow-2xl { box-shadow:0 8px 32px rgba(15,23,42,0.10) !important; }
			`,
				}}
			/>
		</div>
	);
}
