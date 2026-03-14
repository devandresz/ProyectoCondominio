import { useState, useRef, useEffect } from 'react';
import {
	Building,
	Car,
	QrCode,
	AlertTriangle,
	Search,
	Bell,
	ShieldCheck,
	Plus,
	X,
	Eye,
	Ban,
	CheckCircle,
	Clock,
	Save,
	Tag,
	Zap,
	RefreshCw,
	Trash2,
	Users,
	ParkingCircle,
	Trees,
	CalendarDays,
	PhoneCall,
	ArrowLeftRight,
	CreditCard,
	BookOpen,
	Layers,
	Ticket,
	Lock,
	ChevronRight,
	ChevronDown,
	CheckCircle2,
	Info,
	Home,
	ShieldAlert,
	Wallet,
	Briefcase,
	Pencil,
	Sun,
	Moon,
	UserCheck,
	Camera,
	Mail,
	Loader2,
	EyeOff,
} from 'lucide-react';

/* ==========================================================================
   1. DATOS TEMPORALES (MOCKS)
   TODO: Reemplazar estos arrays cuando se terminen de crear las rutas en el backend
========================================================================== */

const propiedadesEjemplo = [
	{
		id: 1,
		numero: 'A-101',
		categoria: 'Básica',
		cuota: 500,
		estado: 'Activo',
		propietario: 'Carlos Méndez',
		inquilino: null,
		parqueos: 1,
	},
	{
		id: 2,
		numero: 'B-205',
		categoria: 'Intermedia',
		cuota: 800,
		estado: 'Activo',
		propietario: 'Laura Cifuentes',
		inquilino: 'Mario Vides',
		parqueos: 2,
	},
	{
		id: 3,
		numero: 'C-310',
		categoria: 'Completa',
		cuota: 1200,
		estado: 'Activo',
		propietario: 'Roberto Lima',
		inquilino: null,
		parqueos: 3,
	},
	{
		id: 4,
		numero: 'A-102',
		categoria: 'Básica',
		cuota: 500,
		estado: 'Inactivo',
		propietario: '—',
		inquilino: null,
		parqueos: 0,
	},
	{
		id: 5,
		numero: 'D-401',
		categoria: 'Intermedia',
		cuota: 800,
		estado: 'Activo',
		propietario: 'María García',
		inquilino: 'Andrea Solís',
		parqueos: 2,
	},
];

const vehiculosEjemplo = [
	{
		id: 1,
		placa: 'P-123ABC',
		marca: 'Toyota',
		modelo: 'Corolla',
		color: 'Blanco',
		responsable: 'Carlos Méndez',
		propiedad: 'A-101',
		estado: 'Activo',
	},
	{
		id: 2,
		placa: 'P-456DEF',
		marca: 'Honda',
		modelo: 'Civic',
		color: 'Gris',
		responsable: 'Mario Vides',
		propiedad: 'B-205',
		estado: 'Activo',
	},
	{
		id: 3,
		placa: 'P-789GHI',
		marca: 'Chevrolet',
		modelo: 'Spark',
		color: 'Rojo',
		responsable: 'Roberto Lima',
		propiedad: 'C-310',
		estado: 'Activo',
	},
	{
		id: 4,
		placa: 'P-321JKL',
		marca: 'Suzuki',
		modelo: 'Swift',
		color: 'Azul',
		responsable: 'Andrea Solís',
		propiedad: 'D-401',
		estado: 'Inactivo',
	},
];

const invitacionesEjemplo = [
	{
		id: 1,
		visitante: 'Juan Pérez',
		tipo: 'Normal',
		residente: 'Carlos Méndez',
		propiedad: 'A-101',
		fecha: '2025-07-15',
		estado: 'Pendiente',
		codigo: 'QR-001',
	},
	{
		id: 2,
		visitante: 'Ana López',
		tipo: 'Servicio',
		residente: 'Mario Vides',
		propiedad: 'B-205',
		fecha: null,
		estado: 'Pendiente',
		codigo: 'QR-002',
	},
	{
		id: 3,
		visitante: 'Pedro Castillo',
		tipo: 'Normal',
		residente: 'Roberto Lima',
		propiedad: 'C-310',
		fecha: '2024-01-01',
		estado: 'Expirado',
		codigo: 'QR-003',
	},
	{
		id: 4,
		visitante: 'Sofía Ramos',
		tipo: 'Servicio',
		residente: 'Andrea Solís',
		propiedad: 'D-401',
		fecha: null,
		estado: 'Inactivo',
		codigo: 'QR-004',
	},
];

const multasEjemplo = [
	{
		id: 1,
		propiedad: 'A-101',
		residente: 'Carlos Méndez',
		infraccion: 'Ruido nocturno',
		llamados: 3,
		estado: 'PENDIENTE',
		fecha: '2025-07-01',
	},
	{
		id: 2,
		propiedad: 'B-205',
		residente: 'Laura Cifuentes',
		infraccion: 'Mascotas sin bozal',
		llamados: 3,
		estado: 'PAGADO',
		fecha: '2025-06-15',
	},
	{
		id: 3,
		propiedad: 'C-310',
		residente: 'Roberto Lima',
		infraccion: 'Basura fuera de hora',
		llamados: 6,
		estado: 'PENDIENTE',
		fecha: '2025-07-08',
	},
];

const notificacionesEjemplo = [
	{
		id: 1,
		tipo: 'alerta',
		titulo: 'Multa automática',
		desc: 'Propiedad A-101 excedió límite de llamados.',
		tiempo: 'Hace 2 min',
		moduloDestino: 'Infracciones y Multas',
	},
	{
		id: 2,
		tipo: 'info',
		titulo: 'Visita registrada',
		desc: 'QR-001 escaneado en garita principal.',
		tiempo: 'Hace 15 min',
		moduloDestino: 'Pases de Visita (QR)',
	},
	{
		id: 3,
		tipo: 'exito',
		titulo: 'Pago procesado',
		desc: 'Cuota de mantenimiento C-310 liquidada.',
		tiempo: 'Hace 1 hora',
		moduloDestino: 'Control de Cuotas',
	},
	{
		id: 4,
		tipo: 'info',
		titulo: 'Propiedad registrada',
		desc: 'Se ha creado la propiedad E-501.',
		tiempo: 'Ayer',
		moduloDestino: 'Gestión de Propiedades',
	},
];

/* ==========================================================================
   2. CONFIGURACIÓN DEL MENÚ Y ROLES
========================================================================== */

