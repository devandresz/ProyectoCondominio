import { Router } from 'express';
import { AreasSocialesController } from '../controllers/areasSociales.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorAreasSociales = Router();

enrutadorAreasSociales.get(
  '/',
  autenticacion,
  verificarRol('Administrador'),
  AreasSocialesController.obtenerTodas
);

enrutadorAreasSociales.put(
  '/:id',
  autenticacion,
  verificarRol('Administrador'),
  AreasSocialesController.actualizar
);

enrutadorAreasSociales.patch(
  '/:id/estado',
  autenticacion,
  verificarRol('Administrador'),
  AreasSocialesController.cambiarEstado
);