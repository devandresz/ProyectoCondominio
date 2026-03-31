import 'dotenv/config';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';

// --- TODOS LOS IMPORTS VAN AQUÍ ARRIBA ---
import { enrutadorTickets } from './routes/tickets.js';
import { enrutadorParqueos } from './routes/parqueos.js';
import { enrutadorUsuarios } from './routes/usuarios.js';
import { enrutadorReservas } from './routes/reservas.js';
import { enrutadorLlamadasAtencion } from './routes/llamadasAtencion.js';
import { enrutadorTiposCargo } from './routes/tiposCargo.js';
import { enrutadorAccesoGarita } from './routes/accesoGarita.js';
import { enrutadorInvitaciones } from './routes/invitaciones.js';
import { enrutadorPropiedades } from './routes/propiedades.js';
import { enrutadorCategorias } from './routes/categoriasPropiedad.js';
import { enrutadorVinculaciones } from './routes/usuariosPropiedades.js';

import { enrutadorPagos } from './routes/pagos.js';
import { enrutadorUsuarioPropiedad } from './routes/usuarioPropiedad.js';
import { middlewareCors } from './middlewares/cors.js';
import { PORT } from './config/config.js';
import { enrutadorCargosFinancieros } from './routes/cargosFinancieros.js';
import { enrutadorAreasSociales } from './routes/areasSociales.js';
// import { enrutadorMultas } from './routes/multas.js';

// 1. PRIMERO creamos la aplicación
const aplicacion = express();

// 2. LUEGO ponemos el "espía" para que la terminal hable
aplicacion.use((req, res, next) => {
	console.log(`📥 [${req.method}] -> ${req.url}`);
	next();
});

// Middlewares
aplicacion.use(json());
aplicacion.use(cookieParser());
aplicacion.use(middlewareCors());
aplicacion.disable('x-powered-by');

// Rutas Generales
aplicacion.use('/tickets', enrutadorTickets);
aplicacion.use('/usuarios', enrutadorUsuarios);
aplicacion.use('/parqueos', enrutadorParqueos);
aplicacion.use('/llamadasAtencion', enrutadorLlamadasAtencion);
aplicacion.use('/multas', enrutadorMultas);
aplicacion.use('/accesoGarita', enrutadorAccesoGarita);
aplicacion.use('/tipos-cargo', enrutadorTiposCargo);
aplicacion.use('/cargos-financieros', enrutadorCargosFinancieros);
aplicacion.use('/areas-sociales', enrutadorAreasSociales);
aplicacion.use('/usuarioPropiedad', enrutadorUsuarioPropiedad);
// aplicacion.use('/multas', enrutadorMultas);
aplicacion.use('/reservas', enrutadorReservas);
aplicacion.use('/pagos', enrutadorPagos);

// Rutas del Módulo de Garita y Seguridad
aplicacion.use('/accesoGarita', enrutadorAccesoGarita);
aplicacion.use('/invitaciones', enrutadorInvitaciones);

// Rutas de Gestión Habitacional (Andrés)
aplicacion.use('/propiedades', enrutadorPropiedades);
aplicacion.use('/categorias-propiedad', enrutadorCategorias);
aplicacion.use('/vinculaciones', enrutadorVinculaciones);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
	aplicacion.listen(PORT, '0.0.0.0', () => {
		console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
	});
}

export default aplicacion;
