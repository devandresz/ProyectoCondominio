import instancia from './axios.js';

export const areasSocialesApi = {
  obtenerTodas: () => instancia.get('/areas-sociales'),
  crear: (data) => instancia.post('/areas-sociales', data),
  actualizar: (id, data) => instancia.put(`/areas-sociales/${id}`, data),
  cambiarEstado: (id, activo) => instancia.patch(`/areas-sociales/${id}/estado`, { activo }),
};