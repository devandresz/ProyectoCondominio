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

// ─── INVITACIONES / PASES QR ───────────────────────────────────────────────
// export const invitacionesEjemplo = [
// 	{
// 		id: 1,
// 		visitante: 'Juan Pérez',
// 		tipo: 'Normal',
// 		residente: 'Carlos Méndez',
// 		propiedad: 'A-101',
// 		fecha: '2025-07-15',
// 		estado: 'Pendiente',
// 		codigo: 'QR-001',
// 	},
// 	{
// 		id: 2,
// 		visitante: 'Ana López',
// 		tipo: 'Servicio',
// 		residente: 'Mario Vides',
// 		propiedad: 'B-205',
// 		fecha: null,
// 		estado: 'Pendiente',
// 		codigo: 'QR-002',
// 	},
// 	{
// 		id: 3,
// 		visitante: 'Pedro Castillo',
// 		tipo: 'Normal',
// 		residente: 'Roberto Lima',
// 		propiedad: 'C-310',
// 		fecha: '2024-01-01',
// 		estado: 'Expirado',
// 		codigo: 'QR-003',
// 	},
// 	{
// 		id: 4,
// 		visitante: 'Sofía Ramos',
// 		tipo: 'Servicio',
// 		residente: 'Andrea Solís',
// 		propiedad: 'D-401',
// 		fecha: null,
// 		estado: 'Inactivo',
// 		codigo: 'QR-004',
// 	},
// ];

// ─── MULTAS ────────────────────────────────────────────────────────────────
// export const multasEjemplo = [
// 	{
// 		id: 1,
// 		propiedad: 'A-101',
// 		residente: 'Carlos Méndez',
// 		infraccion: 'Ruido nocturno',
// 		llamados: 3,
// 		estado: 'PENDIENTE',
// 		fecha: '2025-07-01',
// 	},
// 	{
// 		id: 2,
// 		propiedad: 'B-205',
// 		residente: 'Laura Cifuentes',
// 		infraccion: 'Mascotas sin bozal',
// 		llamados: 3,
// 		estado: 'PAGADO',
// 		fecha: '2025-06-15',
// 	},
// 	{
// 		id: 3,
// 		propiedad: 'C-310',
// 		residente: 'Roberto Lima',
// 		infraccion: 'Basura fuera de hora',
// 		llamados: 6,
// 		estado: 'PENDIENTE',
// 		fecha: '2025-07-08',
// 	},
// ];

// ─── NOTIFICACIONES ────────────────────────────────────────────────────────
// export const notificacionesEjemplo = [
// 	{
// 		id: 1,
// 		tipo: 'alerta',
// 		titulo: 'Multa automática',
// 		desc: 'Propiedad A-101 excedió límite de llamados.',
// 		tiempo: 'Hace 2 min',
// 		moduloDestino: 'Infracciones y Multas',
// 	},
// 	{
// 		id: 2,
// 		tipo: 'info',
// 		titulo: 'Visita registrada',
// 		desc: 'QR-001 escaneado en garita principal.',
// 		tiempo: 'Hace 15 min',
// 		moduloDestino: 'Pases de Visita (QR)',
// 	},
// 	{
// 		id: 3,
// 		tipo: 'exito',
// 		titulo: 'Pago procesado',
// 		desc: 'Cuota de mantenimiento C-310 liquidada.',
// 		tiempo: 'Hace 1 hora',
// 		moduloDestino: 'Control de Cuotas',
// 	},
// 	{
// 		id: 4,
// 		tipo: 'info',
// 		titulo: 'Propiedad registrada',
// 		desc: 'Se ha creado la propiedad E-501.',
// 		tiempo: 'Ayer',
// 		moduloDestino: 'Gestión de Propiedades',
// 	},
// ];

// ─── MENÚ LATERAL + RBAC ──────────────────────────────────────────────────
export const GRUPOS = [
	{
		titulo: 'Residencial & Accesos',
		IconoGrupo: Home,
		modulos: [
			{ id: 'Gestión de Propiedades', Icono: Building, propio: true, roles: ['Administrador'] },
			{
				id: 'Directorio Residentes',
				Icono: Users,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Pases de Visita (QR)',
				Icono: QrCode,
				propio: true,
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
				propio: true,
			},
		],
	},
	{
		titulo: 'Operaciones & Soporte',
		IconoGrupo: Briefcase,
		modulos: [
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
		],
	},
];

// ─── UTILIDADES ───────────────────────────────────────────────────────────
export const limpiarBusqueda = (str) =>
	str ? str.toString().replace(/[-\s]/g, '').toLowerCase() : '';
