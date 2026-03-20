// backend/src/routes/tiposCargo.js
import { Router } from 'express';
import { TipoCargoController } from '../controllers/tiposCargo.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorTiposCargo = Router();

// Rutas protegidas
enrutadorTiposCargo.get(
	'/',
	autenticacion,
	verificarRol('Administrador'),
	TipoCargoController.obtenerTodos,
);

enrutadorTiposCargo.get(
	'/:id',
	autenticacion,
	verificarRol('Administrador'),
	TipoCargoController.obtenerPorId,
);

enrutadorTiposCargo.post(
	'/',
	autenticacion,
	verificarRol('Administrador'),
	TipoCargoController.crear,
);

enrutadorTiposCargo.patch(
	'/:id',
	autenticacion,
	verificarRol('Administrador'),
	TipoCargoController.actualizar,
);

enrutadorTiposCargo.patch(
	'/:id/desactivar',
	autenticacion,
	verificarRol('Administrador'),
	TipoCargoController.desactivar,
);