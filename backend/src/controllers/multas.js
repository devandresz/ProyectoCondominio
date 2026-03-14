import { MultaModel } from '../models/multas.js';
import { validarMulta } from '../schemas/multas.js';

export class MultaController {
  static async obtenerTodos(req, res) {
    const multas = await MultaModel.obtenerTodos();
    res.json(multas);
  }

  static async obtenerPorId(req, res) {
    const { id } = req.params;
    const multa = await MultaModel.obtenerPorId({ id });

    if (!multa) {
      return res.status(404).json({ mensaje: 'Multa no encontrada.' });
    }

    return res.json(multa);
  }

  static async crear(req, res) {
    try {
      const resultado = validarMulta(req.body);

      if (!resultado.success) {
        return res.status(400).json({
          error: JSON.parse(resultado.error.message)
        });
      }

      const nuevaMulta = await MultaModel.crear({
        datos: { ...resultado.data }
      });

      return res.status(201).json(nuevaMulta);
    } catch (error) {
      console.error('Error en crear multa:', error);
      return res.status(500).json({
        mensaje: 'Error interno al crear multa',
        detalle: error.message
      });
    }
  }
}