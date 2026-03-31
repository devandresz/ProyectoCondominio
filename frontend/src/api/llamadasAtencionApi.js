import instancia from './axios.js';

export const llamadasAtencionApi = {
	obtenerTodos: () => instancia.get('/llamadasAtencion'),

	obtenerTodosAgrupados: () => instancia.get('/llamadasAtencion/agrupados'),

	obtenerTodosAgrupadosPorId: () => instancia.get('/llamadasAtencion/agrupados/:id'),

	obtenerPorId: (id) => instancia.get(`/llamadasAtencion/${id}`),

	crear: (datos) => instancia.post('/llamadasAtencion', datos),

	actualizar: (id, datos) => instancia.patch(`/llamadasAtencion/${id}`, datos),

	eliminar: (id) => instancia.delete(`/llamadasAtencion/${id}`),
};
