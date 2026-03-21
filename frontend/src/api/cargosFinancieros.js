import instancia from './axios.js';

export const cargosFinancierosApi = {
  obtenerPorPropiedad: (idPropiedad) =>
    instancia.get(`/cargos-financieros/${idPropiedad}`)
};