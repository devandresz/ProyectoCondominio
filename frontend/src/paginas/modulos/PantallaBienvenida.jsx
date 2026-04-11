// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/PantallaBienvenida.jsx
// ============================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import {
	Building,
	Car,
	QrCode,
	AlertTriangle,
	Users,
	TrendingUp,
	Shield,
	MapPin,
	Activity,
	ArrowUpRight,
	Wifi,
	Clock,
	Zap,
	BarChart3,
	Eye,
} from 'lucide-react';
import useStore from '../../estado/useStore.js';
import { propiedadesApi } from '../../api/propiedadesApi.js';
import { invitacionesApi } from '../../api/invitacionesApi.js';

function GloboTierra({ lat = 14.6349, lon = -90.5069 }) {
	const canvasRef = useRef(null);
	const animRef = useRef(null);
	const rotRef = useRef({ y: (-90.5069 * Math.PI) / 180 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		const setSize = () => {
			canvas.width = canvas.offsetWidth * 2;
			canvas.height = canvas.offsetHeight * 2;
			ctx.scale(2, 2);
		};
		setSize();
		const W = canvas.offsetWidth,
			H = canvas.offsetHeight;
		const cx = W / 2,
			cy = H / 2;
		const R = Math.min(W, H) * 0.44;

		const TIERRA = [
			// América del Norte
			[
				[71, -141],
				[71, -95],
				[60, -95],
				[60, -64],
				[47, -53],
				[44, -66],
				[42, -70],
				[41, -72],
				[35, -75],
				[30, -81],
				[25, -80],
				[20, -87],
				[15, -92],
				[8, -77],
				[9, -79],
				[10, -84],
				[15, -92],
				[20, -87],
				[25, -80],
				[32, -117],
				[38, -122],
				[48, -124],
				[55, -130],
				[60, -140],
				[66, -141],
				[71, -141],
			],
			// Groenlandia
			[
				[83, -25],
				[76, -18],
				[65, -18],
				[60, -44],
				[65, -52],
				[72, -55],
				[76, -68],
				[83, -50],
				[83, -25],
			],
			// América Central
			[
				[20, -87],
				[15, -92],
				[10, -84],
				[8, -77],
				[9, -79],
				[10, -84],
				[15, -92],
				[20, -87],
			],
			// América del Sur
			[
				[12, -72],
				[10, -62],
				[6, -52],
				[0, -50],
				[-5, -35],
				[-10, -37],
				[-15, -39],
				[-23, -43],
				[-33, -53],
				[-40, -62],
				[-55, -65],
				[-56, -68],
				[-50, -68],
				[-45, -65],
				[-38, -57],
				[-30, -51],
				[-22, -43],
				[-15, -39],
				[-5, -35],
				[0, -50],
				[5, -52],
				[10, -62],
				[12, -72],
			],
			// Europa occidental
			[
				[71, 28],
				[71, 20],
				[60, 5],
				[51, 2],
				[48, -5],
				[44, -8],
				[36, -9],
				[36, -5],
				[38, 0],
				[40, 3],
				[44, 8],
				[44, 14],
				[47, 18],
				[50, 14],
				[54, 9],
				[57, 8],
				[60, 5],
				[68, 14],
				[71, 20],
			],
			// Escandinavia
			[
				[71, 28],
				[68, 28],
				[64, 27],
				[60, 25],
				[57, 18],
				[58, 12],
				[62, 14],
				[65, 14],
				[68, 18],
				[71, 25],
				[71, 28],
			],
			// África
			[
				[37, 10],
				[37, 12],
				[30, 32],
				[22, 37],
				[12, 44],
				[5, 42],
				[0, 42],
				[-5, 40],
				[-10, 40],
				[-20, 36],
				[-35, 27],
				[-35, 20],
				[-26, 15],
				[-18, 12],
				[-8, 8],
				[0, 2],
				[5, -5],
				[10, -15],
				[16, -17],
				[22, -17],
				[30, -5],
				[37, 10],
			],
			// Oriente Medio / Arabia
			[
				[30, 32],
				[22, 37],
				[12, 44],
				[13, 43],
				[20, 58],
				[25, 57],
				[30, 48],
				[32, 35],
				[30, 32],
			],
			// Asia central/norte
			[
				[71, 28],
				[71, 60],
				[68, 60],
				[60, 60],
				[55, 65],
				[50, 55],
				[42, 50],
				[40, 60],
				[50, 60],
				[55, 70],
				[60, 70],
				[65, 70],
				[71, 70],
				[71, 100],
				[65, 100],
				[60, 100],
				[50, 104],
				[40, 116],
				[38, 120],
				[36, 120],
				[30, 120],
				[25, 110],
				[20, 110],
				[15, 108],
				[10, 104],
				[5, 100],
				[0, 104],
				[5, 100],
				[15, 108],
				[20, 110],
				[25, 120],
				[35, 130],
				[40, 130],
				[50, 142],
				[60, 140],
				[71, 140],
				[71, 100],
				[71, 60],
				[71, 28],
			],
			// Japón simplificado
			[
				[45, 142],
				[43, 141],
				[40, 140],
				[35, 137],
				[34, 134],
				[36, 136],
				[40, 140],
				[43, 141],
				[45, 142],
			],
			// India
			[
				[30, 70],
				[20, 68],
				[8, 77],
				[10, 80],
				[15, 80],
				[20, 87],
				[22, 88],
				[25, 85],
				[30, 78],
				[32, 75],
				[30, 70],
			],
			// Australia
			[
				[-15, 130],
				[-15, 137],
				[-20, 149],
				[-28, 153],
				[-35, 150],
				[-38, 146],
				[-38, 140],
				[-32, 133],
				[-25, 113],
				[-20, 114],
				[-15, 130],
			],
			// Nueva Zelanda
			[
				[-35, 174],
				[-38, 176],
				[-44, 171],
				[-46, 168],
				[-44, 168],
				[-38, 174],
				[-35, 174],
			],
		];

		const project = (latDeg, lonDeg, rotY) => {
			const la = (latDeg * Math.PI) / 180;
			const lo = (lonDeg * Math.PI) / 180 + rotY;
			const x3 = Math.cos(la) * Math.sin(lo);
			const y3 = Math.sin(la);
			const z3 = Math.cos(la) * Math.cos(lo);
			return { x: cx + R * x3, y: cy - R * y3, z: z3, v: z3 > -0.1 };
		};

		const dibujar = () => {
			ctx.clearRect(0, 0, W, H);
			const ry = rotRef.current.y;
			const t = Date.now();

			const glowOut = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.35);
			glowOut.addColorStop(0, 'rgba(99,102,241,0.15)');
			glowOut.addColorStop(0.4, 'rgba(16,185,129,0.06)');
			glowOut.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
			ctx.fillStyle = glowOut;
			ctx.fill();

			const atm = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.08);
			atm.addColorStop(0, 'rgba(99,102,241,0)');
			atm.addColorStop(0.5, 'rgba(99,102,241,0.18)');
			atm.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
			ctx.fillStyle = atm;
			ctx.fill();

			const ocean = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
			ocean.addColorStop(0, 'rgba(20,30,80,0.75)');
			ocean.addColorStop(0.7, 'rgba(8,12,40,0.85)');
			ocean.addColorStop(1, 'rgba(4,6,24,0.9)');
			ctx.beginPath();
			ctx.arc(cx, cy, R, 0, Math.PI * 2);
			ctx.fillStyle = ocean;
			ctx.fill();

			for (let la = -75; la <= 75; la += 15) {
				const alpha = la === 0 ? 0.22 : 0.09;
				ctx.beginPath();
				let f = true;
				for (let lo = -180; lo <= 180; lo += 2) {
					const p = project(la, lo, ry);
					if (!p.v) {
						f = true;
						continue;
					}
					f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
					f = false;
				}
				ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
				ctx.lineWidth = la === 0 ? 0.8 : 0.4;
				ctx.stroke();
			}
			for (let lo = -180; lo < 180; lo += 15) {
				const alpha = lo === 0 ? 0.22 : 0.09;
				ctx.beginPath();
				let f = true;
				for (let la = -90; la <= 90; la += 2) {
					const p = project(la, lo, ry);
					if (!p.v) {
						f = true;
						continue;
					}
					f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
					f = false;
				}
				ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
				ctx.lineWidth = lo === 0 ? 0.8 : 0.4;
				ctx.stroke();
			}

			TIERRA.forEach((coords, idx) => {
				const puntos = coords.map(([la, lo]) => project(la, lo, ry));
				const visibles = puntos.filter((p) => p.v);
				if (visibles.length < 3) return;

				ctx.beginPath();
				let f = true;
				coords.forEach(([la, lo]) => {
					const p = project(la, lo, ry);
					if (!p.v) {
						f = true;
						return;
					}
					f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
					f = false;
				});
				ctx.closePath();

				const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
				grad.addColorStop(0, 'rgba(16,185,129,0.65)');
				grad.addColorStop(0.5, 'rgba(52,211,153,0.45)');
				grad.addColorStop(1, 'rgba(99,102,241,0.55)');
				ctx.fillStyle = grad;
				ctx.fill();

				ctx.strokeStyle = 'rgba(52,211,153,0.5)';
				ctx.lineWidth = 0.7;
				ctx.stroke();
			});

			const CIUDADES = [
				[40.7, -74],
				[51.5, 0],
				[35.7, 139],
				[28.6, 77],
				[48.9, 2],
				[-33.9, 18],
				[55.8, 37],
			];
			CIUDADES.forEach(([la, lo]) => {
				const p = project(la, lo, ry);
				if (!p.v || p.z < 0.1) return;
				const alpha = Math.min(1, (p.z - 0.1) / 0.4);
				ctx.beginPath();
				ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(250,250,250,${alpha * 0.6})`;
				ctx.fill();
				const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
				g.addColorStop(0, `rgba(250,250,250,${alpha * 0.15})`);
				g.addColorStop(1, 'transparent');
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
				ctx.fill();
			});

			const gt = project(lat, lon, ry);
			if (gt.v && gt.z > 0.05) {
				const alpha = Math.min(1, gt.z * 1.5);
				const pulso = (Math.sin(t / 380) + 1) / 2;
				const pulso2 = (Math.sin(t / 380 + 1) + 1) / 2;

				[22, 14, 8].forEach((r, i) => {
					const a = [0.15, 0.3, 0.5][i] * alpha;
					const p2 = [pulso, pulso2, 1][i];
					ctx.beginPath();
					ctx.arc(gt.x, gt.y, r * p2, 0, Math.PI * 2);
					ctx.strokeStyle = `rgba(16,185,129,${a})`;
					ctx.lineWidth = [1, 1.5, 2][i];
					ctx.stroke();
				});

				ctx.beginPath();
				ctx.arc(gt.x, gt.y, 4.5, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(16,185,129,${alpha})`;
				ctx.fill();
				ctx.beginPath();
				ctx.arc(gt.x, gt.y, 2, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255,255,255,${alpha})`;
				ctx.fill();

				if (gt.z > 0.3) {
					ctx.beginPath();
					ctx.moveTo(gt.x + 6, gt.y - 6);
					ctx.lineTo(gt.x + 22, gt.y - 18);
					ctx.strokeStyle = `rgba(16,185,129,${alpha * 0.7})`;
					ctx.lineWidth = 0.8;
					ctx.stroke();

					ctx.font = 'bold 9px monospace';
					ctx.fillStyle = `rgba(52,211,153,${alpha * 0.9})`;
					ctx.fillText('GTM', gt.x + 24, gt.y - 16);
				}
			}

			const spec = ctx.createRadialGradient(
				cx - R * 0.4,
				cy - R * 0.4,
				0,
				cx - R * 0.15,
				cy - R * 0.15,
				R * 0.75,
			);
			spec.addColorStop(0, 'rgba(255,255,255,0.10)');
			spec.addColorStop(0.3, 'rgba(255,255,255,0.04)');
			spec.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(cx, cy, R, 0, Math.PI * 2);
			ctx.fillStyle = spec;
			ctx.fill();

			const shadow = ctx.createRadialGradient(
				cx + R * 0.35,
				cy + R * 0.35,
				0,
				cx + R * 0.35,
				cy + R * 0.35,
				R * 0.8,
			);
			shadow.addColorStop(0, 'rgba(0,0,0,0.35)');
			shadow.addColorStop(1, 'transparent');
			ctx.beginPath();
			ctx.arc(cx, cy, R, 0, Math.PI * 2);
			ctx.fillStyle = shadow;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(cx, cy, R, 0, Math.PI * 2);
			const borde = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
			borde.addColorStop(0, 'rgba(99,102,241,0.5)');
			borde.addColorStop(0.5, 'rgba(16,185,129,0.35)');
			borde.addColorStop(1, 'rgba(99,102,241,0.2)');
			ctx.strokeStyle = borde;
			ctx.lineWidth = 1.2;
			ctx.stroke();

			rotRef.current.y += 0.0018;
			animRef.current = requestAnimationFrame(dibujar);
		};

		animRef.current = requestAnimationFrame(dibujar);
		return () => cancelAnimationFrame(animRef.current);
	}, [lat, lon]);

	return (
		<canvas
			ref={canvasRef}
			style={{ display: 'block', width: '100%', height: '100%', background: 'transparent' }}
		/>
	);
}

function HoraViva() {
	const [tiempo, setTiempo] = useState({ h: '', m: '', s: '', fecha: '' });
	useEffect(() => {
		const act = () => {
			const n = new Date();
			setTiempo({
				h: String(n.getHours()).padStart(2, '0'),
				m: String(n.getMinutes()).padStart(2, '0'),
				s: String(n.getSeconds()).padStart(2, '0'),
				fecha: n.toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric', month: 'short' }),
			});
		};
		act();
		const iv = setInterval(act, 1000);
		return () => clearInterval(iv);
	}, []);
	return (
		<div className="text-center">
			<div className="flex items-end justify-center gap-0.5 font-mono">
				<span className="text-3xl font-bold text-primario">{tiempo.h}</span>
				<span className="text-2xl font-bold text-emerald-400 mb-0.5 animate-pulse">:</span>
				<span className="text-3xl font-bold text-primario">{tiempo.m}</span>
				<span className="text-lg font-bold text-secundario mb-0.5 ml-1">{tiempo.s}</span>
			</div>
			<p className="text-[10px] text-secundario mt-1 capitalize">{tiempo.fecha} · GMT-6</p>
		</div>
	);
}

function CardMetrica({ etiqueta, valor, sub, Icono, color, delay, onClick, trend }) {
	const [listo, setListo] = useState(false);
	useEffect(() => {
		const t = setTimeout(() => setListo(true), delay);
		return () => clearTimeout(t);
	}, [delay]);

	return (
		<div
			onClick={onClick}
			style={{
				transform: listo ? 'scale(1)' : 'scale(0.35)',
				opacity: listo ? 1 : 0,
				transition: `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
			}}
			className={`relative p-5 rounded-2xl border bg-tarjeta overflow-hidden ${color.border} ${onClick ? 'cursor-pointer group hover:-translate-y-1 transition-transform duration-300' : ''}`}
		>
			<div
				className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-25 ${color.glow}`}
			/>
			<div className={`absolute top-0 left-4 right-4 h-px ${color.line}`} />

			<div className="relative z-10">
				<div className="flex items-start justify-between mb-5">
					<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.bg}`}>
						<Icono className={`w-5 h-5 ${color.icon}`} />
					</div>
					{trend && (
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
							<TrendingUp className="w-3 h-3 text-emerald-400" />
							<span className="text-[10px] font-bold text-emerald-400">{trend}</span>
						</div>
					)}
				</div>

				<p className={`text-4xl font-bold mb-1 ${color.icon}`}>{valor}</p>
				<p className="text-[11px] font-bold uppercase tracking-widest text-secundario">
					{etiqueta}
				</p>
				{sub && <p className="text-[10px] text-secundario mt-1 opacity-70">{sub}</p>}

				{onClick && (
					<div
						className={`flex items-center gap-1 mt-4 text-[11px] font-bold ${color.icon} opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0`}
					>
						<span>Abrir módulo</span>
						<ArrowUpRight className="w-3 h-3" />
					</div>
				)}
			</div>
		</div>
	);
}