const GRUPOS = [
	{
		titulo: 'Residencial & Accesos',
		IconoGrupo: Home,
		modulos: [
			{ id: 'Gestión de Propiedades', Icono: Building, propio: true, roles: ['Administrador'] },
			{
				id: 'Directorio Residentes',
				Icono: Users,
				propio: false,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Control Vehicular',
				Icono: Car,
				propio: true,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
			{
				id: 'Pases de Visita (QR)',
				Icono: QrCode,
				propio: true,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
		],
	},
	{
		titulo: 'Seguridad & Garita',
		IconoGrupo: ShieldAlert,
		modulos: [
			{
				id: 'Punto de Ingreso',
				Icono: ShieldCheck,
				propio: false,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Bitácora de Seguridad',
				Icono: BookOpen,
				propio: false,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Inventario Parqueos',
				Icono: ParkingCircle,
				propio: false,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Asignación de Espacios',
				Icono: ArrowLeftRight,
				propio: false,
				roles: ['Administrador'],
			},
		],
	},
	{
		titulo: 'Finanzas & Disciplina',
		IconoGrupo: Wallet,
		modulos: [
			{
				id: 'Control de Cuotas',
				Icono: CreditCard,
				propio: false,
				roles: ['Administrador', 'Residente'],
			},
			{ id: 'Historial Financiero', Icono: Zap, propio: false, roles: ['Administrador'] },
			{
				id: 'Llamados de Atención',
				Icono: PhoneCall,
				propio: false,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Infracciones y Multas',
				Icono: AlertTriangle,
				propio: true,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
		],
	},
	{
		titulo: 'Operaciones & Soporte',
		IconoGrupo: Briefcase,
		modulos: [
			{ id: 'Mantenimiento de Áreas', Icono: Trees, propio: false, roles: ['Administrador'] },
			{
				id: 'Reservas de Áreas',
				Icono: CalendarDays,
				propio: false,
				roles: ['Administrador', 'Residente'],
			},
			{
				id: 'Mesa de Ayuda',
				Icono: Ticket,
				propio: false,
				roles: ['Administrador', 'Residente'],
			},
			{ id: 'Catálogos del Sistema', Icono: Layers, propio: false, roles: ['Administrador'] },
		],
	},
];

/* ==========================================================================
   3. HELPERS Y UTILIDADES
========================================================================== */

const limpiarBusqueda = (str) =>
	str ? str.toString().replace(/[-\s]/g, '').toLowerCase() : '';

// Mapeo visual para los colores de los vehículos en la tabla
function colorVehiculo(color) {
	const mapa = {
		Rojo: { bg: '#ef4444', text: '#fff', border: 'transparent' },
		Azul: { bg: '#3b82f6', text: '#fff', border: 'transparent' },
		Gris: { bg: '#6b7280', text: '#fff', border: 'transparent' },
		Verde: { bg: '#22c55e', text: '#fff', border: 'transparent' },
		Negro: { bg: '#18181b', text: '#fff', border: '#52525b' },
		Amarillo: { bg: '#eab308', text: '#000', border: 'transparent' },
		Naranja: { bg: '#f97316', text: '#fff', border: 'transparent' },
		Blanco: { bg: '#ffffff', text: '#000', border: '#27272a' },
	};
	return mapa[color] ?? { bg: '#3f3f46', text: '#d4d4d8', border: 'transparent' };
}

/* ==========================================================================
   4. COMPONENTES UI COMPARTIDOS (Botones, Modales, Inputs, Tablas)
========================================================================== */

function Etiqueta({ texto, variante = 'default' }) {
	const estilos = {
		activo: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
		pendiente: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
		inactivo: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
		utilizado: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
		pagado: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
		expirado: 'bg-red-500/10 text-red-400 border border-red-500/20',
		normal: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
		servicio: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
		default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
	};
	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${estilos[variante] ?? estilos.default}`}
		>
			{texto}
		</span>
	);
}

function TarjetaMetrica({ etiqueta, valor, Icono, fondo, textoIcono }) {
	return (
		<div className="p-5 border bg-fondo border-borde rounded-xl shadow-sm hover:border-zinc-700 transition-colors">
			<div className="flex items-center justify-between mb-3">
				<span className="text-xs font-medium text-secundario">{etiqueta}</span>
				<div
					className={`flex items-center justify-center w-8 h-8 rounded-lg ${fondo ?? 'bg-zinc-800'}`}
				>
					{textoIcono ? (
						<span className="text-sm font-bold text-primario">{textoIcono}</span>
					) : (
						<Icono className="w-4 h-4 text-primario" />
					)}
				</div>
			</div>
			<p className="text-2xl font-bold font-title text-primario">{valor}</p>
		</div>
	);
}

function Modal({ titulo, alCerrar, children }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="w-full max-w-lg mx-4 border shadow-2xl bg-tarjeta border-borde rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
				<div className="flex items-center justify-between p-6 border-b border-borde bg-fondo">
					<h2 className="text-sm font-semibold font-title text-primario">{titulo}</h2>
					<button onClick={alCerrar} className="p-1 rounded-lg transition-colors hover:bg-zinc-800">
						<X className="w-4 h-4 text-secundario" />
					</button>
				</div>
				<div className="p-6 bg-tarjeta">{children}</div>
			</div>
		</div>
	);
}

function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="w-full max-w-sm mx-4 bg-tarjeta border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(239,68,68,0.25)] animate-in zoom-in-95 duration-200">
				<div className="p-6 text-center">
					<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
						<AlertTriangle className="w-8 h-8 text-red-500" />
					</div>
					<h2 className="text-lg font-bold text-primario mb-2">{titulo}</h2>
					<p className="text-sm text-zinc-400 mb-8">{mensaje}</p>
					<div className="flex gap-3">
						<button
							onClick={onCancelar}
							className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-borde text-zinc-300 hover:bg-zinc-800 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={onConfirmar}
							className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
						>
							Sí, eliminar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function Campo({ etiqueta, children }) {
	return (
		<div className="space-y-1.5">
			<label className="text-[11px] font-medium text-secundario uppercase tracking-wide">
				{etiqueta}
			</label>
			{children}
		</div>
	);
}

function Entrada(props) {
	return (
		<input
			className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
			{...props}
		/>
	);
}

function Selector({ children, ...props }) {
	return (
		<select
			className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none focus:border-zinc-500 transition-colors"
			{...props}
		>
			{children}
		</select>
	);
}

function BuscadorCasa({ valor, alCambiar }) {
	return (
		<div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-tarjeta border-borde w-64 focus-within:border-zinc-500 transition-colors shadow-sm">
			<Search className="w-3.5 h-3.5 text-secundario flex-shrink-0" />
			<input
				value={valor}
				onChange={(e) => alCambiar(e.target.value)}
				placeholder="Filtrar..."
				className="w-full text-sm bg-transparent border-none outline-none text-primario placeholder:text-zinc-600"
			/>
			{valor && (
				<button
					onClick={() => alCambiar('')}
					className="text-zinc-600 hover:text-zinc-400 transition-colors"
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</div>
	);
}

function BtnPrimario({ children, onClick }) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors shadow-sm"
		>
			{children}
		</button>
	);
}

function CabeceraTabla({ columnas }) {
	return (
		<thead>
			<tr className="border-b border-borde bg-fondo/50">
				{columnas.map((col) => (
					<th
						key={col}
						className="px-4 py-3 text-left text-[11px] font-bold text-secundario tracking-wide uppercase"
					>
						{col}
					</th>
				))}
			</tr>
		</thead>
	);
}

function Fila({ indice, seleccionada, onClick, children }) {
	return (
		<tr
			onClick={onClick}
			className={`border-b border-borde/50 cursor-pointer transition-colors select-none fila-tabla ${seleccionada ? 'fila-seleccionada border-l-2 border-l-primario' : 'fila-normal'}`}
		>
			{children}
		</tr>
	);
}

function Celda({ children, mono }) {
	return (
		<td className={`px-4 py-3 text-sm font-bold text-primario ${mono ? 'font-mono' : ''}`}>
			{children}
		</td>
	);
}

function PieTabla({ mostrados, total, unidad }) {
	return (
		<div className="px-4 py-3 text-[11px] text-secundario border-t border-borde bg-fondo/50">
			Mostrando {mostrados} de {total} {unidad}
		</div>
	);
}

function BtnAccion({ onClick, Icono, titulo, colorHover = 'hover:text-primario' }) {
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			title={titulo}
			className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-secundario ${colorHover}`}
		>
			<Icono className="w-3.5 h-3.5" />
		</button>
	);
}

function BotonesModal({
	alCancelar,
	alGuardar,
	textoGuardar = 'Guardar',
	IconoGuardar = Save,
}) {
	return (
		<div className="flex gap-3 pt-2">
			<button
				type="button"
				onClick={alCancelar}
				className="flex-1 px-4 py-2 text-sm border rounded-lg border-borde text-secundario hover:text-primario transition-colors"
			>
				Cancelar
			</button>
			<button
				type="submit"
				onClick={alGuardar}
				className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
			>
				<IconoGuardar className="w-3.5 h-3.5" /> {textoGuardar}
			</button>
		</div>
	);
}

function ModuloPendiente({ nombre, Icono }) {
	return (
		<div className="flex flex-col items-center justify-center h-72 rounded-2xl border bg-zinc-900/40 border-borde gap-4 animate-in fade-in duration-300">
			<div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-borde bg-fondo shadow-sm">
				<Icono className="w-6 h-6 text-zinc-600" />
			</div>
			<div className="text-center space-y-1">
				<p className="text-sm font-semibold font-title text-zinc-400">{nombre}</p>
				<p className="text-xs text-zinc-600">Módulo en desarrollo por otro equipo.</p>
			</div>
		</div>
	);
}

/* ==========================================================================
   5. ASSETS Y ANIMACIONES (Búho Login y Loader)
========================================================================== */

function BuhoAnimado({ tapado, pupilaX, pupilaY }) {
	const [parpadeo, setParpadeo] = useState(false);
	const [ala, setAla] = useState(false);
	const aleandoRef = useRef(false);
	const alaIntervalRef = useRef(null);

	// Controlador de parpadeo aleatorio
	useEffect(() => {
		if (tapado) return;
		let timeout;
		const programar = () => {
			const delay = 2000 + Math.random() * 3000;
			timeout = setTimeout(() => {
				setParpadeo(true);
				setTimeout(() => setParpadeo(false), 140);
				programar();
			}, delay);
		};
		programar();
		return () => clearTimeout(timeout);
	}, [tapado]);

	// Controlador de movimiento de alas cuando el usuario escribe
	useEffect(() => {
		if (pupilaX !== 0 || pupilaY !== 0) {
			if (!aleandoRef.current) {
				aleandoRef.current = true;
				alaIntervalRef.current = setInterval(() => setAla((p) => !p), 280);
			}
		} else {
			if (aleandoRef.current) {
				aleandoRef.current = false;
				clearInterval(alaIntervalRef.current);
				setAla(false);
			}
		}
		return () => {};
	}, [pupilaX, pupilaY]);

	useEffect(() => () => clearInterval(alaIntervalRef.current), []);

	const parpado = parpadeo ? 9.5 : 0;
	const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
	const px = clamp(pupilaX, -2.6, 2.6);
	const py = clamp(pupilaY, -2.0, 2.0);

	const ojoIzqX = 50 + px;
	const ojoIzqY = 49 + py;
	const ojoDerX = 70 + px;
	const ojoDerY = 49 + py;

	return (
		<svg
			viewBox="0 0 120 130"
			width="130"
			height="130"
			xmlns="http://www.w3.org/2000/svg"
			style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))', overflow: 'visible' }}
		>
			<ellipse
				cx="28"
				cy="82"
				rx="14"
				ry="28"
				fill="#1c1c1f"
				stroke="#3f3f46"
				strokeWidth="1"
				transform={`rotate(${ala ? -14 : -8} 28 82)`}
				style={{ transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)' }}
			/>
			<ellipse
				cx="92"
				cy="82"
				rx="14"
				ry="28"
				fill="#1c1c1f"
				stroke="#3f3f46"
				strokeWidth="1"
				transform={`rotate(${ala ? 14 : 8} 92 82)`}
				style={{ transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)' }}
			/>
			<ellipse
				cx="60"
				cy="82"
				rx="32"
				ry="36"
				fill="#2a2a2e"
				stroke="#3f3f46"
				strokeWidth="1.5"
			/>
			<ellipse cx="60" cy="89" rx="18" ry="22" fill="#3f3f46" />
			<ellipse cx="60" cy="93" rx="12" ry="16" fill="#52525b" />
			<circle cx="60" cy="50" r="27" fill="#2a2a2e" stroke="#3f3f46" strokeWidth="1.5" />
			<polygon points="42,30 36,14 48,28" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1" />
			<polygon points="78,30 84,14 72,28" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1" />
			<g
				style={{
					transition: 'opacity 0.38s cubic-bezier(0.34,1.56,0.64,1)',
					opacity: tapado ? 0 : 1,
				}}
			>
				<ellipse cx="60" cy="52" rx="21" ry="19" fill="#3f3f46" />
				<circle cx="50" cy="49" r="9.5" fill="#09090b" stroke="#52525b" strokeWidth="1.5" />
				<circle cx="50" cy="49" r="6.5" fill="#facc15" />
				<circle
					cx={ojoIzqX}
					cy={ojoIzqY}
					r="3.8"
					fill="#09090b"
					style={{ transition: 'cx 0.18s ease-out, cy 0.18s ease-out' }}
				/>
				<circle
					cx={ojoIzqX + 1.4}
					cy={ojoIzqY - 1.4}
					r="1.3"
					fill="white"
					style={{ transition: 'cx 0.18s ease-out, cy 0.18s ease-out' }}
				/>
				<ellipse
					cx="50"
					cy={49 - 9.5 + parpado / 2}
					rx="9.5"
					ry={parpado / 2 + 0.5}
					fill="#2a2a2e"
					style={{ transition: 'ry 0.1s ease, cy 0.1s ease' }}
				/>
				<circle cx="70" cy="49" r="9.5" fill="#09090b" stroke="#52525b" strokeWidth="1.5" />
				<circle cx="70" cy="49" r="6.5" fill="#facc15" />
				<circle
					cx={ojoDerX}
					cy={ojoDerY}
					r="3.8"
					fill="#09090b"
					style={{ transition: 'cx 0.18s ease-out, cy 0.18s ease-out' }}
				/>
				<circle
					cx={ojoDerX + 1.4}
					cy={ojoDerY - 1.4}
					r="1.3"
					fill="white"
					style={{ transition: 'cx 0.18s ease-out, cy 0.18s ease-out' }}
				/>
				<ellipse
					cx="70"
					cy={49 - 9.5 + parpado / 2}
					rx="9.5"
					ry={parpado / 2 + 0.5}
					fill="#2a2a2e"
					style={{ transition: 'ry 0.1s ease, cy 0.1s ease' }}
				/>
				<polygon points="60,57 54,63 66,63" fill="#d97706" />
			</g>
			<g
				style={{
					transition: 'opacity 0.38s cubic-bezier(0.34,1.56,0.64,1)',
					opacity: tapado ? 1 : 0,
				}}
			>
				<ellipse cx="60" cy="52" rx="21" ry="19" fill="#3f3f46" />
				<polygon points="60,60 54,67 66,67" fill="#d97706" />
				<ellipse
					cx="46"
					cy="48"
					rx="15"
					ry="11"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="1.2"
					transform="rotate(-18 46 48)"
				/>
				<ellipse cx="44" cy="49" rx="11" ry="7.5" fill="#27272a" transform="rotate(-18 44 49)" />
				<ellipse
					cx="34"
					cy="42"
					rx="4.5"
					ry="2.5"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="0.8"
					transform="rotate(-35 34 42)"
				/>
				<ellipse
					cx="31"
					cy="47"
					rx="4.5"
					ry="2.5"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="0.8"
					transform="rotate(-18 31 47)"
				/>
				<ellipse
					cx="31"
					cy="53"
					rx="4.5"
					ry="2.5"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="0.8"
					transform="rotate(5 31 53)"
				/>
				<ellipse
					cx="74"
					cy="48"
					rx="15"
					ry="11"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="1.2"
					transform="rotate(18 74 48)"
				/>
				<ellipse cx="76" cy="49" rx="11" ry="7.5" fill="#27272a" transform="rotate(18 76 49)" />
				<ellipse
					cx="86"
					cy="42"
					rx="4.5"
					ry="2.5"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="0.8"
					transform="rotate(35 86 42)"
				/>
				<ellipse
					cx="89"
					cy="47"
					rx="4.5"
					ry="2.5"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="0.8"
					transform="rotate(18 89 47)"
				/>
				<ellipse
					cx="89"
					cy="53"
					rx="4.5"
					ry="2.5"
					fill="#1c1c1f"
					stroke="#52525b"
					strokeWidth="0.8"
					transform="rotate(-5 89 53)"
				/>
			</g>
			<line
				x1="51"
				y1="114"
				x2="47"
				y2="121"
				stroke="#d97706"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="47"
				y1="121"
				x2="40"
				y2="123"
				stroke="#d97706"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<line
				x1="47"
				y1="121"
				x2="46"
				y2="125"
				stroke="#d97706"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<line
				x1="69"
				y1="114"
				x2="73"
				y2="121"
				stroke="#d97706"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="73"
				y1="121"
				x2="80"
				y2="123"
				stroke="#d97706"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<line
				x1="73"
				y1="121"
				x2="74"
				y2="125"
				stroke="#d97706"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function AnimacionCarga({ mensaje }) {
	const [frame, setFrame] = useState(0);
	const [puntos, setPuntos] = useState(0);

	useEffect(() => {
		const iv = setInterval(() => setFrame((f) => f + 1), 400);
		return () => clearInterval(iv);
	}, []);

	useEffect(() => {
		const iv = setInterval(() => setPuntos((p) => (p + 1) % 4), 500);
		return () => clearInterval(iv);
	}, []);

	const ventanas = Array.from({ length: 30 }, (_, i) => ({
		x: 14 + (i % 6) * 16,
		y: 28 + Math.floor(i / 6) * 14,
		encendida: (i * 7 + frame * 3) % 11 > 3,
	}));

	const ventanasTorre = Array.from({ length: 15 }, (_, i) => ({
		x: 52 + (i % 3) * 12,
		y: 10 + Math.floor(i / 3) * 14,
		encendida: (i * 5 + frame * 2) % 9 > 3,
	}));

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				background: '#09090b',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage:
						'linear-gradient(rgba(63,63,70,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.12) 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: '30%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
					width: '400px',
					height: '300px',
					background: 'radial-gradient(ellipse, rgba(250,250,250,0.04) 0%, transparent 70%)',
					filter: 'blur(60px)',
					pointerEvents: 'none',
				}}
			/>
			<div style={{ position: 'relative', zIndex: 10, marginBottom: '32px' }}>
				<svg viewBox="0 0 160 130" width="200" height="162" xmlns="http://www.w3.org/2000/svg">
					<rect
						x="8"
						y="22"
						width="60"
						height="98"
						rx="3"
						fill="#18181b"
						stroke="#3f3f46"
						strokeWidth="1.5"
					/>
					<rect
						x="6"
						y="18"
						width="64"
						height="6"
						rx="2"
						fill="#27272a"
						stroke="#3f3f46"
						strokeWidth="1"
					/>
					{ventanas.map((v, i) => (
						<rect
							key={i}
							x={v.x}
							y={v.y}
							width="9"
							height="7"
							rx="1.5"
							fill={v.encendida ? '#fef08a' : '#27272a'}
							style={{
								transition: 'fill 0.4s ease',
								filter: v.encendida ? 'drop-shadow(0 0 3px #fde047)' : 'none',
							}}
						/>
					))}
					<rect
						x="46"
						y="6"
						width="34"
						height="114"
						rx="3"
						fill="#1c1c1f"
						stroke="#3f3f46"
						strokeWidth="1.5"
					/>
					<rect
						x="44"
						y="2"
						width="38"
						height="6"
						rx="2"
						fill="#27272a"
						stroke="#3f3f46"
						strokeWidth="1"
					/>
					<line x1="63" y1="2" x2="63" y2="-10" stroke="#52525b" strokeWidth="1.5" />
					<circle
						cx="63"
						cy="-11"
						r="2"
						fill={frame % 3 === 0 ? '#ef4444' : '#7f1d1d'}
						style={{ transition: 'fill 0.4s' }}
					/>
					{ventanasTorre.map((v, i) => (
						<rect
							key={i}
							x={v.x}
							y={v.y}
							width="8"
							height="6"
							rx="1.5"
							fill={v.encendida ? '#bfdbfe' : '#27272a'}
							style={{
								transition: 'fill 0.35s ease',
								filter: v.encendida ? 'drop-shadow(0 0 2px #93c5fd)' : 'none',
							}}
						/>
					))}
					<rect
						x="92"
						y="34"
						width="52"
						height="86"
						rx="3"
						fill="#18181b"
						stroke="#3f3f46"
						strokeWidth="1.5"
					/>
					<rect
						x="90"
						y="30"
						width="56"
						height="6"
						rx="2"
						fill="#27272a"
						stroke="#3f3f46"
						strokeWidth="1"
					/>
					{Array.from({ length: 20 }, (_, i) => ({
						x: 98 + (i % 4) * 12,
						y: 40 + Math.floor(i / 4) * 14,
						enc: (i * 11 + frame * 4) % 13 > 5,
					})).map((v, i) => (
						<rect
							key={i}
							x={v.x}
							y={v.y}
							width="7"
							height="6"
							rx="1.5"
							fill={v.enc ? '#bbf7d0' : '#27272a'}
							style={{
								transition: 'fill 0.45s ease',
								filter: v.enc ? 'drop-shadow(0 0 2px #86efac)' : 'none',
							}}
						/>
					))}
					<rect x="0" y="118" width="160" height="4" rx="2" fill="#27272a" />
					<rect
						x="55"
						y="118"
						width="16"
						height="12"
						rx="1"
						fill="#1c1c1f"
						stroke="#3f3f46"
						strokeWidth="0.5"
					/>
					<circle cx="142" cy="16" r="8" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
					<circle cx="145" cy="14" r="6" fill="#09090b" />
					{[
						[20, 8],
						[30, 4],
						[8, 16],
						[150, 30],
						[132, 8],
					].map(([sx, sy], i) => (
						<circle
							key={i}
							cx={sx}
							cy={sy}
							r="1"
							fill={(i + frame) % 3 === 0 ? '#fafafa' : '#52525b'}
							style={{ transition: 'fill 0.6s' }}
						/>
					))}
				</svg>
			</div>
			<div
				style={{
					width: '220px',
					height: '3px',
					background: '#27272a',
					borderRadius: '999px',
					overflow: 'hidden',
					marginBottom: '20px',
					position: 'relative',
					zIndex: 10,
				}}
			>
				<div
					style={{
						height: '100%',
						borderRadius: '999px',
						background: 'linear-gradient(90deg, #fafafa, #71717a)',
						animation: 'barraProgreso 1.5s ease-in-out infinite',
					}}
				/>
			</div>
			<p
				style={{
					fontSize: '15px',
					fontWeight: 700,
					color: '#fafafa',
					letterSpacing: '-0.3px',
					position: 'relative',
					zIndex: 10,
					marginBottom: '6px',
				}}
			>
				{mensaje}
				{''.padEnd(puntos, '.')}
			</p>
			<p style={{ fontSize: '12px', color: '#52525b', position: 'relative', zIndex: 10 }}>
				Condominio PuraFé
			</p>
		</div>
	);
}

