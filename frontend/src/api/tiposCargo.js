import instancia from './axios.js';

export const tiposCargoApi = {
	obtenerTodos: () => instancia.get('/tipos-cargo'),

	obtenerPorId: (id) => instancia.get(`/tipos-cargo/${id}`),

	crear: (datos) => instancia.post('/tipos-cargo', datos),

	actualizar: (id, datos) => instancia.patch(`/tipos-cargo/${id}`, datos),

	desactivar: (id) => instancia.patch(`/tipos-cargo/${id}/desactivar`),
};