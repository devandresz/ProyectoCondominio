import instancia from './axios.js';

export const parqueosApi = {
	obtenerTodos: () => instancia.get('/parqueos'),

	obtenerPorId: (id) => instancia.get(`/parqueos/${id}`),

	crear: (datos) => instancia.post('/parqueos', datos),

	actualizar: (id, datos) => instancia.put(`/parqueos/${id}`, datos),

	eliminar: (id) => instancia.delete(`/parqueos/${id}`),
};
