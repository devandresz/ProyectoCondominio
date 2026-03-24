import { Router } from 'express';
import { ReservaController } from '../controllers/reservas.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorReservas = Router();

// Rutas públicas para residentes autenticados

// Obtener áreas sociales disponibles
enrutadorReservas.get('/areas', autenticacion, ReservaController.obtenerAreas);

// Verificar disponibilidad de un área
enrutadorReservas.get(
	'/disponibilidad',
	autenticacion,
	ReservaController.verificarDisponibilidad,
);

// Calcular costo de una reserva
enrutadorReservas.get('/calcular-costo', autenticacion, ReservaController.calcularCosto);

// Obtener reservas del usuario autenticado
enrutadorReservas.get(
	'/mis-reservas',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	ReservaController.obtenerMisReservas,
);

// Crear nueva reserva (solo Residentes y Admin)
enrutadorReservas.post(
	'/',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	ReservaController.crear,
);

// Rutas administrativas

// Obtener todas las reservas (solo Admin)
enrutadorReservas.get(
	'/',
	autenticacion,
	verificarRol('Administrador'),
	ReservaController.obtenerTodas,
);

// Obtener reserva por ID
enrutadorReservas.get(
	'/:id',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	ReservaController.obtenerPorId,
);

// Cancelar reserva (solo Admin)
enrutadorReservas.patch(
	'/:id/cancelar',
	autenticacion,
	verificarRol('Administrador'),
	ReservaController.cancelar,
);

// Obtener historial de cancelaciones (solo Admin)
enrutadorReservas.get(
	'/:id/historial-cancelaciones',
	autenticacion,
	verificarRol('Administrador'),
	ReservaController.obtenerHistorialCancelaciones,
);
