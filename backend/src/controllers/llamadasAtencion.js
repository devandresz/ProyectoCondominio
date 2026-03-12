import { LlamadasAtencionModel } from '../models/llamadasAtencion.js';
import {
	validarLlamadasAtencion,
	validarLlamadasAtencionParcial,
} from '../schemas/llamadasAtencion.js';

export class LlamadasAtencionController {
	static async obtenerTodos(req, res) {
		const llamadas = await LlamadasAtencionModel.obtenerTodos();
		res.json(llamadas);
	}

	static async obtenerPorId(req, res) {
		const { id } = req.params;
		const llamada = await LlamadasAtencionModel.obtenerPorId({ id: id });
		if (llamada) return res.json(llamada);
		res.status(404).json({ mensaje: 'Llamada de atención no encontrada.' });
	}

	static async crear(req, res) {
		const resultado = validarLlamadasAtencion(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const nuevaLlamada = await LlamadasAtencionModel.crear({
			datos: { ...resultado.data },
		});
		res.status(201).json(nuevaLlamada);
	}

	static async actualizar(req, res) {
		const resultado = validarLlamadasAtencionParcial(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const { id } = req.params;
		const llamadaActualizada = await LlamadasAtencionModel.actualizar({
			id,
			datos: resultado.data,
		});

		if (!llamadaActualizada)
			return res.status(404).json({ mensaje: 'Llamada de atención no encontrada.' });
		return res.json(llamadaActualizada);
	}

	static async eliminar(req, res) {
		const { id } = req.params;
		const resultado = await LlamadasAtencionModel.eliminar({ id });

		if (!resultado)
			return res.status(404).json({ mensaje: 'Llamada de atención no encontrada.' });
		return res.json({ mensaje: 'Llamada de atención eliminada.' });
	}
}
