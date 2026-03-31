import { AreasSocialesModel } from '../models/areasSociales.js';
import {
  validarAreaSocial,
  validarEstadoArea,
  validarIdArea,
} from '../schemas/areasSociales.js';

export class AreasSocialesController {
  static async obtenerTodas(req, res) {
    try {
      const data = await AreasSocialesModel.obtenerTodas();
      return res.json(data);
    } catch (error) {
      console.error('Error al obtener áreas sociales:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async actualizar(req, res) {
    try {
      const validacionId = validarIdArea(req.params);
      const validacionBody = validarAreaSocial(req.body);

      if (!validacionId.success) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      if (!validacionBody.success) {
        return res.status(400).json({
          error: 'Datos inválidos',
          detalles: validacionBody.error.flatten(),
        });
      }

      const actualizada = await AreasSocialesModel.actualizar({
        id: validacionId.data.id,
        datos: validacionBody.data,
      });

      return res.json(actualizada);
    } catch (error) {
      console.error('Error al actualizar área social:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async cambiarEstado(req, res) {
    try {
      const validacionId = validarIdArea(req.params);
      const validacionEstado = validarEstadoArea(req.body);

      if (!validacionId.success) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      if (!validacionEstado.success) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      const resultado = await AreasSocialesModel.cambiarEstado({
        id: validacionId.data.id,
        activo: validacionEstado.data.activo,
      });

      return res.json(resultado);
    } catch (error) {
      console.error('Error al cambiar estado de área social:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}