export default function PantallaBienvenida({ setModuloActivo }) {
	const usuario = useStore((s) => s.usuario);
	const [stats, setStats] = useState({ props: '—', activas: '—', qr: '—', qrActivos: '—' });

	const hora = new Date().getHours();
	const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

	useEffect(() => {
		propiedadesApi
			.obtenerTodas()
			.then((r) => {
				const d = r.data;
				setStats((s) => ({
					...s,
					props: d.length,
					activas: d.filter((p) => p.ACTIVO === 1).length,
				}));
			})
			.catch(() => {});
		invitacionesApi
			.obtenerTodas()
			.then((r) => {
				const d = r.data;
				setStats((s) => ({
					...s,
					qr: d.length,
					qrActivos: d.filter((i) => i.ACTIVO === 1).length,
				}));
			})
			.catch(() => {});
	}, []);

	const CARDS = [
		{
			etiqueta: 'Propiedades',
			valor: stats.props,
			sub: `${stats.activas} activas registradas`,
			Icono: Building,
			trend: 'activo',
			color: {
				bg: 'bg-sky-500/15',
				icon: 'text-sky-400',
				glow: 'bg-sky-500',
				border: 'border-sky-500/20',
				line: 'bg-gradient-to-r from-transparent via-sky-500/50 to-transparent',
			},
			delay: 80,
			modulo: 'Gestión de Propiedades',
			roles: ['Administrador'],
		},
		{
			etiqueta: 'Pases QR',
			valor: stats.qr,
			sub: `${stats.qrActivos} activos hoy`,
			Icono: QrCode,
			trend: 'live',
			color: {
				bg: 'bg-emerald-500/15',
				icon: 'text-emerald-400',
				glow: 'bg-emerald-500',
				border: 'border-emerald-500/20',
				line: 'bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent',
			},
			delay: 200,
			modulo: 'Pases de Visita (QR)',
			roles: ['Administrador', 'Guardia', 'Residente'],
		},
		{
			etiqueta: 'Vehículos',
			valor: '—',
			sub: 'Padrón del condominio',
			Icono: Car,
			color: {
				bg: 'bg-violet-500/15',
				icon: 'text-violet-400',
				glow: 'bg-violet-500',
				border: 'border-violet-500/20',
				line: 'bg-gradient-to-r from-transparent via-violet-500/50 to-transparent',
			},
			delay: 320,
			modulo: 'Control Vehicular',
			roles: ['Administrador', 'Guardia', 'Residente'],
		},
		{
			etiqueta: 'Multas',
			valor: '—',
			sub: 'Infracciones registradas',
			Icono: AlertTriangle,
			color: {
				bg: 'bg-amber-500/15',
				icon: 'text-amber-400',
				glow: 'bg-amber-500',
				border: 'border-amber-500/20',
				line: 'bg-gradient-to-r from-transparent via-amber-500/50 to-transparent',
			},
			delay: 440,
			modulo: 'Infracciones y Multas',
			roles: ['Administrador', 'Guardia', 'Residente'],
		},
	];

	const cardsFiltradas = CARDS.filter((c) => c.roles.includes(usuario?.ROL));

	return (
		<div className="flex flex-col gap-5 select-none">
			<div
				className="grid gap-5"
				style={{ gridTemplateColumns: '300px 1fr 200px', minHeight: '360px' }}
			>
				<div
					className="relative rounded-2xl border border-borde bg-tarjeta p-7 flex flex-col justify-between overflow-hidden"
					style={{ animation: 'entrada 0.65s cubic-bezier(0.34,1.56,0.64,1) both' }}
				>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							pointerEvents: 'none',
							backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)',
							backgroundSize: '18px 18px',
						}}
					/>
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/8 blur-3xl" />
					</div>

					<div className="relative z-10">
						<div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/15 w-fit">
							<Wifi className="w-3 h-3 text-emerald-400" />
							<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">
								Sistema activo
							</span>
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
						</div>

						<p className="text-xs font-bold tracking-[0.3em] uppercase text-secundario mb-2">
							{saludo}
						</p>

						<h1 className="text-[2.2rem] font-bold text-primario leading-none mb-1">
							{usuario?.NOMBRE ?? 'Bienvenido'}
						</h1>
						<h2 className="text-xl font-semibold text-secundario mb-5">{usuario?.APELLIDO ?? ''}</h2>

						<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fondo border border-borde w-fit">
							<Shield className="w-3.5 h-3.5 text-emerald-400" />
							<span className="text-xs font-bold text-primario">{usuario?.ROL ?? '—'}</span>
							<div className="w-px h-3 bg-borde mx-1" />
							<span className="text-[10px] text-secundario">Condominio PRUEBA</span>
						</div>
					</div>

					<div className="relative z-10 mt-4 p-3 rounded-xl bg-fondo border border-borde">
						<div className="flex items-center gap-2 mb-1">
							<MapPin className="w-3.5 h-3.5 text-emerald-400" />
							<span className="text-xs font-bold text-primario">Ciudad de Guatemala</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono text-secundario">14.6349° N · 90.5069° O</span>
							<div className="flex items-center gap-1">
								<Activity className="w-3 h-3 text-emerald-400" />
								<span className="text-[10px] font-bold text-emerald-400">En línea</span>
							</div>
						</div>
					</div>
				</div>

				<div
					className="relative rounded-2xl border border-borde overflow-hidden"
					style={{
						background: 'transparent',
						animation: 'entrada 0.7s cubic-bezier(0.34,1.56,0.64,1) 80ms both',
					}}
				>
					<div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-tarjeta/70 backdrop-blur-md border border-borde">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						<span className="text-[11px] font-bold font-mono text-primario">
							GT · Guatemala City
						</span>
					</div>

					<div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-secundario">
						<span className="text-emerald-400">LAT</span> 14.6349{' '}
						<span className="text-emerald-400 ml-2">LON</span> -90.5069
					</div>

					<GloboTierra lat={14.6349} lon={-90.5069} />
				</div>

				<div
					className="flex flex-col gap-3"
					style={{ animation: 'entrada 0.65s cubic-bezier(0.34,1.56,0.64,1) 160ms both' }}
				>
					<div className="p-4 rounded-2xl border border-borde bg-tarjeta relative overflow-hidden">
						<div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
						<div className="flex items-center gap-2 mb-3">
							<Clock className="w-3.5 h-3.5 text-violet-400" />
							<span className="text-[10px] font-bold uppercase tracking-widest text-secundario">
								Hora Local
							</span>
						</div>
						<HoraViva />
					</div>

					{(usuario?.ROL === 'Administrador' ||
						usuario?.ROL === 'Guardia' ||
						usuario?.ROL === 'Residente') && (
						<button
							onClick={() => setModuloActivo?.('Pases de Visita (QR)')}
							className="flex-1 p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-400/40 transition-all duration-200 group flex flex-col items-center justify-center gap-2 relative overflow-hidden"
						>
							<div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
							<div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<QrCode className="w-5 h-5 text-emerald-400" />
							</div>
							<div className="text-center">
								<p className="text-xs font-bold text-emerald-400">Generar Pase</p>
								<p className="text-[10px] text-secundario">Acceso QR</p>
							</div>
						</button>
					)}

					{usuario?.ROL === 'Administrador' && (
						<button
							onClick={() => setModuloActivo?.('Directorio Residentes')}
							className="p-4 rounded-2xl border border-sky-500/25 bg-sky-500/8 hover:bg-sky-500/15 hover:border-sky-400/40 transition-all duration-200 group flex flex-col items-center justify-center gap-2 relative overflow-hidden"
						>
							<div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
							<div className="w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<Users className="w-5 h-5 text-sky-400" />
							</div>
							<div className="text-center">
								<p className="text-xs font-bold text-sky-400">Residentes</p>
								<p className="text-[10px] text-secundario">Directorio</p>
							</div>
						</button>
					)}

					{usuario?.ROL === 'Administrador' && (
						<button
							onClick={() => setModuloActivo?.('Gestión de Propiedades')}
							className="p-4 rounded-2xl border border-violet-500/25 bg-violet-500/8 hover:bg-violet-500/15 hover:border-violet-400/40 transition-all duration-200 group flex items-center gap-3 relative overflow-hidden"
						>
							<div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
							<div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
								<Eye className="w-4 h-4 text-violet-400" />
							</div>
							<div className="text-left">
								<p className="text-xs font-bold text-violet-400">Propiedades</p>
								<p className="text-[10px] text-secundario">Ver todo</p>
							</div>
							<ArrowUpRight className="w-3.5 h-3.5 text-violet-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
						</button>
					)}
				</div>
			</div>

			<div
				className={`grid gap-4 ${cardsFiltradas.length === 4 ? 'grid-cols-4' : cardsFiltradas.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
			>
				{cardsFiltradas.map((c) => (
					<CardMetrica
						key={c.modulo}
						{...c}
						onClick={setModuloActivo ? () => setModuloActivo(c.modulo) : undefined}
					/>
				))}
			</div>

			<div
				className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-borde bg-tarjeta"
				style={{ animation: 'entrada 0.5s ease 650ms both' }}
			>
				<BarChart3 className="w-4 h-4 text-secundario flex-shrink-0" />
				<p className="text-xs text-secundario flex-1">
					Selecciona un módulo en el menú lateral para gestionar el condominio.
				</p>
				<div className="flex items-center gap-4 text-[10px] font-mono text-secundario flex-shrink-0">
					<span className="flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						Oracle DB
					</span>
					<span className="flex items-center gap-1.5">
						<span
							className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"
							style={{ animationDelay: '0.5s' }}
						/>
						Backend API
					</span>
					<span className="flex items-center gap-1.5">
						<span
							className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"
							style={{ animationDelay: '1s' }}
						/>
						Frontend
					</span>
				</div>
			</div>

			<style>{`
				@keyframes entrada {
					from { opacity: 0; transform: translateY(20px) scale(0.96); }
					to   { opacity: 1; transform: translateY(0) scale(1); }
				}
			`}</style>
		</div>
	);
}
