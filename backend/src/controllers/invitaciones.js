import { InvitacionModel } from '../models/invitacion.js';
import crypto from 'crypto'; // Para generar códigos únicos

export const invitacionesController = {
    obtenerTodas: async (req, res) => {
        try {
            const invitaciones = await InvitacionModel.obtenerTodas();
            res.json(invitaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    },

    crear: async (req, res) => {
        try {
            const { idUsuario, idTipo, nombreVisitante } = req.body;
            
            // 1. Generar un Token único para el QR
            const codigoQrUnico = `QR-COND-${crypto.randomUUID().substring(0, 8).toUpperCase()}-${Date.now()}`;

            // 2. Calcular fecha de expiración según la regla de negocio
            let fechaExpiracion = null; // Asumimos 'Servicio' por defecto (no expira)
            
            if (idTipo === 1) { // 1 es 'Normal' en tu base de datos
                const hoy = new Date();
                hoy.setHours(23, 59, 59, 999); // Expira a las 23:59 de hoy
                fechaExpiracion = hoy.toISOString();
            }

            const nuevaInvitacion = await InvitacionModel.crear({
                datos: {
                    idUsuario,
                    idTipo,
                    nombreVisitante,
                    codigoQr: codigoQrUnico,
                    fechaExpiracion
                }
            });

            res.status(201).json(nuevaInvitacion);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al generar la invitación' });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const invitacionActualizada = await InvitacionModel.actualizar({ id, datos: req.body });
            
            if (!invitacionActualizada) return res.status(404).json({ mensaje: 'Invitación no encontrada' });
            res.json(invitacionActualizada);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al actualizar la invitación' });
        }
    }
};