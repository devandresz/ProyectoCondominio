import { AccesoGaritaModel } from '../models/accesoGarita.js';
import { validarAccesoGarita, validarAccesoGaritaParcial } from '../schemas/accesoGarita.js';

export class AccesoGaritaController {
    static async obtenerTodos(req, res) {
        const invitaciones = await AccesoGaritaModel.obtenerTodos();
        res.json(invitaciones);
    }

    static async obtenerPorId(req, res) {
        const { id } = req.params;
        const invitacion = await AccesoGaritaModel.obtenerPorId({ id: id });
        if (invitacion) return res.json(invitacion);
        res.status(404).json({ mensaje: 'Invitacion no encontrada.' });
    }

    // NUEVA FUNCIÓN: Validar el QR desde el teléfono del guardia
    static async validarQr(req, res) {
        try {
            const { qr } = req.params;
            const invitacion = await AccesoGaritaModel.validarQr({ codigoQr: qr });
            
            if (!invitacion) {
                return res.status(404).json({ mensaje: 'Código QR no encontrado o inválido.' });
            }
            res.json(invitacion);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al validar el QR en el servidor.' });
        }
    }

    static async crear(req, res) {
        const resultado = validarAccesoGarita(req.body);
        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        try {
            const nuevoAcceso = await AccesoGaritaModel.crear({
                datos: { ...resultado.data },
            });
            res.status(201).json(nuevoAcceso);
        } catch (error) {
            console.error('Error al registrar acceso:', error);
            
            // Atrapamos los errores de Oracle (Expirada o Desactivada)
            if (error.message && error.message.includes('RN-I5')) {
                return res.status(400).json({ mensaje: 'Esta invitación ya fue utilizada o desactivada.' });
            }
            if (error.message && error.message.includes('RN-I3')) {
                return res.status(400).json({ mensaje: 'Esta invitación ha expirado.' });
            }
            res.status(500).json({ mensaje: 'Error interno al registrar el acceso.' });
        }
    }

    static async actualizar(req, res) {
        const resultado = validarAccesoGaritaParcial(req.body);
        if (!resultado.success) {
            return res.status(400).json({ error: JSON.parse(resultado.error.message) });
        }

        const { id } = req.params;
        const accesoActualizado = await AccesoGaritaModel.actualizar({
            id,
            datos: resultado.data,
        });

        if (!accesoActualizado) return res.status(404).json({ mensaje: 'Acceso no encontrado.' });
        return res.json(accesoActualizado);
    }

    static async eliminar(req, res) {
        const { id } = req.params;
        const resultado = await AccesoGaritaModel.eliminar({ id });

        if (!resultado) return res.status(404).json({ mensaje: 'Acceso no encontrado.' });
        return res.json({ mensaje: 'Acceso eliminado.' });
    }
}