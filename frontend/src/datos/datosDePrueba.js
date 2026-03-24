import {
	Building,
	Car,
	QrCode,
	AlertTriangle,
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
	Home,
	ShieldAlert,
	Wallet,
	Briefcase,
	ShieldCheck,
	Zap,
} from 'lucide-react';

// ─── PROPIEDADES ───────────────────────────────────────────────────────────
export const propiedadesEjemplo = [
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

// ─── VEHÍCULOS ─────────────────────────────────────────────────────────────
export const vehiculosEjemplo = [
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

// ─── INVITACIONES / PASES QR ───────────────────────────────────────────────
export const invitacionesEjemplo = [
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

// ─── MULTAS ────────────────────────────────────────────────────────────────
export const multasEjemplo = [
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

// ─── NOTIFICACIONES ────────────────────────────────────────────────────────
export const notificacionesEjemplo = [
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

// ─── MENÚ LATERAL + RBAC ──────────────────────────────────────────────────
export const GRUPOS = [
	{
		titulo: 'Residencial & Accesos',
		IconoGrupo: Home,
		modulos: [
			{ id: 'Gestión de Propiedades', Icono: Building, propio: false, roles: ['Administrador'] },
			{
				id: 'Directorio Residentes',
				Icono: Users,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Control Vehicular',
				Icono: Car,
				propio: false,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
			{
				id: 'Pases de Visita (QR)',
				Icono: QrCode,
				propio: false,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
			{
				id: 'Propietarios e Inquilinos',
				Icono: Users,
				propio: true,
				roles: ['Administrador', 'Guardia'],
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
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Inventario Parqueos',
				Icono: ParkingCircle,
				propio: true,
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
				propio: true,
				roles: ['Administrador', 'Residente'],
			},
			{ id: 'Historial Financiero', Icono: Zap, propio: false, roles: ['Administrador'] },
			{
				id: 'Llamados de Atención',
				Icono: PhoneCall,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Infracciones y Multas',
				Icono: AlertTriangle,
				propio: false,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
			{
				id: 'Tipos de Cargo',
				Icono: Layers,
				propio: true,
				roles: ['Administrador'],
			},
			{
 				 id: 'Cargos Financieros',
  				Icono: CreditCard,
  				roles: ['Administrador'],
  				propio: true	
			}
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
				propio: true,
				roles: ['Administrador', 'Residente'],
			},
			{
				id: 'Mesa de Ayuda',
				Icono: Ticket,
				propio: true,
				roles: ['Administrador', 'Residente'],
			},
			{
  				id: 'Áreas Sociales',
  				Icono: Trees,
  				propio: true,
  				roles: ['Administrador'],
			},
			{ id: 'Catálogos del Sistema', Icono: Layers, propio: false, roles: ['Administrador'] },
		],
	},
];

// ─── UTILIDADES ───────────────────────────────────────────────────────────
export const limpiarBusqueda = (str) =>
	str ? str.toString().replace(/[-\s]/g, '').toLowerCase() : '';

export function colorVehiculo(color) {
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
