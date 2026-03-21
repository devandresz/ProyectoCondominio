import { Router } from 'express';
import { CargosFinancierosController } from '../controllers/cargosFinancieros.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorCargosFinancieros = Router();

enrutadorCargosFinancieros.get(
  '/:idPropiedad',
  autenticacion,
  verificarRol('Administrador'),
  CargosFinancierosController.obtenerPorPropiedad
);