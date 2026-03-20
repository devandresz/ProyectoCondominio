import { TipoCargoModel } from '../models/tipoCargo.js';
import { validarTipoCargo, validarTipoCargoParcial } from '../schemas/tiposCargo.js';

export class TipoCargoController {
	static async obtenerTodos(req, res) {
		const tiposCargo = await TipoCargoModel.obtenerTodos();
		res.json(tiposCargo);
	}

	static async obtenerPorId(req, res) {
		const { id } = req.params;

		const tipoCargo = await TipoCargoModel.obtenerPorId({ id });
		if (!tipoCargo) {
			return res.status(404).json({ mensaje: 'Tipo de cargo no encontrado.' });
		}

		res.json(tipoCargo);
	}

	static async crear(req, res) {
		const resultado = validarTipoCargo(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const existeNombre = await TipoCargoModel.obtenerPorNombre({
			nombre: resultado.data.nombre,
		});

		if (existeNombre) {
			return res.status(409).json({ mensaje: 'Ya existe un tipo de cargo con ese nombre.' });
		}

		const nuevoTipoCargo = await TipoCargoModel.crear({
			datos: resultado.data,
		});

		res.status(201).json(nuevoTipoCargo);
	}

	static async actualizar(req, res) {
		const resultado = validarTipoCargoParcial(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const { id } = req.params;

		if (resultado.data.nombre) {
			const existente = await TipoCargoModel.obtenerPorNombre({
				nombre: resultado.data.nombre,
			});

			if (existente && existente.ID_TIPO_CARGO !== Number(id)) {
				return res.status(409).json({ mensaje: 'Ya existe otro tipo de cargo con ese nombre.' });
			}
		}

		const tipoCargoActualizado = await TipoCargoModel.actualizar({
			id,
			datos: resultado.data,
		});

		if (!tipoCargoActualizado) {
			return res.status(404).json({ mensaje: 'Tipo de cargo no encontrado.' });
		}

		return res.json(tipoCargoActualizado);
	}

	static async desactivar(req, res) {
		const { id } = req.params;

		const tipoCargo = await TipoCargoModel.obtenerPorId({ id });
		if (!tipoCargo) {
			return res.status(404).json({ mensaje: 'Tipo de cargo no encontrado.' });
		}

		const tipoCargoActualizado = await TipoCargoModel.actualizar({
			id,
			datos: { activo: 0 },
		});

		return res.json(tipoCargoActualizado);
	}
}