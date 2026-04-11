// ============================================================
// 📁 RUTA: frontend/src/paginas/LoginPagina.jsx
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { CaballoAnimado, AnimacionCarga } from '../componentes/ui/Animaciones.jsx';
import useStore from '../estado/useStore.js';
import { usuariosApi } from '../api/usuariosApi.js';
import { toast } from 'sonner';

function FondoEspacio({ oscuro }) {
	const canvasRef = useRef(null);
	const animRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener('resize', resize);

		const ESTRELLAS = Array.from({ length: 180 }, () => ({
			x: Math.random(),
			y: Math.random(),
			r: Math.random() * 1.6 + 0.3,
			brillo: Math.random(),
			fase: Math.random() * Math.PI * 2,
			vel: 0.4 + Math.random() * 0.8,
		}));

		const CONSTELACIONES = [
			[
				[0.1, 0.12],
				[0.18, 0.08],
				[0.25, 0.14],
				[0.2, 0.22],
				[0.12, 0.2],
			],
			[
				[0.7, 0.08],
				[0.78, 0.05],
				[0.85, 0.1],
				[0.82, 0.18],
				[0.74, 0.16],
				[0.7, 0.08],
			],
			[
				[0.88, 0.45],
				[0.93, 0.38],
				[0.98, 0.44],
				[0.94, 0.52],
			],
			[
				[0.05, 0.6],
				[0.12, 0.55],
				[0.18, 0.62],
				[0.14, 0.7],
				[0.06, 0.68],
			],
			[
				[0.55, 0.85],
				[0.62, 0.8],
				[0.68, 0.86],
				[0.64, 0.93],
			],
		];

		const dibujar = () => {
			const W = canvas.width,
				H = canvas.height;
			const t = Date.now() / 1000;
			ctx.clearRect(0, 0, W, H);

			const grad = ctx.createLinearGradient(0, 0, W, H);
			if (oscuro) {
				grad.addColorStop(0, '#050510');
				grad.addColorStop(0.4, '#0a0a20');
				grad.addColorStop(0.7, '#080818');
				grad.addColorStop(1, '#030308');
			} else {
				grad.addColorStop(0, '#e8eaf6');
				grad.addColorStop(0.4, '#ede7f6');
				grad.addColorStop(0.7, '#e3f2fd');
				grad.addColorStop(1, '#f3e5f5');
			}
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, W, H);

			const ORBS = [
				{
					x: 0.15,
					y: 0.2,
					r: 0.28,
					c: oscuro ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
					fase: 0,
				},
				{
					x: 0.82,
					y: 0.15,
					r: 0.22,
					c: oscuro ? 'rgba(16,185,129,0.09)' : 'rgba(16,185,129,0.07)',
					fase: 1,
				},
				{
					x: 0.7,
					y: 0.8,
					r: 0.32,
					c: oscuro ? 'rgba(139,92,246,0.10)' : 'rgba(139,92,246,0.07)',
					fase: 2,
				},
				{
					x: 0.1,
					y: 0.75,
					r: 0.2,
					c: oscuro ? 'rgba(236,72,153,0.07)' : 'rgba(236,72,153,0.05)',
					fase: 3,
				},
				{
					x: 0.5,
					y: 0.05,
					r: 0.18,
					c: oscuro ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)',
					fase: 4,
				},
			];
			ORBS.forEach((o) => {
				const ox = (o.x + Math.sin(t * 0.3 + o.fase) * 0.04) * W;
				const oy = (o.y + Math.cos(t * 0.25 + o.fase) * 0.04) * H;
				const rr = o.r * Math.min(W, H);
				const g2 = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
				g2.addColorStop(0, o.c);
				g2.addColorStop(1, 'transparent');
				ctx.fillStyle = g2;
				ctx.beginPath();
				ctx.arc(ox, oy, rr, 0, Math.PI * 2);
				ctx.fill();
			});

			ESTRELLAS.forEach((s) => {
				const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.vel + s.fase));
				const sx = s.x * W,
					sy = s.y * H;
				ctx.beginPath();
				ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
				ctx.fillStyle = oscuro
					? `rgba(255,255,255,${alpha * 0.9})`
					: `rgba(80,80,120,${alpha * 0.5})`;
				ctx.fill();

				if (s.r > 1.2 && alpha > 0.7) {
					ctx.strokeStyle = oscuro
						? `rgba(255,255,255,${(alpha - 0.5) * 0.4})`
						: `rgba(80,80,120,${(alpha - 0.5) * 0.25})`;
					ctx.lineWidth = 0.5;
					const rayo = s.r * 4;
					ctx.beginPath();
					ctx.moveTo(sx - rayo, sy);
					ctx.lineTo(sx + rayo, sy);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(sx, sy - rayo);
					ctx.lineTo(sx, sy + rayo);
					ctx.stroke();
				}
			});

			CONSTELACIONES.forEach((pts) => {
				ctx.beginPath();
				pts.forEach(([px, py], i) => {
					const cx2 = px * W,
						cy2 = py * H;
					i === 0 ? ctx.moveTo(cx2, cy2) : ctx.lineTo(cx2, cy2);
				});
				ctx.strokeStyle = oscuro ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.15)';
				ctx.lineWidth = 0.8;
				ctx.stroke();

				pts.forEach(([px, py]) => {
					ctx.beginPath();
					ctx.arc(px * W, py * H, 1.8, 0, Math.PI * 2);
					ctx.fillStyle = oscuro ? 'rgba(165,180,252,0.7)' : 'rgba(99,102,241,0.5)';
					ctx.fill();
				});
			});

			animRef.current = requestAnimationFrame(dibujar);
		};

		animRef.current = requestAnimationFrame(dibujar);
		return () => {
			cancelAnimationFrame(animRef.current);
			window.removeEventListener('resize', resize);
		};
	}, [oscuro]);

	return (
		<canvas
			ref={canvasRef}
			style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
		/>
	);
}

