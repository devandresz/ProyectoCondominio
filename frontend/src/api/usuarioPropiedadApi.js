import instancia from './axios.js';

export const usuariosPropiedadApi = {
	obtenerTodos: () => instancia.get('/usuarioPropiedad'),

	obtenerPorId: (id) => instancia.get(`/usuarioPropiedad/${id}`),

	crear: (datos) => instancia.post('/usuarioPropiedad', datos),

	actualizar: (id, datos) => instancia.patch(`/usuarioPropiedad/${id}`, datos),

	eliminar: (id) => instancia.delete(`/usuarioPropiedad/${id}`),
};
