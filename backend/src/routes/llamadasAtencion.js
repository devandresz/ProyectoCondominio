import { Router } from 'express';
import { LlamadasAtencionController } from '../controllers/llamadasAtencion.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorLlamadasAtencion = Router();

// Todas las rutas requieren estar autenticado
enrutadorLlamadasAtencion.use(autenticacion);

// Solo el administrador puede crear, actualizar y eliminar tickets
enrutadorLlamadasAtencion.get(
	'/',
	verificarRol('Administrador', 'Guardia'),
	LlamadasAtencionController.obtenerTodos,
);
enrutadorLlamadasAtencion.post(
	'/',
	verificarRol('Administrador'),
	LlamadasAtencionController.crear,
);
enrutadorLlamadasAtencion.get(
	'/:id',
	verificarRol('Administrador', 'Guardia'),
	LlamadasAtencionController.obtenerPorId,
);
enrutadorLlamadasAtencion.put(
	'/:id',
	verificarRol('Administrador'),
	LlamadasAtencionController.actualizar,
);
enrutadorLlamadasAtencion.delete(
	'/:id',
	verificarRol('Administrador'),
	LlamadasAtencionController.eliminar,
);
