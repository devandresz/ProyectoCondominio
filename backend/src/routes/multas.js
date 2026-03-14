import { Router } from 'express';
import { MultaController } from '../controllers/multas.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorMultas = Router();

enrutadorMultas.get('/prueba', (req, res) => {
  res.json({ ok: true, mensaje: 'router multas funcionando' });
});

// Todas las rutas requieren estar autenticado
enrutadorMultas.use(autenticacion);

// Obtener todas las multas
enrutadorMultas.get(
  '/',
  verificarRol('Administrador', 'Guardia'),
  MultaController.obtenerTodos,
);

// Obtener multa por id
enrutadorMultas.get(
  '/:id',
  verificarRol('Administrador', 'Guardia'),
  MultaController.obtenerPorId,
);

// Crear multa
enrutadorMultas.post(
  '/',
  verificarRol('Administrador'),
  MultaController.crear,
);