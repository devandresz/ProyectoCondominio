import instancia from './axios.js';

export const accesoGaritaApi = {
	// Validar el código QR
	validarQr: (qr) => instancia.get(`/accesoGarita/validar/${qr}`),

	// Registrar el acceso en la bitácora (ahora apunta a /registrar)
	registrar: (datos) => instancia.post('/accesoGarita/registrar', datos),

	// Obtener la bitácora de accesos
	obtenerTodos: () => instancia.get('/accesoGarita/'),
};
