import 'dotenv/config';
import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import { enrutadorTickets } from './routes/tickets.js';
import { enrutadorParqueos } from './routes/parqueos.js';
import { enrutadorUsuarios } from './routes/usuarios.js';
import { enrutadorLlamadasAtencion } from './routes/llamadasAtencion.js';
import { middlewareCors } from './middlewares/cors.js';
import { PORT } from './config/config.js';

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

if (process.env.NODE_ENV !== 'test') {
	aplicacion.listen(PORT, () => {
		console.log(`Servidor escuchando en http://localhost:${PORT}`);
	});
}

export default aplicacion;
