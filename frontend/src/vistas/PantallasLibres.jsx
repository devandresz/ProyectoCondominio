import { useState, useRef, useEffect } from 'react';
import {
	Building,
	ShieldCheck,
	QrCode,
	AlertTriangle,
	Sun,
	Moon,
	Lock,
	Mail,
	Eye,
	EyeOff,
	Camera,
	X,
	CheckCircle2,
	UserCheck,
} from 'lucide-react';
import { CaballoAnimado } from '../componentes/Animaciones';
import { invitacionesEjemplo } from '../login/datos/datosDePrueba.js';

/* ============================================================
   VISTA LOGIN
============================================================ */
export function VistaLogin({ onLogin, temaOscuro, setTemaOscuro }) {
	const [mostrarPassword, setMostrarPassword] = useState(false);
	const [passwordVal, setPasswordVal] = useState('');
	const [emailVal, setEmailVal] = useState('');
	const [focusEmail, setFocusEmail] = useState(false);
	const [focusPassword, setFocusPassword] = useState(false);
	const [shake, setShake] = useState(false);
	const inputEmailRef = useRef(null);

	const [pupilaX, setPupilaX] = useState(0);
	const [pupilaY, setPupilaY] = useState(0);

	// Tapado = campo contraseña activo Y password oculto
	const tapado = focusPassword && !mostrarPassword;

	// Actualizar posición de pupila según cursor de texto
	const actualizarPupila = (val, selStart) => {
		if (!focusEmail) return;
		const len = val.length;
		if (len === 0) {
			setPupilaX(-2.0);
			setPupilaY(-0.5);
			return;
		}
		const ratio = selStart / Math.max(len, 1);
		setPupilaX(-2.5 + ratio * 5.0);
		setPupilaY(-0.8 + ratio * 0.6);
	};

	const handleEmailChange = (e) => {
		const val = e.target.value;
		setEmailVal(val);
		actualizarPupila(val, e.target.selectionStart ?? val.length);
	};

	const handleEmailKeyUp = (e) => {
		actualizarPupila(e.target.value, e.target.selectionStart ?? e.target.value.length);
	};

	// Reaccionar al cambio de foco
	useEffect(() => {
		if (focusEmail) {
			actualizarPupila(
				inputEmailRef.current?.value ?? '',
				inputEmailRef.current?.selectionStart ?? 0,
			);
		} else if (focusPassword) {
			setPupilaX(2.4);
			setPupilaY(0.5);
		} else {
			setPupilaX(0);
			setPupilaY(0);
		}
	}, [focusEmail, focusPassword]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!emailVal.trim() || !passwordVal) {
			setShake(true);
			setTimeout(() => setShake(false), 600);
			return;
		}
		onLogin(emailVal, passwordVal);
	};

	// Transformación del cuerpo según contexto
	const bodyTransform = tapado
		? 'scale(0.93) translateY(5px)'
		: focusEmail
			? 'scale(1.03) translateY(-3px) rotate(-2.5deg)'
			: focusPassword
				? 'scale(1.03) translateY(-3px) rotate(2.5deg)'
				: 'scale(1) translateY(0px)';

	// Colores adaptativos a tema
	const inputBg = (activo) =>
		activo
			? temaOscuro
				? 'rgba(39,39,42,0.7)'
				: 'rgba(241,245,249,0.9)'
			: temaOscuro
				? 'rgba(9,9,11,0.6)'
				: 'rgba(248,250,252,0.8)';
	const inputBorder = (activo) =>
		activo
			? temaOscuro
				? 'rgba(113,113,122,0.8)'
				: 'rgba(100,116,139,0.6)'
			: temaOscuro
				? 'rgba(63,63,70,0.8)'
				: 'rgba(203,213,225,0.8)';

	return (
		<div
			className="flex w-full h-full relative overflow-hidden"
			style={{ background: temaOscuro ? '#09090b' : '#f1f5f9' }}
		>
			{/* Fondo con grid */}
			<div
				className="absolute inset-0"
				style={{ background: temaOscuro ? '#09090b' : '#f1f5f9' }}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage:
							'radial-gradient(circle at 20% 50%, rgba(39,39,42,0.8) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(24,24,27,0.9) 0%, transparent 50%)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundImage: temaOscuro
							? 'linear-gradient(rgba(63,63,70,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.15) 1px, transparent 1px)'
							: 'linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: '15%',
						left: '50%',
						transform: 'translateX(-50%)',
						width: '500px',
						height: '300px',
						background: 'radial-gradient(ellipse, rgba(63,63,70,0.3) 0%, transparent 70%)',
						filter: 'blur(40px)',
						pointerEvents: 'none',
					}}
				/>
			</div>

			{/* Botón tema flotante */}
			<div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 50 }}>
				<button
					onClick={() => setTemaOscuro((t) => !t)}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						padding: '8px 14px',
						borderRadius: '999px',
						border: temaOscuro ? '1px solid rgba(63,63,70,0.7)' : '1px solid rgba(100,116,139,0.3)',
						background: temaOscuro ? 'rgba(24,24,27,0.8)' : 'rgba(255,255,255,0.8)',
						backdropFilter: 'blur(12px)',
						cursor: 'pointer',
						transition: 'all 0.25s ease',
						boxShadow: temaOscuro ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(15,23,42,0.1)',
					}}
				>
					{temaOscuro ? (
						<Sun style={{ width: '14px', height: '14px', color: '#facc15' }} />
					) : (
						<Moon style={{ width: '14px', height: '14px', color: '#475569' }} />
					)}
					<span
						style={{ fontSize: '11px', fontWeight: 600, color: temaOscuro ? '#a1a1aa' : '#475569' }}
					>
						{temaOscuro ? 'Modo día' : 'Modo noche'}
					</span>
				</button>
			</div>

			{/* Panel izquierdo */}
			<div className="hidden lg:flex flex-col justify-between w-[45%] relative z-10 p-12 border-r border-zinc-800/50">
				<div>
					<div className="flex items-center gap-3 mb-16">
						<div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
							<Building className="w-5 h-5 text-zinc-900" />
						</div>
						<span className="text-white font-bold text-lg tracking-tight">PuraFé</span>
					</div>
					<div className="space-y-6">
						<h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
							Sistema de
							<br />
							<span style={{ color: '#d4d4d8' }}>Gestión</span>
							<br />
							<span
								style={{
									background: 'linear-gradient(135deg,#ffffff 0%,#71717a 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								Residencial
							</span>
						</h1>
						<p className="text-zinc-500 text-base leading-relaxed max-w-sm">
							Administra propiedades, accesos y residentes desde un solo lugar.
						</p>
					</div>
				</div>
				<div className="space-y-3">
					{[
						{ Icono: Building, text: 'Control de propiedades y cuotas', color: 'text-white' },
						{ Icono: ShieldCheck, text: 'Seguridad y garita integrada', color: 'text-zinc-300' },
						{ Icono: QrCode, text: 'Pases QR para visitantes', color: 'text-zinc-400' },
						{
							Icono: AlertTriangle,
							text: 'Gestión de infracciones y multas',
							color: 'text-zinc-500',
						},
					].map(({ Icono, text, color }, i) => (
						<div key={i} className="flex items-center gap-3">
							<div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
								<Icono className="w-3.5 h-3.5 text-zinc-300" />
							</div>
							<span className={`text-sm font-medium ${color}`}>{text}</span>
						</div>
					))}
				</div>
			</div>

			{/* Panel derecho — formulario */}
			<div className="flex-1 flex items-center justify-center relative z-10 p-6">
				<div
					style={{
						width: '100%',
						maxWidth: '400px',
						animation: shake
							? 'loginShake 0.6s ease'
							: 'loginFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
					}}
				>
					{/* Card */}
					<div
						style={{
							background: temaOscuro ? 'rgba(24,24,27,0.88)' : 'rgba(255,255,255,0.92)',
							backdropFilter: 'blur(20px)',
							border: temaOscuro ? '1px solid rgba(63,63,70,0.6)' : '1px solid rgba(226,232,240,0.9)',
							borderRadius: '24px',
							padding: '36px',
							boxShadow: temaOscuro
								? '0 32px 64px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03) inset'
								: '0 16px 48px -12px rgba(15,23,42,0.15)',
						}}
					>
						{/* Caballo */}
						<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
							<div
								style={{
									transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
									transform: bodyTransform,
								}}
							>
								<CaballoAnimado
									tapado={tapado}
									asomado={mostrarPassword}
									pupilaX={pupilaX}
									pupilaY={pupilaY}
								/>
							</div>
						</div>

						{/* Título */}
						<div className="text-center mb-7">
							<h2
								style={{
									fontSize: '22px',
									fontWeight: 800,
									color: temaOscuro ? '#fafafa' : '#0f172a',
									letterSpacing: '-0.5px',
									marginBottom: '4px',
								}}
							>
								Bienvenido
							</h2>
							<p
								style={{
									fontSize: '13px',
									color: temaOscuro ? '#71717a' : '#64748b',
									fontWeight: 500,
								}}
							>
								Accede al panel administrativo
							</p>
						</div>

						{/* Formulario */}
						<form
							onSubmit={handleSubmit}
							style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
						>
							{/* Campo Usuario */}
							<div>
								<label
									style={{
										display: 'block',
										fontSize: '11px',
										fontWeight: 600,
										color: '#71717a',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: '8px',
									}}
								>
									Usuario o Correo
								</label>
								<div style={{ position: 'relative' }}>
									<Mail
										style={{
											position: 'absolute',
											left: '14px',
											top: '50%',
											transform: 'translateY(-50%)',
											width: '15px',
											height: '15px',
											color: focusEmail ? '#a1a1aa' : '#52525b',
											transition: 'color 0.2s',
										}}
									/>
									<input
										ref={inputEmailRef}
										type="text"
										required
										value={emailVal}
										onChange={handleEmailChange}
										onKeyUp={handleEmailKeyUp}
										placeholder="usuario"
										style={{
											width: '100%',
											paddingLeft: '42px',
											paddingRight: '16px',
											paddingTop: '12px',
											paddingBottom: '12px',
											fontSize: '14px',
											background: inputBg(focusEmail),
											border: `1px solid ${inputBorder(focusEmail)}`,
											borderRadius: '12px',
											color: temaOscuro ? '#fafafa' : '#0f172a',
											outline: 'none',
											transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
											boxShadow: focusEmail ? '0 0 0 3px rgba(113,113,122,0.1)' : 'none',
											boxSizing: 'border-box',
										}}
										onFocus={() => setFocusEmail(true)}
										onBlur={() => setFocusEmail(false)}
									/>
								</div>
							</div>

							{/* Campo Contraseña */}
							<div>
								<label
									style={{
										display: 'block',
										fontSize: '11px',
										fontWeight: 600,
										color: '#71717a',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: '8px',
									}}
								>
									Contraseña
								</label>
								<div style={{ position: 'relative' }}>
									<Lock
										style={{
											position: 'absolute',
											left: '14px',
											top: '50%',
											transform: 'translateY(-50%)',
											width: '15px',
											height: '15px',
											color: focusPassword ? '#a1a1aa' : '#52525b',
											transition: 'color 0.2s',
										}}
									/>
									<input
										type={mostrarPassword ? 'text' : 'password'}
										required
										value={passwordVal}
										onChange={(e) => setPasswordVal(e.target.value)}
										placeholder="••••••••"
										style={{
											width: '100%',
											paddingLeft: '42px',
											paddingRight: '48px',
											paddingTop: '12px',
											paddingBottom: '12px',
											fontSize: '14px',
											background: inputBg(focusPassword),
											border: `1px solid ${inputBorder(focusPassword)}`,
											borderRadius: '12px',
											color: temaOscuro ? '#fafafa' : '#0f172a',
											outline: 'none',
											transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
											boxShadow: focusPassword ? '0 0 0 3px rgba(113,113,122,0.1)' : 'none',
											boxSizing: 'border-box',
										}}
										onFocus={() => setFocusPassword(true)}
										onBlur={() => setFocusPassword(false)}
									/>
									<button
										type="button"
										onClick={() => setMostrarPassword((p) => !p)}
										style={{
											position: 'absolute',
											right: '12px',
											top: '50%',
											transform: 'translateY(-50%)',
											background: 'none',
											border: 'none',
											cursor: 'pointer',
											padding: '4px',
											color: mostrarPassword ? '#d4d4d8' : '#52525b',
											borderRadius: '6px',
											transition: 'color 0.2s',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
										title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
									>
										{mostrarPassword ? (
											<Eye style={{ width: '16px', height: '16px' }} />
										) : (
											<EyeOff style={{ width: '16px', height: '16px' }} />
										)}
									</button>
								</div>
							</div>

							{/* Botón Iniciar Sesión */}
							<button
								type="submit"
								style={{
									marginTop: '8px',
									width: '100%',
									padding: '14px',
									fontSize: '14px',
									fontWeight: 700,
									borderRadius: '12px',
									background: 'linear-gradient(135deg, #fafafa 0%, #d4d4d8 100%)',
									color: '#09090b',
									border: 'none',
									cursor: 'pointer',
									letterSpacing: '-0.1px',
									boxShadow: '0 4px 20px rgba(250,250,250,0.1)',
									transition: 'transform 0.15s ease, box-shadow 0.15s ease',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-1px)';
									e.currentTarget.style.boxShadow = '0 8px 28px rgba(250,250,250,0.15)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = '0 4px 20px rgba(250,250,250,0.1)';
								}}
								onMouseDown={(e) => {
									e.currentTarget.style.transform = 'translateY(1px)';
								}}
								onMouseUp={(e) => {
									e.currentTarget.style.transform = 'translateY(-1px)';
								}}
							>
								<Lock style={{ width: '15px', height: '15px' }} />
								Iniciar Sesión
							</button>
						</form>

						<p
							style={{
								textAlign: 'center',
								marginTop: '20px',
								fontSize: '11px',
								color: temaOscuro ? '#3f3f46' : '#94a3b8',
							}}
						>
							Acceso exclusivo para administradores autorizados
						</p>
					</div>

					{/* Badge */}
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								padding: '6px 14px',
								background: 'rgba(39,39,42,0.6)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(63,63,70,0.4)',
								borderRadius: '999px',
							}}
						>
							<div
								style={{
									width: '6px',
									height: '6px',
									borderRadius: '50%',
									background: '#d4d4d8',
									animation: 'pulse 2s infinite',
								}}
							/>
							<span style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>Condominio</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ============================================================
   VISTA GARITA (sin cambios)
============================================================ */
export function VistaGarita() {
	const pathParts = window.location.pathname.split('/');
	const codigo = pathParts[pathParts.length - 1];
	const isBaseRoute = codigo === 'garita' || codigo === 'validar' || codigo === '';

	const [autorizado, setAutorizado] = useState(false);
	const [codigoManual, setCodigoManual] = useState('');

	if (isBaseRoute) {
		return (
			<div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans">
				<header className="bg-zinc-900 p-4 border-b border-zinc-800 text-center">
					<h1 className="text-lg font-bold text-zinc-100">Control de Garita</h1>
					<p className="text-xs text-zinc-400">Condominio PuraFé</p>
				</header>
				<main className="flex-1 flex flex-col items-center justify-center p-6">
					<div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
						<Camera className="w-10 h-10 text-zinc-400" />
					</div>
					<h2 className="text-xl font-bold mb-2">Escáner Activo</h2>
					<p className="text-zinc-500 text-center mb-8">
						Apunta con la cámara al código QR del visitante o ingresa el código manualmente.
					</p>
					<div className="w-full max-w-sm flex gap-2">
						<input
							type="text"
							placeholder="Ej: QR-12345"
							value={codigoManual}
							onChange={(e) => setCodigoManual(e.target.value)}
							className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
						/>
						<button
							onClick={() => {
								if (codigoManual) window.location.href = `/garita/validar/${codigoManual}`;
							}}
							className="px-4 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
						>
							Buscar
						</button>
					</div>
				</main>
			</div>
		);
	}

	const invitacion = invitacionesEjemplo.find((i) => i.codigo === codigo);

	if (!invitacion) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 font-sans">
				<div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
					<X className="w-8 h-8 text-red-500" />
				</div>
				<h1 className="text-2xl font-bold mb-2">QR Inválido</h1>
				<p className="text-zinc-400 text-center mb-8">
					Este código no existe en el sistema del condominio.
				</p>
				<button
					onClick={() => (window.location.href = '/garita')}
					className="px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
				>
					Volver a Escanear
				</button>
			</div>
		);
	}

	const esValido = invitacion.estado === 'Pendiente' || invitacion.estado === 'Activo';

	return (
		<div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans">
			<header className="bg-zinc-900 p-4 border-b border-zinc-800 text-center">
				<h1 className="text-lg font-bold text-zinc-100">Control de Garita</h1>
				<p className="text-xs text-zinc-400">Condominio PuraFé</p>
			</header>
			<main className="flex-1 flex flex-col items-center justify-center p-6">
				{autorizado ? (
					<div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
						<div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
							<CheckCircle2 className="w-12 h-12 text-emerald-500" />
						</div>
						<h2 className="text-2xl font-bold text-emerald-400 mb-2">¡Acceso Autorizado!</h2>
						<p className="text-zinc-400 text-center mb-8">El visitante puede ingresar.</p>
						<button
							onClick={() => (window.location.href = '/garita')}
							className="px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
						>
							Autorizar otro pase
						</button>
					</div>
				) : (
					<div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
						<div className="text-center mb-8">
							<div
								className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 ${esValido ? 'bg-sky-500/20 text-sky-400' : 'bg-red-500/20 text-red-400'}`}
							>
								Estado: {invitacion.estado.toUpperCase()}
							</div>
							<h2 className="text-2xl font-bold text-zinc-100">{invitacion.visitante}</h2>
							<p className="text-zinc-400 mt-1">Pase de tipo {invitacion.tipo}</p>
						</div>
						<div className="space-y-4 mb-8 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
							<div className="flex justify-between border-b border-zinc-800 pb-2">
								<span className="text-zinc-500 text-sm">Dirigiéndose a</span>
								<span className="text-zinc-100 font-bold">{invitacion.propiedad}</span>
							</div>
							<div className="flex justify-between border-b border-zinc-800 pb-2">
								<span className="text-zinc-500 text-sm">Autoriza</span>
								<span className="text-zinc-100 font-bold">{invitacion.residente}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-500 text-sm">Código QR</span>
								<span className="text-zinc-100 font-mono text-sm">{invitacion.codigo}</span>
							</div>
						</div>
						{esValido ? (
							<button
								onClick={() => setAutorizado(true)}
								className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
							>
								<UserCheck className="w-5 h-5" /> Autorizar Ingreso
							</button>
						) : (
							<div className="space-y-4 text-center">
								<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
									<p className="text-red-400 font-bold flex items-center justify-center gap-2">
										<AlertTriangle className="w-5 h-5" /> Ingreso Denegado
									</p>
									<p className="text-red-400/80 text-xs mt-2">El código ya fue utilizado o caducó.</p>
								</div>
								<button
									onClick={() => (window.location.href = '/garita')}
									className="px-6 py-3 bg-zinc-800 w-full rounded-xl font-bold hover:bg-zinc-700 transition-colors"
								>
									Volver a Escanear
								</button>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
