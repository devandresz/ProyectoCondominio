import instancia from './axios.js';

export const reservasApi = {
	// Áreas sociales disponibles
	obtenerAreas: () => instancia.get('/reservas/areas'),

	// Verificar disponibilidad
	verificarDisponibilidad: (params) => instancia.get('/reservas/disponibilidad', { params }),

	// Calcular costo
	calcularCosto: (params) => instancia.get('/reservas/calcular-costo', { params }),

	// Mis reservas (residente autenticado)
	misReservas: () => instancia.get('/reservas/mis-reservas'),

	// Todas las reservas (Admin)
	obtenerTodas: () => instancia.get('/reservas'),

	// Reserva por ID
	obtenerPorId: (id) => instancia.get(`/reservas/${id}`),

	// Crear reserva
	crear: (datos) => instancia.post('/reservas', datos),

	// Cancelar reserva (Admin)
	cancelar: (id, motivo) => instancia.patch(`/reservas/${id}/cancelar`, { motivo }),

	// Historial de cancelaciones (Admin)
	historialCancelaciones: (id) => instancia.get(`/reservas/${id}/historial-cancelaciones`),
};
