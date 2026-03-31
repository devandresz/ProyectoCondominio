import 'dotenv/config';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import { enrutadorTickets } from './routes/tickets.js';
import { enrutadorParqueos } from './routes/parqueos.js';
import { enrutadorUsuarios } from './routes/usuarios.js';
import { enrutadorReservas } from './routes/reservas.js';
import { enrutadorLlamadasAtencion } from './routes/llamadasAtencion.js';
import { enrutadorTiposCargo } from './routes/tiposCargo.js';
import { enrutadorAccesoGarita } from './routes/accesoGarita.js';
import { enrutadorPagos } from './routes/pagos.js';
import { enrutadorUsuarioPropiedad } from './routes/usuarioPropiedad.js';
import { middlewareCors } from './middlewares/cors.js';
import { PORT } from './config/config.js';
import { enrutadorCargosFinancieros } from './routes/cargosFinancieros.js';
import { enrutadorAreasSociales } from './routes/areasSociales.js';
// import { enrutadorMultas } from './routes/multas.js';

const aplicacion = express();
// Middlewares
aplicacion.use(json());
aplicacion.use(cookieParser());
aplicacion.use(middlewareCors());
aplicacion.disable('x-powered-by');

// Rutas
aplicacion.use('/tickets', enrutadorTickets);
aplicacion.use('/usuarios', enrutadorUsuarios);
aplicacion.use('/parqueos', enrutadorParqueos);
aplicacion.use('/llamadasAtencion', enrutadorLlamadasAtencion);
aplicacion.use('/accesoGarita', enrutadorAccesoGarita);
aplicacion.use('/tipos-cargo', enrutadorTiposCargo);
aplicacion.use('/cargos-financieros', enrutadorCargosFinancieros);
aplicacion.use('/areas-sociales', enrutadorAreasSociales);
aplicacion.use('/usuarioPropiedad', enrutadorUsuarioPropiedad);
// aplicacion.use('/multas', enrutadorMultas);
aplicacion.use('/reservas', enrutadorReservas);
aplicacion.use('/pagos', enrutadorPagos);

if (process.env.NODE_ENV !== 'test') {
	aplicacion.listen(PORT, () => {
		console.log(`Servidor escuchando en http://localhost:${PORT}`);
	});
}

export default aplicacion;
