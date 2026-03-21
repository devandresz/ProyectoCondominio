import instancia from './axios.js';

export const pagosApi = {
	// Estado de cuenta — cargos pendientes de una propiedad
	estadoCuenta: (idPropiedad) =>
		instancia.get('/pagos/estado-cuenta', {
			params: idPropiedad ? { idPropiedad } : {},
		}),

	// Historial completo con detalles por propiedad
	historial: (idPropiedad) =>
		instancia.get('/pagos/historial', {
			params: idPropiedad ? { idPropiedad } : {},
		}),

	// Mis pagos (usuario autenticado — residente)
	misPagos: () => instancia.get('/pagos/mis-pagos'),

	// Todos los pagos (Admin)
	obtenerTodos: () => instancia.get('/pagos'),

	// Pago por ID con detalles
	obtenerPorId: (id) => instancia.get(`/pagos/${id}`),

	// Crear pago — incluye automáticamente TODOS los cargos pendientes (RN-F6, RN-F7)
	crear: (datos) => instancia.post('/pagos', datos),
};
