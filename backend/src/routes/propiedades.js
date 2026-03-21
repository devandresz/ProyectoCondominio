import { Router } from 'express';
import { propiedadesController } from '../controllers/propiedades.js';
// import { verificarRol } from '../middlewares/permisos.js'; // Descomenta esto cuando activemos la seguridad

export const enrutadorPropiedades = Router();

// GET: Obtener todas
enrutadorPropiedades.get('/', propiedadesController.obtenerTodas);

// GET: Obtener una por ID
enrutadorPropiedades.get('/:id', propiedadesController.obtenerPorId);

// POST: Crear nueva
enrutadorPropiedades.post('/', propiedadesController.crear);

// PATCH: Actualizar existente
enrutadorPropiedades.patch('/:id', propiedadesController.actualizar);