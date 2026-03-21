import instancia from './axios.js';

export const accesoGaritaApi = {
    validarQr: (qr) => instancia.get(`/accesoGarita/validar/${qr}`),
    registrar: (datos) => instancia.post('/accesoGarita', datos),
};