function FormasOrganicas({ oscuro }) {
	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 1,
				pointerEvents: 'none',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '-10%',
					left: '-8%',
					width: '45vw',
					height: '45vw',
					background: oscuro
						? 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)'
						: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
					borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
					filter: 'blur(40px)',
					animation: 'flotar1 12s ease-in-out infinite',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: '-12%',
					right: '-10%',
					width: '50vw',
					height: '50vw',
					background: oscuro
						? 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)'
						: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
					borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
					filter: 'blur(50px)',
					animation: 'flotar2 15s ease-in-out infinite',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: '30%',
					right: '-5%',
					width: '35vw',
					height: '35vw',
					background: oscuro
						? 'radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, transparent 70%)'
						: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
					borderRadius: '50% 50% 30% 70% / 40% 60% 40% 60%',
					filter: 'blur(45px)',
					animation: 'flotar3 18s ease-in-out infinite',
				}}
			/>
			<style>{`
                @keyframes flotar1 {
                    0%,100% { transform: translate(0,0) rotate(0deg) scale(1); }
                    33%     { transform: translate(3%,4%) rotate(8deg) scale(1.05); }
                    66%     { transform: translate(-2%,2%) rotate(-5deg) scale(0.97); }
                }
                @keyframes flotar2 {
                    0%,100% { transform: translate(0,0) rotate(0deg) scale(1); }
                    40%     { transform: translate(-4%,-3%) rotate(-10deg) scale(1.08); }
                    70%     { transform: translate(2%,-5%) rotate(6deg) scale(0.95); }
                }
                @keyframes flotar3 {
                    0%,100% { transform: translate(0,0) rotate(0deg) scale(1); }
                    50%     { transform: translate(-6%,4%) rotate(12deg) scale(1.06); }
                }
            `}</style>
		</div>
	);
}

