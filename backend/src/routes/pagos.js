import { Router } from 'express';
import { PagoController } from '../controllers/pagos.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorPagos = Router();

// Rutas para residentes y administradores

// Obtener estado de cuenta (cargos pendientes)
enrutadorPagos.get(
	'/estado-cuenta',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	PagoController.obtenerEstadoCuenta,
);

// Obtener historial de pagos con detalles
enrutadorPagos.get(
	'/historial',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	PagoController.obtenerHistorialCompleto,
);

// Obtener pagos del usuario autenticado
enrutadorPagos.get(
	'/mis-pagos',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	PagoController.obtenerMisPagos,
);

// Crear nuevo pago
enrutadorPagos.post(
	'/',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	PagoController.crear,
);

// Rutas administrativas

// Obtener todos los pagos (solo Admin)
enrutadorPagos.get(
	'/',
	autenticacion,
	verificarRol('Administrador'),
	PagoController.obtenerTodos,
);

// Obtener pago por ID
enrutadorPagos.get(
	'/:id',
	autenticacion,
	verificarRol('Residente', 'Administrador'),
	PagoController.obtenerPorId,
);