/* ==========================================================================
   6. VISTAS INDEPENDIENTES (Login, Garita, Bienvenida)
========================================================================== */

function VistaLogin({ onLogin, temaOscuro, setTemaOscuro }) {
	const [mostrarPassword, setMostrarPassword] = useState(false);
	const [passwordVal, setPasswordVal] = useState('');
	const [emailVal, setEmailVal] = useState('');
	const [focusEmail, setFocusEmail] = useState(false);
	const [focusPassword, setFocusPassword] = useState(false);
	const [shake, setShake] = useState(false);
	const inputEmailRef = useRef(null);

	const [pupilaX, setPupilaX] = useState(0);
	const [pupilaY, setPupilaY] = useState(0);

	const tapado = focusPassword && !mostrarPassword;

	const actualizarPupila = (val, selStart) => {
		if (!focusEmail) return;
		const len = val.length;
		if (len === 0) {
			setPupilaX(-2.0);
			setPupilaY(-0.5);
			return;
		}
		const ratio = len > 0 ? selStart / Math.max(len, 1) : 0;
		const nx = -2.5 + ratio * 5.0;
		const ny = -0.8 + ratio * 0.6;
		setPupilaX(nx);
		setPupilaY(ny);
	};

	const handleEmailChange = (e) => {
		const val = e.target.value;
		const sel = e.target.selectionStart ?? val.length;
		setEmailVal(val);
		actualizarPupila(val, sel);
	};

	const handleEmailKeyUp = (e) => {
		const el = e.target;
		actualizarPupila(el.value, el.selectionStart ?? el.value.length);
	};

	useEffect(() => {
		if (focusEmail) {
			const val = inputEmailRef.current?.value ?? '';
			const sel = inputEmailRef.current?.selectionStart ?? 0;
			actualizarPupila(val, sel);
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

	const bodyTransform = tapado
		? 'scale(0.93) translateY(5px)'
		: focusEmail
			? 'scale(1.03) translateY(-3px) rotate(-2.5deg)'
			: focusPassword
				? 'scale(1.03) translateY(-3px) rotate(2.5deg)'
				: 'scale(1) translateY(0px)';

	return (
		<div
			className="flex w-full h-full relative overflow-hidden"
			style={{ background: temaOscuro ? '#09090b' : '#f1f5f9' }}
		>
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
				</button>
			</div>

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
									background: 'linear-gradient(135deg, #ffffff 0%, #71717a 100%)',
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
						<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
							<div
								style={{
									transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
									transform: bodyTransform,
								}}
							>
								<BuhoAnimado tapado={tapado} pupilaX={pupilaX} pupilaY={pupilaY} />
							</div>
						</div>

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
								Bienvenido de vuelta
							</h2>
							<p style={{ fontSize: '13px', color: '#71717a', fontWeight: 500 }}>
								Accede al panel administrativo
							</p>
						</div>

						<form
							onSubmit={handleSubmit}
							style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
						>
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
										placeholder="Ej: admin o admin@test.com"
										style={{
											width: '100%',
											paddingLeft: '42px',
											paddingRight: '16px',
											paddingTop: '12px',
											paddingBottom: '12px',
											fontSize: '14px',
											background: focusEmail
												? temaOscuro
													? 'rgba(39,39,42,0.7)'
													: 'rgba(241,245,249,0.9)'
												: temaOscuro
													? 'rgba(9,9,11,0.6)'
													: 'rgba(248,250,252,0.8)',
											border: `1px solid ${focusEmail ? (temaOscuro ? 'rgba(113,113,122,0.8)' : 'rgba(100,116,139,0.6)') : temaOscuro ? 'rgba(63,63,70,0.8)' : 'rgba(203,213,225,0.8)'}`,
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
											background: focusPassword
												? temaOscuro
													? 'rgba(39,39,42,0.7)'
													: 'rgba(241,245,249,0.9)'
												: temaOscuro
													? 'rgba(9,9,11,0.6)'
													: 'rgba(248,250,252,0.8)',
											border: `1px solid ${focusPassword ? (temaOscuro ? 'rgba(113,113,122,0.8)' : 'rgba(100,116,139,0.6)') : temaOscuro ? 'rgba(63,63,70,0.8)' : 'rgba(203,213,225,0.8)'}`,
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
								<Lock style={{ width: '15px', height: '15px' }} /> Iniciar Sesión
							</button>
						</form>
					</div>

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
							<span style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>Condominio</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function VistaBienvenida({ onContinuar }) {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in zoom-in-95 fade-in duration-500">
			<div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-2xl">
				<Building className="w-12 h-12 text-emerald-500" />
			</div>
			<h1 className="text-4xl font-bold text-primario mb-3 text-center font-title">
				¡Bienvenido, Administrador!
			</h1>
			<p className="text-lg text-secundario text-center mb-10 max-w-md leading-relaxed">
				Has ingresado al panel principal de gestión del <strong>Condominio PuraFé</strong>.
			</p>
			<button
				onClick={onContinuar}
				className="px-8 py-3.5 text-sm font-bold rounded-xl bg-primario text-fondo hover:opacity-90 transition-opacity shadow-lg shadow-primario/20 flex items-center gap-2"
			>
				Entrar al Dashboard <ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
}

function VistaGarita() {
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

/* ==========================================================================
   7. MÓDULOS PRINCIPALES (CRUDs)
========================================================================== */

function ModuloPropiedades({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(propiedadesEjemplo);
	const [busqueda, setBusqueda] = useState('');

	// Controles del modal y formulario
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

	// Reglas de negocio para las cuotas
	const cuotaPorCategoria = { Básica: 500, Intermedia: 800, Completa: 1200 };
	const parqueosPorCategoria = { Básica: 1, Intermedia: 2, Completa: 3 };
	const colorCategoria = {
		Básica: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
		Intermedia: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
		Completa: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
	};

	// Lógica de filtrado en tiempo real
	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(p) =>
					limpiarBusqueda(p.numero).includes(termino) ||
					limpiarBusqueda(p.propietario).includes(termino) ||
					(p.inquilino && limpiarBusqueda(p.inquilino).includes(termino)),
			)
		: datos;

	// Crear o actualizar propiedad
	function guardarNuevo(e) {
		if (e) e.preventDefault();
		if (!form.numero.trim() || !form.propietario.trim()) return;

		if (editandoId) {
			setDatos(
				datos.map((d) =>
					d.id === editandoId
						? {
								...d,
								numero: form.numero.trim().toUpperCase(),
								categoria: form.categoria,
								cuota: cuotaPorCategoria[form.categoria],
								parqueos: parqueosPorCategoria[form.categoria],
								propietario: form.propietario,
								inquilino: form.inquilino.trim() ? form.inquilino : null,
							}
						: d,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					numero: form.numero.trim().toUpperCase(),
					categoria: form.categoria,
					cuota: cuotaPorCategoria[form.categoria],
					parqueos: parqueosPorCategoria[form.categoria],
					propietario: form.propietario,
					inquilino: form.inquilino.trim() ? form.inquilino : null,
					estado: 'Activo',
				},
			]);
		}
		setModal(null);
		setEditandoId(null);
	}

	function abrirEditar(p) {
		setForm({
			numero: p.numero,
			categoria: p.categoria,
			propietario: p.propietario,
			inquilino: p.inquilino || '',
		});
		setEditandoId(p.id);
		setModal('nuevo');
	}

	function toggleEstado(id) {
		setDatos(
			datos.map((p) =>
				p.id === id ? { ...p, estado: p.estado === 'Activo' ? 'Inactivo' : 'Activo' } : p,
			),
		);
	}

	function confirmarEliminacion() {
		setDatos(datos.filter((p) => p.id !== aEliminar.id));
		setAEliminar(null);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			{/* Tarjetas Superiores */}
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Unidades"
					valor={datos.length}
					Icono={Building}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activas"
					valor={datos.filter((p) => p.estado === 'Activo').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Con Inquilino"
					valor={datos.filter((p) => p.inquilino).length}
					Icono={Users}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Cuota promedio"
					valor={`Q${Math.round(datos.reduce((s, p) => s + p.cuota, 0) / datos.length)}`}
					textoIcono="Q"
					fondo="bg-amber-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ numero: '', categoria: 'Básica', propietario: '', inquilino: '' });
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Registrar Propiedad
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['Número', 'Categoría', 'Cuota', 'Usuarios Registrados', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((p, i) => (
							<Fila
								key={p.id}
								indice={i}
								seleccionada={filaActiva === p.id}
								onClick={() => setFilaActiva(filaActiva === p.id ? null : p.id)}
							>
								<Celda mono>{p.numero}</Celda>
								<td className="px-4 py-3">
									<span
										className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${colorCategoria[p.categoria]}`}
									>
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
										<BtnAccion
											Icono={Eye}
											titulo="Ver detalle"
											onClick={() => {
												setSeleccion(p);
												setModal('detalle');
											}}
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(p)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Ban}
											titulo="Activar / Inactivar"
											onClick={() => toggleEstado(p.id)}
											colorHover="hover:text-amber-400"
										/>
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar propiedad"
											onClick={() => setAEliminar(p)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="propiedades" />
			</div>

			{/* Modal Crear / Editar */}
			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Propiedad' : 'Registrar Propiedad'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardarNuevo} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Número de propiedad">
								<Entrada
									value={form.numero}
									onChange={(e) => setForm({ ...form, numero: e.target.value })}
									placeholder="Ej: A-101"
									required
								/>
							</Campo>
							<Campo etiqueta="Categoría">
								<Selector
									value={form.categoria}
									onChange={(e) => setForm({ ...form, categoria: e.target.value })}
								>
									<option>Básica</option>
									<option>Intermedia</option>
									<option>Completa</option>
								</Selector>
							</Campo>
						</div>
						<Campo etiqueta="Nombre del Propietario (Obligatorio)">
							<Entrada
								value={form.propietario}
								onChange={(e) => setForm({ ...form, propietario: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>
						<Campo etiqueta="Nombre del Inquilino (Opcional)">
							<Entrada
								value={form.inquilino}
								onChange={(e) => setForm({ ...form, inquilino: e.target.value })}
								placeholder="Dejar en blanco si no hay"
							/>
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
						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{/* Modal Detalle */}
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
							<div
								key={k}
								className="flex justify-between py-3 border-b border-borde/50 last:border-0"
							>
								<span className="text-xs text-secundario">{k}</span>
								<span className="text-sm font-bold text-primario">{v}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{/* Alerta Eliminación */}
			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Propiedad?"
					mensaje={`Borrando la propiedad ${aEliminar.numero}. Esta acción no se puede deshacer.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminacion}
				/>
			)}
		</div>
	);
}

function ModuloVehiculos({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(vehiculosEjemplo);
	const [busqueda, setBusqueda] = useState('');

	const [modal, setModal] = useState(false);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);

	const [form, setForm] = useState({
		placa: '',
		marca: '',
		modelo: '',
		color: '',
		propiedad: '',
	});

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(v) =>
					limpiarBusqueda(v.propiedad).includes(termino) ||
					limpiarBusqueda(v.placa).includes(termino),
			)
		: datos;

	// Crear o actualizar vehículo
	function guardar(e) {
		if (e) e.preventDefault();
		if (!form.placa.trim() || !form.propiedad) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);
		const responsable = propObj?.inquilino || propObj?.propietario || '—';

		if (editandoId) {
			setDatos(
				datos.map((v) =>
					v.id === editandoId
						? {
								...v,
								placa: form.placa.trim().toUpperCase(),
								marca: form.marca,
								modelo: form.modelo,
								color: form.color,
								propiedad: form.propiedad,
								responsable: responsable,
							}
						: v,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					placa: form.placa.trim().toUpperCase(),
					marca: form.marca,
					modelo: form.modelo,
					color: form.color,
					propiedad: form.propiedad,
					responsable: responsable,
					estado: 'Activo',
				},
			]);
		}
		setModal(false);
		setEditandoId(null);
	}

	function abrirEditar(v) {
		setForm({
			placa: v.placa,
			marca: v.marca,
			modelo: v.modelo,
			color: v.color,
			propiedad: v.propiedad,
		});
		setEditandoId(v.id);
		setModal(true);
	}

	function confirmarEliminacion() {
		setDatos(datos.filter((v) => v.id !== aEliminar.id));
		setAEliminar(null);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Vehículos"
					valor={datos.length}
					Icono={Car}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={datos.filter((v) => v.estado === 'Activo').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={datos.filter((v) => v.estado !== 'Activo').length}
					Icono={Ban}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Marcas distintas"
					valor={new Set(datos.map((v) => v.marca)).size}
					Icono={Tag}
					fondo="bg-sky-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ placa: '', marca: '', modelo: '', color: '', propiedad: '' });
							setEditandoId(null);
							setModal(true);
						}}
					>
						<Plus className="w-4 h-4" /> Registrar vehículo
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Placa',
							'Vehículo',
							'Color',
							'Propiedad',
							'Responsable',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((v, i) => {
							const cv = colorVehiculo(v.color);
							return (
								<Fila
									key={v.id}
									indice={i}
									seleccionada={filaActiva === v.id}
									onClick={() => setFilaActiva(filaActiva === v.id ? null : v.id)}
								>
									<Celda mono>{v.placa}</Celda>
									<td className="px-4 py-3">
										<p className="text-sm font-bold text-primario">{v.marca}</p>
										<p className="text-xs font-semibold text-secundario">{v.modelo}</p>
									</td>
									<td className="px-4 py-3">
										<span
											className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-sm"
											style={{
												backgroundColor: cv.bg,
												color: cv.text,
												border: cv.border !== 'transparent' ? `1px solid ${cv.border}` : 'none',
											}}
										>
											{v.color}
										</span>
									</td>
									<Celda mono>{v.propiedad}</Celda>
									<Celda>{v.responsable}</Celda>
									<td className="px-4 py-3">
										<Etiqueta texto={v.estado} variante={v.estado.toLowerCase()} />
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<BtnAccion
												Icono={Pencil}
												titulo="Editar"
												onClick={() => abrirEditar(v)}
												colorHover="hover:text-blue-400"
											/>
											<BtnAccion
												Icono={RefreshCw}
												titulo="Activar / Inactivar"
												onClick={() =>
													setDatos(
														datos.map((d) =>
															d.id === v.id
																? { ...d, estado: d.estado === 'Activo' ? 'Inactivo' : 'Activo' }
																: d,
														),
													)
												}
												colorHover="hover:text-amber-400"
											/>
											<BtnAccion
												Icono={Trash2}
												titulo="Eliminar vehículo"
												onClick={() => setAEliminar(v)}
												colorHover="hover:text-red-500"
											/>
										</div>
									</td>
								</Fila>
							);
						})}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="vehículos" />
			</div>

			{modal && (
				<Modal
					titulo={editandoId ? 'Editar vehículo' : 'Registrar vehículo'}
					alCerrar={() => {
						setModal(false);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardar} className="space-y-4">
						<Campo etiqueta="Placa">
							<Entrada
								value={form.placa}
								onChange={(e) => setForm({ ...form, placa: e.target.value })}
								placeholder="P-123ABC"
								required
							/>
						</Campo>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Marca">
								<Entrada
									value={form.marca}
									onChange={(e) => setForm({ ...form, marca: e.target.value })}
									placeholder="Toyota"
									required
								/>
							</Campo>
							<Campo etiqueta="Modelo">
								<Entrada
									value={form.modelo}
									onChange={(e) => setForm({ ...form, modelo: e.target.value })}
									placeholder="Corolla"
									required
								/>
							</Campo>
						</div>
						<Campo etiqueta="Color">
							<Selector
								value={form.color}
								onChange={(e) => setForm({ ...form, color: e.target.value })}
								required
							>
								<option value="">Seleccionar color...</option>
								{['Blanco', 'Negro', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja'].map(
									(c) => (
										<option key={c}>{c}</option>
									),
								)}
							</Selector>
						</Campo>
						<Campo etiqueta="Propiedad Autorizada">
							<Selector
								value={form.propiedad}
								onChange={(e) => setForm({ ...form, propiedad: e.target.value })}
								required
							>
								<option value="">Seleccionar propiedad...</option>
								{propiedadesEjemplo
									.filter((p) => p.estado === 'Activo')
									.map((p) => (
										<option key={p.id} value={p.numero}>
											{p.numero} — {p.inquilino || p.propietario}
										</option>
									))}
							</Selector>
						</Campo>
						<BotonesModal
							alCancelar={() => {
								setModal(false);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Vehículo?"
					mensaje={`Estás a punto de borrar el vehículo con placa ${aEliminar.placa}. Ya no tendrá autorización para ingresar al condominio.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminacion}
				/>
			)}
		</div>
	);
}

function ModuloInvitaciones({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(invitacionesEjemplo);
	const [busqueda, setBusqueda] = useState('');

	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);

	const [form, setForm] = useState({ visitante: '', tipo: 'Normal', propiedad: '' });

	const estadoVariante = {
		Activo: 'activo',
		Pendiente: 'pendiente',
		Expirado: 'expirado',
		Inactivo: 'inactivo',
		Utilizado: 'utilizado',
	};

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(inv) =>
					limpiarBusqueda(inv.propiedad).includes(termino) ||
					limpiarBusqueda(inv.visitante).includes(termino),
			)
		: datos;

	// Proceso que revisa automáticamente si una invitación de tipo "Normal" expiró al finalizar el día
	useEffect(() => {
		const checarExpiracion = () => {
			const hoy = new Date().toISOString().split('T')[0];
			setDatos((prev) => {
				let hayCambios = false;
				const actualizados = prev.map((inv) => {
					if (
						inv.tipo === 'Normal' &&
						(inv.estado === 'Activo' || inv.estado === 'Pendiente') &&
						inv.fecha &&
						inv.fecha < hoy
					) {
						hayCambios = true;
						return { ...inv, estado: 'Expirado' };
					}
					return inv;
				});
				return hayCambios ? actualizados : prev;
			});
		};
		checarExpiracion();
		const intervalo = setInterval(checarExpiracion, 60000);
		return () => clearInterval(intervalo);
	}, []);

	// Crear o actualizar pase de visita
	function crear(e) {
		if (e) e.preventDefault();
		if (!form.visitante.trim() || !form.propiedad) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);
		const residente = propObj?.inquilino || propObj?.propietario || '—';

		if (editandoId) {
			setDatos(
				datos.map((inv) =>
					inv.id === editandoId
						? {
								...inv,
								visitante: form.visitante.trim(),
								tipo: form.tipo,
								residente: residente,
								propiedad: form.propiedad,
								fecha: form.tipo === 'Normal' ? new Date().toISOString().split('T')[0] : null,
							}
						: inv,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					visitante: form.visitante.trim(),
					tipo: form.tipo,
					residente: residente,
					propiedad: form.propiedad,
					fecha: form.tipo === 'Normal' ? new Date().toISOString().split('T')[0] : null,
					estado: 'Pendiente',
					codigo: `QR-${Date.now()}`,
				},
			]);
		}
		setModal(null);
		setEditandoId(null);
	}

	function abrirEditar(inv) {
		setForm({ visitante: inv.visitante, tipo: inv.tipo, propiedad: inv.propiedad });
		setEditandoId(inv.id);
		setModal('nuevo');
	}

	function confirmarEliminacion() {
		setDatos(datos.filter((inv) => inv.id !== aEliminar.id));
		setAEliminar(null);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Visitas"
					valor={datos.length}
					Icono={QrCode}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Pases Pendientes"
					valor={datos.filter((i) => i.estado === 'Pendiente').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Expiradas"
					valor={datos.filter((i) => i.estado === 'Expirado').length}
					Icono={Clock}
					fondo="bg-amber-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Desactivadas / Usadas"
					valor={datos.filter((i) => i.estado === 'Inactivo' || i.estado === 'Utilizado').length}
					Icono={Ban}
					fondo="bg-red-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ visitante: '', tipo: 'Normal', propiedad: '' });
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Generar Pase QR
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Visitante',
							'Tipo',
							'Residente',
							'Propiedad',
							'Vencimiento',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((inv, i) => (
							<Fila
								key={inv.id}
								indice={i}
								seleccionada={filaActiva === inv.id}
								onClick={() => setFilaActiva(filaActiva === inv.id ? null : inv.id)}
							>
								<Celda>{inv.visitante}</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.tipo} variante={inv.tipo.toLowerCase()} />
								</td>
								<Celda>{inv.residente}</Celda>
								<Celda mono>{inv.propiedad}</Celda>
								<Celda>
									{inv.fecha ?? (
										<span className="italic font-normal text-zinc-600">Sin vencimiento</span>
									)}
								</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.estado} variante={estadoVariante[inv.estado]} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={QrCode}
											titulo="Ver código QR"
											onClick={() => {
												setSeleccion(inv);
												setModal('qr');
											}}
											colorHover="hover:text-sky-400"
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(inv)}
											colorHover="hover:text-blue-400"
										/>
										{(inv.estado === 'Pendiente' || inv.estado === 'Activo') && (
											<BtnAccion
												Icono={Ban}
												titulo="Invalidar QR"
												onClick={() =>
													setDatos(datos.map((d) => (d.id === inv.id ? { ...d, estado: 'Inactivo' } : d)))
												}
												colorHover="hover:text-amber-400"
											/>
										)}
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar registro"
											onClick={() => setAEliminar(inv)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="invitaciones" />
			</div>

			{/* Modal Crear / Editar */}
			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Pase de Visita' : 'Generar Pase de Visita'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={crear} className="space-y-4">
						<Campo etiqueta="Nombre del visitante">
							<Entrada
								value={form.visitante}
								onChange={(e) => setForm({ ...form, visitante: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>
						<Campo etiqueta="Tipo de invitación">
							<Selector
								value={form.tipo}
								onChange={(e) => setForm({ ...form, tipo: e.target.value })}
							>
								<option>Normal</option>
								<option>Servicio</option>
							</Selector>
						</Campo>
						<Campo etiqueta="Propiedad que autoriza">
							<Selector
								value={form.propiedad}
								onChange={(e) => setForm({ ...form, propiedad: e.target.value })}
								required
							>
								<option value="">Seleccionar propiedad...</option>
								{propiedadesEjemplo
									.filter((p) => p.estado === 'Activo')
									.map((p) => (
										<option key={p.id} value={p.numero}>
											{p.numero} — {p.inquilino || p.propietario}
										</option>
									))}
							</Selector>
						</Campo>

						{/* Información contextual según el tipo de pase */}
						{form.tipo === 'Normal' && (
							<div className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
								<Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-amber-400">
									<p className="font-bold mb-1">Pase Temporal</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>Expira automáticamente a las 23:59 del día de hoy.</li>
										<li>Código QR de un solo uso (se invalida tras escanear).</li>
									</ul>
								</div>
							</div>
						)}
						{form.tipo === 'Servicio' && (
							<div className="flex gap-2 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
								<CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-violet-400">
									<p className="font-bold mb-1">Pase Permanente</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>No tiene fecha de caducidad.</li>
										<li>Puede utilizarse múltiples veces hasta ser desactivado manualmente.</li>
									</ul>
								</div>
							</div>
						)}
						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Generar QR'}
							IconoGuardar={editandoId ? Save : QrCode}
						/>
					</form>
				</Modal>
			)}

			{/* Modal para visualizar el QR */}
			{modal === 'qr' && seleccion && (
				<Modal titulo={`Código QR — ${seleccion.visitante}`} alCerrar={() => setModal(null)}>
					<div className="flex flex-col items-center gap-5">
						<div className="p-4 bg-white rounded-xl shadow-lg relative">
							{seleccion.estado !== 'Activo' && seleccion.estado !== 'Pendiente' && (
								<div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
									<span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg uppercase tracking-wider">
										{seleccion.estado}
									</span>
								</div>
							)}
							{/* Generación dinámica de QR consumiendo API gratuita */}
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${window.location.origin}/garita/validar/${seleccion.codigo}`)}&color=09090b`}
								alt={`QR para ${seleccion.codigo}`}
								className="w-[160px] h-[160px] rounded-sm object-contain"
							/>
						</div>
						<p className="text-xs font-mono text-zinc-500 text-center">
							{seleccion.codigo} <br />
							<span className="text-[10px] opacity-70">(Escanea este QR con tu celular)</span>
						</p>

						{/* Botón de simulación para presentación */}
						{(seleccion.estado === 'Activo' || seleccion.estado === 'Pendiente') && (
							<button
								onClick={() => {
									setDatos(
										datos.map((d) => (d.id === seleccion.id ? { ...d, estado: 'Utilizado' } : d)),
									);
									setModal(null);
								}}
								className="mt-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-colors w-full"
							>
								Simular Escaneo en Garita (PC)
							</button>
						)}
					</div>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Invitación?"
					mensaje={`Vas a eliminar permanentemente el registro de visita para ${aEliminar.visitante}.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminacion}
				/>
			)}
		</div>
	);
}

function ModuloMulta({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(multasEjemplo);
	const [busqueda, setBusqueda] = useState('');

	const [modal, setModal] = useState(false);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);

	const [form, setForm] = useState({ propiedad: '', infraccion: '', descripcion: '' });

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter((m) => limpiarBusqueda(m.propiedad).includes(termino))
		: datos;

	// Registrar o actualizar sanción/multa
	function registrar(e) {
		if (e) e.preventDefault();
		if (!form.propiedad || !form.infraccion) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);

		if (editandoId) {
			setDatos(
				datos.map((m) =>
					m.id === editandoId
						? {
								...m,
								propiedad: form.propiedad,
								infraccion: form.infraccion,
								residente: propObj?.inquilino || propObj?.propietario || '—',
							}
						: m,
				),
			);
		} else {
			// Regla de negocio: Si llega a 3 llamados, se convierte en MULTA ACTIVA
			const existente = datos.find(
				(m) => m.propiedad === form.propiedad && m.infraccion === form.infraccion,
			);
			if (existente) {
				const nuevosLlamados = existente.llamados + 1;
				const nuevoEstado = nuevosLlamados >= 3 ? 'MULTA ACTIVA' : existente.estado;
				if (nuevosLlamados === 3)
					alert(
						`¡Atención! Propiedad ${form.propiedad} alcanzó 3 llamados por "${form.infraccion}". Multa automática generada.`,
					);
				setDatos(
					datos.map((m) =>
						m.id === existente.id ? { ...m, llamados: nuevosLlamados, estado: nuevoEstado } : m,
					),
				);
			} else {
				setDatos([
					...datos,
					{
						id: Date.now(),
						propiedad: form.propiedad,
						residente: propObj?.inquilino || propObj?.propietario || '—',
						infraccion: form.infraccion,
						llamados: 1,
						estado: 'ADVERTENCIA',
						fecha: new Date().toISOString().split('T')[0],
					},
				]);
			}
		}
		setModal(false);
		setEditandoId(null);
	}

	function abrirEditar(m) {
		setForm({
			propiedad: m.propiedad,
			infraccion: m.infraccion,
			descripcion: m.descripcion || '',
		});
		setEditandoId(m.id);
		setModal(true);
	}

	function confirmarEliminacion() {
		setDatos(datos.filter((m) => m.id !== aEliminar.id));
		setAEliminar(null);
	}

	// Componente visual para mostrar los puntitos de advertencia
	function IndicadorLlamados({ cantidad }) {
		const progreso = cantidad % 3 === 0 && cantidad > 0 ? 3 : cantidad % 3;
		const esMulta = cantidad >= 3;
		return (
			<div className="flex items-center gap-1.5">
				<div className="flex gap-0.5">
					{[1, 2, 3].map((n) => (
						<div
							key={n}
							className={`w-2 h-2 rounded-full transition-colors ${n <= progreso ? (esMulta ? 'bg-red-500' : 'bg-amber-400') : 'bg-zinc-700'}`}
						/>
					))}
				</div>
				<span className={`text-xs font-bold ${esMulta ? 'text-red-400' : 'text-secundario'}`}>
					{cantidad} total
				</span>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Sanciones Registradas"
					valor={datos.length}
					Icono={AlertTriangle}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Multas Activas"
					valor={datos.filter((m) => m.estado === 'MULTA ACTIVA').length}
					Icono={AlertTriangle}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Multas Pagadas"
					valor={datos.filter((m) => m.estado === 'PAGADO').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Llamados de Atención"
					valor={datos.reduce((s, m) => s + m.llamados, 0)}
					Icono={Zap}
					fondo="bg-amber-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ propiedad: '', infraccion: '', descripcion: '' });
							setEditandoId(null);
							setModal(true);
						}}
					>
						<Plus className="w-4 h-4" /> Nuevo Llamado
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Propiedad',
							'Responsable',
							'Motivo',
							'Llamados',
							'Fecha',
							'Estado Financiero',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((m, i) => (
							<Fila
								key={m.id}
								indice={i}
								seleccionada={filaActiva === m.id}
								onClick={() => setFilaActiva(filaActiva === m.id ? null : m.id)}
							>
								<Celda mono>{m.propiedad}</Celda>
								<Celda>{m.residente}</Celda>
								<Celda>{m.infraccion}</Celda>
								<td className="px-4 py-3">
									<IndicadorLlamados cantidad={m.llamados} />
								</td>
								<Celda>{m.fecha}</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={m.estado} variante={m.estado.toLowerCase()} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-2">
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(m)}
											colorHover="hover:text-blue-400"
										/>
										{m.estado === 'MULTA ACTIVA' && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													setDatos(datos.map((d) => (d.id === m.id ? { ...d, estado: 'PAGADO' } : d)));
												}}
												className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
											>
												Marcar pagado
											</button>
										)}
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar registro"
											onClick={() => setAEliminar(m)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="registros" />
			</div>

			{modal && (
				<Modal
					titulo={editandoId ? 'Editar Llamado de Atención' : 'Emitir Llamado de Atención'}
					alCerrar={() => {
						setModal(false);
						setEditandoId(null);
					}}
				>
					<form onSubmit={registrar} className="space-y-4">
						<Campo etiqueta="Propiedad infractora">
							<Selector
								value={form.propiedad}
								onChange={(e) => setForm({ ...form, propiedad: e.target.value })}
								required
							>
								<option value="">Seleccionar propiedad...</option>
								{propiedadesEjemplo
									.filter((p) => p.estado === 'Activo')
									.map((p) => (
										<option key={p.id} value={p.numero}>
											{p.numero} — {p.inquilino || p.propietario}
										</option>
									))}
							</Selector>
						</Campo>
						<Campo etiqueta="Reglamento violado">
							<Selector
								value={form.infraccion}
								onChange={(e) => setForm({ ...form, infraccion: e.target.value })}
								required
							>
								<option value="">Seleccionar motivo...</option>
								<option>Ruido nocturno</option>
								<option>Mascotas sin bozal</option>
								<option>Basura fuera de hora</option>
								<option>Uso indebido de áreas comunes</option>
								<option>Daño a propiedad común</option>
							</Selector>
						</Campo>
						<Campo etiqueta="Observaciones">
							<textarea
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								rows={3}
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none transition-colors resize-none"
							/>
						</Campo>
						{!editandoId && (
							<div className="flex gap-2 p-3 rounded-lg bg-zinc-800/50 border border-borde">
								<AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<p className="text-xs text-zinc-400">
									Al llegar a 3 llamados por el mismo motivo, el estado cambiará a{' '}
									<strong className="text-red-400">MULTA ACTIVA</strong>.
								</p>
							</div>
						)}
						<BotonesModal
							alCancelar={() => {
								setModal(false);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Registrar Falta'}
						/>
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Registro?"
					mensaje={`Borrando este registro de la propiedad ${aEliminar.propiedad}. El conteo de llamados bajará.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminacion}
				/>
			)}
		</div>
	);
}

/* ==========================================================================
   8. COMPONENTE PRINCIPAL (App / Layout / Router)
========================================================================== */

export default function App() {
	// Captura rápida para la vista de validación de QR (fuera del panel de admin)
	if (window.location.pathname.startsWith('/garita')) {
		return <VistaGarita />;
	}

	// Estados globales de la aplicación
	const [pantallaActual, setPantallaActual] = useState('login');
	const [usuarioActual, setUsuarioActual] = useState(null); // Guarda el perfil traído de Oracle
	const [moduloActivo, setModuloActivo] = useState('');
	const [busquedaGlobal, setBusquedaGlobal] = useState('');

	// Controles del Layout
	const [grupoExpandido, setGrupoExpandido] = useState(0);
	const [isSidebarHovered, setIsSidebarHovered] = useState(false);
	const [notisAbiertas, setNotisAbiertas] = useState(false);
	const [hayNotisNuevas, setHayNotisNuevas] = useState(true);
	const [verHistorialNotis, setVerHistorialNotis] = useState(false);
	const [temaOscuro, setTemaOscuro] = useState(true);
	const [cargando, setCargando] = useState(false);
	const [mensajeCarga, setMensajeCarga] = useState('');

	const notisRef = useRef(null);

	// Cerrar panel de notificaciones si se hace click afuera
	useEffect(() => {
		const clickAfuera = (e) => {
			if (notisRef.current && !notisRef.current.contains(e.target)) setNotisAbiertas(false);
		};
		document.addEventListener('mousedown', clickAfuera);
		return () => document.removeEventListener('mousedown', clickAfuera);
	}, []);

	// Gestión de Sesión con el Backend Node.js
	const manejarLogin = async (usuario, contrasena) => {
		setMensajeCarga('Validando credenciales...');
		setCargando(true);

		try {
			const respuesta = await fetch('http://localhost:1000/usuarios/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nombreUsuario: usuario, contrasena: contrasena }),
			});

			const data = await respuesta.json();

			if (respuesta.ok) {
				console.log('Login exitoso:', data);
				setUsuarioActual(data);

				// Redirigir a la pantalla correcta según el Rol de Oracle
				if (data.ROL === 'Administrador') {
					setModuloActivo('Gestión de Propiedades');
				} else if (data.ROL === 'Guardia') {
					setModuloActivo('Pases de Visita (QR)');
					setGrupoExpandido(1);
				} else {
					setModuloActivo('Pases de Visita (QR)');
				}

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

	// Filtrar el menú lateral dinámicamente usando RBAC (Control Basado en Roles)
	const gruposPermitidos = GRUPOS.map((grupo) => ({
		...grupo,
		modulos: grupo.modulos.filter((m) => m.roles.includes(usuarioActual?.ROL)),
	})).filter((grupo) => grupo.modulos.length > 0);

	// Diccionario que conecta el nombre del menú con el Componente Real
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

	return (
		<div
			className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${temaOscuro ? 'bg-fondo text-primario' : 'tema-claro'}`}
		>
			{cargando ? (
				<AnimacionCarga mensaje={mensajeCarga} />
			) : (
				<>
					{pantallaActual === 'login' && (
						<VistaLogin
							onLogin={manejarLogin}
							temaOscuro={temaOscuro}
							setTemaOscuro={setTemaOscuro}
						/>
					)}
					{pantallaActual === 'dashboard' && (
						<>
							{/* Sidebar - Menú Lateral */}
							<aside
								onMouseEnter={() => setIsSidebarHovered(true)}
								onMouseLeave={() => setIsSidebarHovered(false)}
								className={`flex flex-col border-r border-borde bg-tarjeta flex-shrink-0 transition-[width] duration-300 ease-in-out relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] overflow-hidden ${isSidebarHovered ? 'w-[280px]' : 'w-[80px]'}`}
							>
								<div className="flex flex-col h-full w-[280px]">
									{/* Encabezado Logo */}
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

									{/* Opciones del Menú */}
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

									{/* Perfil del Usuario Logueado */}
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
													{usuarioActual ? `${usuarioActual.NOMBRE} ${usuarioActual.APELLIDO}` : 'Usuario'}
												</p>
												<p className="text-[10px] font-bold text-emerald-500 leading-tight truncate">
													{usuarioActual?.ROL}
												</p>
											</div>
										</div>
									</div>
								</div>
							</aside>

							{/* Panel Derecho Principal */}
							<div className="flex flex-col flex-1 min-w-0 relative z-10">
								{/* Topbar */}
								<header className="flex items-center justify-between h-16 px-8 border-b border-borde bg-fondo/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-30">
									<div>
										<h1 className="text-[17px] font-bold font-title text-primario leading-tight">
											{moduloActivo}
										</h1>
										<p className="text-[11px] text-zinc-500 leading-tight font-medium mt-0.5">
											{SUBTITULOS[moduloActivo] ?? `Módulo en desarrollo`}
										</p>
									</div>

									<div className="flex items-center gap-4">
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

										<button
											onClick={() => setTemaOscuro(!temaOscuro)}
											className="p-2 rounded-lg text-zinc-400 hover:text-primario hover:bg-tarjeta transition-colors"
											title={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
										>
											{temaOscuro ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
										</button>

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
																		const indiceGrupo = GRUPOS.findIndex((g) =>
																			g.modulos.some((m) => m.id === n.moduloDestino),
																		);
																		if (indiceGrupo !== -1) setGrupoExpandido(indiceGrupo);
																	}
																	setNotisAbiertas(false);
																}}
																className="flex items-start gap-3 p-4 border-b border-borde/50 hover:bg-fondo/50 transition-colors cursor-pointer group"
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

										<div className="h-6 w-px bg-borde mx-1"></div>

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

								{/* Renderizado Dinámico del Módulo Seleccionado */}
								<main className="flex-1 p-8 overflow-y-auto bg-fondo custom-scrollbar transition-colors duration-300">
									<div className="max-w-7xl mx-auto">{vistaActual}</div>
								</main>
							</div>
						</>
					)}
				</>
			)}

			{/* Modal Historial Notificaciones Completas */}
			{verHistorialNotis && pantallaActual === 'dashboard' && (
				<Modal titulo="Historial de Notificaciones" alCerrar={() => setVerHistorialNotis(false)}>
					<div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-2">
						{notificacionesEjemplo.map((n) => (
							<div
								key={n.id}
								onClick={() => {
									if (n.moduloDestino) {
										setModuloActivo(n.moduloDestino);
										const indiceGrupo = GRUPOS.findIndex((g) =>
											g.modulos.some((m) => m.id === n.moduloDestino),
										);
										if (indiceGrupo !== -1) setGrupoExpandido(indiceGrupo);
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

			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes loginFadeIn { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
				@keyframes loginShake { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-8px); } 30% { transform: translateX(7px); } 45% { transform: translateX(-6px); } 60% { transform: translateX(5px); } 75% { transform: translateX(-3px); } 90% { transform: translateX(2px); } }
				@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
				@keyframes barraProgreso { 0% { width: 0%; margin-left: 0%; } 50% { width: 60%; margin-left: 20%; } 100% { width: 0%; margin-left: 100%; } }
				@keyframes dashSlideUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
				@keyframes dashFadeIn { from { opacity: 0; } to { opacity: 1; } }

				/* Dashboard Entry Animations */
				.dashboard-main-anim > div > div { animation: dashFadeIn 0.5s ease both; }
				.dashboard-main-anim > div > div:nth-child(1) { animation: dashSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
				.dashboard-main-anim > div > div:nth-child(2) { animation: dashSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
				.dashboard-main-anim > div > div:nth-child(3) { animation: dashSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.25s both; }

				.dashboard-main-anim .grid > div:nth-child(1) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
				.dashboard-main-anim .grid > div:nth-child(2) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.16s both; }
				.dashboard-main-anim .grid > div:nth-child(3) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.24s both; }
				.dashboard-main-anim .grid > div:nth-child(4) { animation: dashSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.32s both; }

				/* Scrollbar Customization */
				.custom-scrollbar::-webkit-scrollbar { width: 6px; }
				.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
				.custom-scrollbar::-webkit-scrollbar-thumb { background: #52525b; border-radius: 10px; }

				/* Filas de Tabla Modo Oscuro */
				.fila-normal { background-color: transparent; }
				.fila-normal:hover { background-color: rgba(63,63,70,0.35) !important; }
				.fila-seleccionada { background-color: rgba(63,63,70,0.55) !important; }

				/* =========================================
				   PALETA MODO CLARO 
				========================================= */
				.tema-claro { background-color: #f1f5f9 !important; color: #0f172a !important; }
				.tema-claro .bg-fondo { background-color: #f1f5f9 !important; }
				.tema-claro .bg-fondo\\/80 { background-color: rgba(241,245,249,0.92) !important; }
				.tema-claro .bg-fondo\\/50 { background-color: rgba(241,245,249,0.75) !important; }
				.tema-claro .bg-tarjeta { background-color: #ffffff !important; }
				.tema-claro .bg-tarjeta\\/50 { background-color: rgba(255,255,255,0.75) !important; }
				.tema-claro .bg-tarjeta\\/20 { background-color: transparent !important; }

				.tema-claro .border-borde { border-color: #e2e8f0 !important; }
				.tema-claro .border-borde\\/50 { border-color: rgba(226,232,240,0.65) !important; }
				.tema-claro .border-borde\\/40 { border-color: rgba(226,232,240,0.5) !important; }

				.tema-claro .text-primario { color: #0f172a !important; }
				.tema-claro .text-secundario { color: #64748b !important; }
				.tema-claro .text-zinc-300 { color: #334155 !important; }
				.tema-claro .text-zinc-400 { color: #475569 !important; }
				.tema-claro .text-zinc-500 { color: #64748b !important; }
				.tema-claro .text-zinc-600 { color: #94a3b8 !important; }
				.tema-claro .text-zinc-700 { color: #cbd5e1 !important; }

				.tema-claro .bg-zinc-800 { background-color: #e2e8f0 !important; }
				.tema-claro .bg-zinc-800\\/50 { background-color: rgba(226,232,240,0.55) !important; }
				.tema-claro .bg-zinc-800\\/60 { background-color: rgba(226,232,240,0.65) !important; }
				.tema-claro .bg-zinc-800\\/80 { background-color: rgba(226,232,240,0.85) !important; }
				.tema-claro .bg-zinc-900\\/40 { background-color: rgba(241,245,249,0.65) !important; }
				.tema-claro .bg-zinc-700\\/60 { background-color: rgba(203,213,225,0.7) !important; }

				.tema-claro .hover\\:bg-zinc-800:hover { background-color: #cbd5e1 !important; }
				.tema-claro .hover\\:bg-zinc-800\\/50:hover { background-color: rgba(203,213,225,0.5) !important; }
				.tema-claro .hover\\:bg-zinc-700\\/30:hover { background-color: rgba(203,213,225,0.45) !important; }
				.tema-claro .hover\\:bg-fondo\\/50:hover { background-color: rgba(241,245,249,0.85) !important; }

				.tema-claro .fila-normal { background-color: #ffffff !important; }
				.tema-claro .fila-normal:hover { background-color: #f1f5f9 !important; }
				.tema-claro .fila-seleccionada { background-color: #e2e8f0 !important; }
				.tema-claro thead tr { background-color: #f8fafc !important; }
				.tema-claro .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; }
				.tema-claro .focus-within\\:ring-zinc-800:focus-within { --tw-ring-color: #94a3b8 !important; }
				.tema-claro .shadow-sm { box-shadow: 0 1px 3px rgba(15,23,42,0.07) !important; }
				.tema-claro .shadow-2xl { box-shadow: 0 8px 32px rgba(15,23,42,0.10) !important; }
			`,
				}}
			/>
		</div>
	);
}
