import { Router } from 'express';
import { UsuarioPropiedadController } from '../controllers/usuarioPropiedad.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorUsuarioPropiedad = Router();

// Todas las rutas requieren estar autenticado
enrutadorUsuarioPropiedad.use(autenticacion);

// Solo el administrador puede crear, actualizar y eliminar tickets
enrutadorUsuarioPropiedad.get(
	'/',
	verificarRol('Administrador'),
	UsuarioPropiedadController.obtenerTodos,
);
enrutadorUsuarioPropiedad.post(
	'/',
	verificarRol('Administrador'),
	UsuarioPropiedadController.crear,
);
enrutadorUsuarioPropiedad.get(
	'/:id',
	verificarRol('Administrador'),
	UsuarioPropiedadController.obtenerPorId,
);
enrutadorUsuarioPropiedad.put(
	'/:id',
	verificarRol('Administrador'),
	UsuarioPropiedadController.actualizar,
);
enrutadorUsuarioPropiedad.delete(
	'/:id',
	verificarRol('Administrador'),
	UsuarioPropiedadController.eliminar,
);
