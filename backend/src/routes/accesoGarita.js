import { Router } from 'express';
import { AccesoGaritaController } from '../controllers/accesoGarita.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorAccesoGarita = Router();

// Todas las rutas requieren estar autenticado
enrutadorAccesoGarita.use(autenticacion);

// Ruta para el guardia que escanea el QR
enrutadorAccesoGarita.get(
    '/validar/:qr',
    verificarRol('Administrador', 'Guardia'),
    AccesoGaritaController.validarQr
);

enrutadorAccesoGarita.get(
    '/',
    verificarRol('Administrador', 'Guardia'),
    AccesoGaritaController.obtenerTodos,
);

// IMPORTANTE: Agregamos "Guardia" para que pueda guardar el acceso
enrutadorAccesoGarita.post(
    '/', 
    verificarRol('Administrador', 'Guardia'), 
    AccesoGaritaController.crear
);

enrutadorAccesoGarita.get(
    '/:id',
    verificarRol('Administrador', 'Guardia'),
    AccesoGaritaController.obtenerPorId,
);

enrutadorAccesoGarita.put(
    '/:id',
    verificarRol('Administrador'),
    AccesoGaritaController.actualizar,
);

enrutadorAccesoGarita.delete(
    '/:id',
    verificarRol('Administrador'),
    AccesoGaritaController.eliminar,
);