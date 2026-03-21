import { CargosFinancierosModel } from '../models/cargosFinancieros.js';
import { validarIdPropiedad } from '../schemas/cargosFinancieros.js';

export class CargosFinancierosController {
  static async obtenerPorPropiedad(req, res) {
    try {
      const validacion = validarIdPropiedad(req.params);

      if (!validacion.success) {
        return res.status(400).json({
          error: 'ID de propiedad inválido',
          detalles: validacion.error.flatten(),
        });
      }

      const { idPropiedad } = validacion.data;

      const datos = await CargosFinancierosModel.obtenerPorPropiedad(idPropiedad);

      return res.json(datos);
    } catch (error) {
      console.error('Error al obtener cargos financieros:', error);
      return res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
}