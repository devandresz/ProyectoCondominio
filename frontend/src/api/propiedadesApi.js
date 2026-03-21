import instancia from './axios.js';

export const propiedadesApi = {
    obtenerTodas: () => instancia.get('/propiedades'),

    obtenerPorId: (id) => instancia.get(`/propiedades/${id}`),

    crear: (datos) => instancia.post('/propiedades', datos),

    actualizar: (id, datos) => instancia.patch(`/propiedades/${id}`, datos),
};