import instancia from './axios.js';

export const invitacionesApi = {
    obtenerTodas: () => instancia.get('/invitaciones'),
    
    // No necesitamos obtener por ID ni eliminar según las reglas de negocio
    
    crear: (datos) => instancia.post('/invitaciones', datos),

    // Solo actualizamos para Activar/Desactivar
    actualizar: (id, datos) => instancia.patch(`/invitaciones/${id}`, datos),
};