export default function LoginPagina() {
	const navigate = useNavigate();
	const { setUsuario, temaOscuro, toggleTema } = useStore();

	const [usuario, setUsuarioVal] = useState('');
	const [contrasena, setContrasena] = useState('');
	const [mostrarPassword, setMostrarPassword] = useState(false);
	const [focusUsuario, setFocusUsuario] = useState(false);
	const [focusPassword, setFocusPassword] = useState(false);
	const [shake, setShake] = useState(false);
	const [cargando, setCargando] = useState(false);
	const [montado, setMontado] = useState(false);
	const [pupilaX, setPupilaX] = useState(0);
	const [pupilaY, setPupilaY] = useState(0);
	const inputRef = useRef(null);

	useEffect(() => {
		const t = setTimeout(() => setMontado(true), 80);
		return () => clearTimeout(t);
	}, []);

	const tapado = focusPassword && !mostrarPassword;
	const asomado = focusPassword && mostrarPassword;

	const actualizarPupila = (val, selStart) => {
		if (!focusUsuario) return;
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

	useEffect(() => {
		if (focusUsuario) {
			actualizarPupila(inputRef.current?.value ?? '', inputRef.current?.selectionStart ?? 0);
		} else if (focusPassword) {
			setPupilaX(2.4);
			setPupilaY(0.5);
		} else {
			setPupilaX(0);
			setPupilaY(0);
		}
	}, [focusUsuario, focusPassword]);

	const bodyTransform = tapado
		? 'scale(0.93) translateY(4px)'
		: asomado
			? 'scale(1.0) translateY(-2px) rotate(1deg)'
			: focusUsuario
				? 'scale(1.03) translateY(-3px) rotate(-2.5deg)'
				: focusPassword
					? 'scale(1.03) translateY(-3px) rotate(2.5deg)'
					: 'scale(1) translateY(0px)';

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!usuario.trim() || !contrasena) {
			setShake(true);
			setTimeout(() => setShake(false), 600);
			toast.error('Por favor ingresa usuario y contraseña');
			return;
		}
		setCargando(true);
		try {
			const res = await usuariosApi.login({ nombreUsuario: usuario, contrasena });
			setUsuario(res.data);
			toast.success(`Bienvenido, ${res.data.NOMBRE || usuario}`);
			navigate('/dashboard');
		} catch (err) {
			toast.error(err.response?.data?.mensaje ?? 'Error al conectar con el servidor.');
			setShake(true);
			setTimeout(() => setShake(false), 600);
		} finally {
			setCargando(false);
		}
	};

	if (cargando) return <AnimacionCarga mensaje="Ingresando al panel de gestión" />;

	const o = temaOscuro;

	const glass = {
		background: o ? 'rgba(15,15,25,0.55)' : 'rgba(255,255,255,0.45)',
		backdropFilter: 'blur(28px) saturate(1.6)',
		WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
		border: o ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.7)',
		boxShadow: o
			? '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.07) inset'
			: '0 24px 64px rgba(80,80,120,0.15), 0 0 0 1px rgba(255,255,255,0.9) inset',
	};

	const inputStyle = (foco, colorFoco) => ({
		width: '100%',
		boxSizing: 'border-box',
		paddingLeft: '44px',
		paddingRight: '16px',
		paddingTop: '14px',
		paddingBottom: '14px',
		fontSize: '14px',
		borderRadius: '16px',
		outline: 'none',
		background: foco
			? o
				? 'rgba(255,255,255,0.08)'
				: 'rgba(255,255,255,0.85)'
			: o
				? 'rgba(255,255,255,0.04)'
				: 'rgba(255,255,255,0.55)',
		border: `1px solid ${foco ? colorFoco : o ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'}`,
		color: o ? '#f4f4f5' : '#09090b',
		transition: 'all 0.25s ease',
		boxShadow: foco ? `0 0 0 3px ${colorFoco}25` : 'none',
		backdropFilter: 'blur(8px)',
	});

	return (
		<div
			style={{
				position: 'relative',
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
			}}
		>
			<FondoEspacio oscuro={o} />
			<FormasOrganicas oscuro={o} />

			<div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
				<button
					onClick={toggleTema}
					style={{
						...glass,
						display: 'flex',
						alignItems: 'center',
						gap: '7px',
						padding: '9px 16px',
						borderRadius: '999px',
						cursor: 'pointer',
						transition: 'all 0.25s ease',
					}}
				>
					{o ? (
						<Sun style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
					) : (
						<Moon style={{ width: '14px', height: '14px', color: '#6366f1' }} />
					)}
					<span
						style={{
							fontSize: '11px',
							fontWeight: 700,
							color: o ? '#a1a1aa' : '#6366f1',
							letterSpacing: '0.05em',
						}}
					>
						{o ? 'Modo día' : 'Modo noche'}
					</span>
				</button>
			</div>

			<div
				style={{
					position: 'relative',
					zIndex: 10,
					width: '100%',
					maxWidth: '420px',
					margin: '24px',
					...glass,
					borderRadius: '32px',
					padding: '40px 36px 36px',
					opacity: montado ? 1 : 0,
					transform: montado ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
					transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
					animation: shake ? 'loginShake 0.55s ease' : undefined,
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: '15%',
						right: '15%',
						height: '1px',
						background:
							'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(99,102,241,0.8), transparent)',
						borderRadius: '999px',
					}}
				/>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '8px',
						marginBottom: '4px',
					}}
				>
					<span
						style={{
							fontSize: '13px',
							fontWeight: 800,
							letterSpacing: '-0.3px',
							color: o ? 'rgba(255,255,255,0.9)' : '#1e1b4b',
						}}
					>
						Condominio <span style={{ color: '#10b981' }}>PRUEBA</span>
					</span>
				</div>

				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
					<div
						style={{
							transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
							transform: bodyTransform,
						}}
					>
						<CaballoAnimado tapado={tapado} asomado={asomado} pupilaX={pupilaX} pupilaY={pupilaY} />
					</div>
				</div>

				<div style={{ textAlign: 'center', marginBottom: '28px' }}>
					<h1
						style={{
							fontSize: '26px',
							fontWeight: 900,
							letterSpacing: '-0.8px',
							marginBottom: '6px',
							color: o ? '#f4f4f5' : '#09090b',
						}}
					>
						Bienvenido
					</h1>
					<p
						style={{
							fontSize: '13px',
							color: o ? 'rgba(255,255,255,0.45)' : 'rgba(9,9,11,0.55)',
							fontWeight: 500,
						}}
					>
						Accede al panel de gestión residencial
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
				>
					<div>
						<label
							style={{
								display: 'block',
								fontSize: '10px',
								fontWeight: 700,
								color: o ? 'rgba(255,255,255,0.4)' : 'rgba(9,9,11,0.5)',
								textTransform: 'uppercase',
								letterSpacing: '0.18em',
								marginBottom: '8px',
							}}
						>
							Usuario
						</label>
						<div style={{ position: 'relative' }}>
							<User
								style={{
									position: 'absolute',
									left: '14px',
									top: '50%',
									transform: 'translateY(-50%)',
									width: '15px',
									height: '15px',
									color: focusUsuario ? '#10b981' : o ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
									transition: 'color 0.2s',
								}}
							/>
							<input
								ref={inputRef}
								type="text"
								required
								value={usuario}
								onChange={(e) => {
									setUsuarioVal(e.target.value);
									actualizarPupila(e.target.value, e.target.selectionStart ?? e.target.value.length);
								}}
								onKeyUp={(e) =>
									actualizarPupila(e.target.value, e.target.selectionStart ?? e.target.value.length)
								}
								onFocus={() => setFocusUsuario(true)}
								onBlur={() => setFocusUsuario(false)}
								placeholder="nombre de usuario"
								style={inputStyle(focusUsuario, '#10b981')}
							/>
						</div>
					</div>

					<div>
						<label
							style={{
								display: 'block',
								fontSize: '10px',
								fontWeight: 700,
								color: o ? 'rgba(255,255,255,0.4)' : 'rgba(9,9,11,0.5)',
								textTransform: 'uppercase',
								letterSpacing: '0.18em',
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
									color: focusPassword ? '#6366f1' : o ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
									transition: 'color 0.2s',
								}}
							/>
							<input
								type={mostrarPassword ? 'text' : 'password'}
								required
								value={contrasena}
								onChange={(e) => setContrasena(e.target.value)}
								onFocus={() => setFocusPassword(true)}
								onBlur={() => setFocusPassword(false)}
								placeholder="••••••••"
								style={{ ...inputStyle(focusPassword, '#6366f1'), paddingRight: '48px' }}
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
									color: o ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
									display: 'flex',
									alignItems: 'center',
									transition: 'color 0.2s',
								}}
							>
								{mostrarPassword ? (
									<Eye style={{ width: '16px', height: '16px' }} />
								) : (
									<EyeOff style={{ width: '16px', height: '16px' }} />
								)}
							</button>
						</div>
					</div>

					<button
						type="submit"
						style={{
							marginTop: '8px',
							width: '100%',
							padding: '15px',
							fontSize: '14px',
							fontWeight: 800,
							letterSpacing: '0.03em',
							borderRadius: '16px',
							border: 'none',
							cursor: 'pointer',
							background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px',
							boxShadow: '0 8px 32px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset',
							transition: 'all 0.2s ease',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow =
								'0 14px 40px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow =
								'0 8px 32px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset';
						}}
						onMouseDown={(e) => {
							e.currentTarget.style.transform = 'translateY(1px)';
						}}
					>
						<Lock style={{ width: '15px', height: '15px' }} />
						Iniciar Sesión
					</button>
				</form>

				<div
					style={{
						marginTop: '24px',
						paddingTop: '18px',
						borderTop: `1px solid ${o ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '8px',
					}}
				>
					<span
						style={{
							width: '6px',
							height: '6px',
							borderRadius: '50%',
							background: '#10b981',
							animation: 'pulsarPunto 2s infinite',
						}}
					/>
					<span
						style={{
							fontSize: '11px',
							fontWeight: 500,
							color: o ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)',
						}}
					>
						esta es una demo de un sistema de gestión de condominios.
					</span>
				</div>
			</div>

			<style>{`
                @keyframes loginShake {
                    0%,100% { transform: translateY(0) scale(1) translateX(0); }
                    15%     { transform: translateY(0) scale(1.01) translateX(-8px); }
                    30%     { transform: translateY(0) scale(0.99) translateX(7px); }
                    45%     { transform: translateY(0) scale(1.01) translateX(-5px); }
                    60%     { transform: translateY(0) scale(1)    translateX(4px); }
                    75%     { transform: translateY(0) scale(1)    translateX(-2px); }
                }
                @keyframes pulsarPunto {
                    0%,100% { opacity: 1;   transform: scale(1); }
                    50%     { opacity: 0.4; transform: scale(0.8); }
                }
                input::placeholder { color: ${temaOscuro ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.28)'}; }
            `}</style>
		</div>
	);
}
