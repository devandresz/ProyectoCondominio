import { UsuarioPropiedadModel } from '../models/usuarioPropiedad.js';
import {
	validarUsuarioPropiedad,
	validarUsuarioPropiedadParcial,
} from '../schemas/usuarioPropiedad.js';

export class UsuarioPropiedadController {
	static async obtenerTodos(req, res) {
		const up = await UsuarioPropiedadModel.obtenerTodos();
		res.json(up);
	}

	static async obtenerPorId(req, res) {
		const { numero } = req.params;
		const up = await UsuarioPropiedadModel.obtenerPorNumero({ numero });
		if (up) return res.json(up);
		res.status(404).json({ mensaje: 'No encontrado.' });
	}

	static async crear(req, res) {
		const resultado = validarUsuarioPropiedad(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const nuevoup = await UsuarioPropiedadModel.crear({
			datos: { ...resultado.data },
		});
		res.status(201).json(nuevoup);
	}

	static async actualizar(req, res) {
		const resultado = validarUsuarioPropiedadParcial(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const { id } = req.params;
		const upActualizado = await UsuarioPropiedadModel.actualizar({ id, datos: resultado.data });

		if (!upActualizado) return res.status(404).json({ mensaje: 'up no encontrado.' });
		return res.json(upActualizado);
	}

	static async eliminar(req, res) {
		const { id } = req.params;
		const resultado = await UsuarioPropiedadModel.eliminar({ id });

		if (!resultado) return res.status(404).json({ mensaje: 'up no encontrado.' });
		return res.json({ mensaje: 'up eliminado.' });
	}
}
