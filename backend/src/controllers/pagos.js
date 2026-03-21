import { PagoModel } from '../models/pago.js';
import { validarPago } from '../schemas/pagos.js';

export class PagoController {
	// Obtener todos los pagos (solo Admin)
	static async obtenerTodos(req, res) {
		try {
			const pagos = await PagoModel.obtenerTodos();
			res.json(pagos);
		} catch (error) {
			console.error('Error al obtener pagos:', error);
			res.status(500).json({ mensaje: 'Error al obtener los pagos.' });
		}
	}

	// Obtener pago por ID
	static async obtenerPorId(req, res) {
		try {
			const { id } = req.params;
			const pago = await PagoModel.obtenerPorId({ id });

			if (!pago) {
				return res.status(404).json({ mensaje: 'Pago no encontrado.' });
			}

			// Residente solo puede ver pagos de su propiedad
			if (req.usuario.ROL === 'Residente') {
				const propiedad = await PagoModel.obtenerPropiedadUsuario({
					idUsuario: req.usuario.ID_USUARIO,
				});

				if (!propiedad || propiedad.ID_PROPIEDAD !== pago.ID_PROPIEDAD) {
					return res.status(403).json({ mensaje: 'No tienes permiso para ver este pago.' });
				}
			}

			// Obtener detalles del pago
			const detalles = await PagoModel.obtenerDetallePago({ idPago: id });

			res.json({
				...pago,
				detalles,
			});
		} catch (error) {
			console.error('Error al obtener pago:', error);
			res.status(500).json({ mensaje: 'Error al obtener el pago.' });
		}
	}

	// Obtener pagos del usuario autenticado (de su propiedad)
	static async obtenerMisPagos(req, res) {
		try {
			const propiedad = await PagoModel.obtenerPropiedadUsuario({
				idUsuario: req.usuario.ID_USUARIO,
			});

			if (!propiedad) {
				return res.json([]);
			}

			const pagos = await PagoModel.obtenerPorPropiedad({
				idPropiedad: propiedad.ID_PROPIEDAD,
			});

			res.json(pagos);
		} catch (error) {
			console.error('Error al obtener pagos del usuario:', error);
			res.status(500).json({ mensaje: 'Error al obtener tus pagos.' });
		}
	}

	// Obtener estado de cuenta (cargos pendientes + resumen)
	static async obtenerEstadoCuenta(req, res) {
		try {
			let idPropiedad;

			// Si es Admin y viene idPropiedad en query, usar ese
			if (req.usuario.ROL === 'Administrador' && req.query.idPropiedad) {
				idPropiedad = Number(req.query.idPropiedad);
			} else {
				// Si es Residente, obtener su propiedad
				const propiedad = await PagoModel.obtenerPropiedadUsuario({
					idUsuario: req.usuario.ID_USUARIO,
				});

				if (!propiedad) {
					return res.status(400).json({
						mensaje: 'No tienes una propiedad vinculada.',
					});
				}

				idPropiedad = propiedad.ID_PROPIEDAD;
			}

			const estadoCuenta = await PagoModel.obtenerEstadoCuenta({ idPropiedad });

			res.json(estadoCuenta);
		} catch (error) {
			console.error('Error al obtener estado de cuenta:', error);
			res.status(500).json({ mensaje: 'Error al obtener el estado de cuenta.' });
		}
	}

	// Obtener historial completo de pagos (con detalles)
	static async obtenerHistorialCompleto(req, res) {
		try {
			let idPropiedad;

			// Si es Admin y viene idPropiedad en query, usar ese
			if (req.usuario.ROL === 'Administrador' && req.query.idPropiedad) {
				idPropiedad = Number(req.query.idPropiedad);
			} else {
				// Si es Residente, obtener su propiedad
				const propiedad = await PagoModel.obtenerPropiedadUsuario({
					idUsuario: req.usuario.ID_USUARIO,
				});

				if (!propiedad) {
					return res.status(400).json({
						mensaje: 'No tienes una propiedad vinculada.',
					});
				}

				idPropiedad = propiedad.ID_PROPIEDAD;
			}

			const historial = await PagoModel.obtenerHistorialCompleto({ idPropiedad });

			res.json(historial);
		} catch (error) {
			console.error('Error al obtener historial de pagos:', error);
			res.status(500).json({ mensaje: 'Error al obtener el historial de pagos.' });
		}
	}

	// Crear nuevo pago
	static async crear(req, res) {
		try {
			// Validar datos de entrada
			const resultado = validarPago(req.body);
			if (!resultado.success) {
				return res.status(400).json({ error: JSON.parse(resultado.error.message) });
			}

			const { idPropiedad, numeroBoleta, observaciones } = resultado.data;
			const idUsuario = req.usuario.ID_USUARIO;

			// 1. Verificar vinculación (RN-F4) — Admin puede pagar cualquier propiedad
			if (req.usuario.ROL !== 'Administrador') {
				const vinculado = await PagoModel.verificarVinculacion({ idUsuario, idPropiedad });

				if (!vinculado) {
					return res.status(403).json({
						mensaje:
							'No estás vinculado a esta propiedad. Solo usuarios vinculados pueden registrar pagos.',
					});
				}
			}

			// 2. Verificar que hay cargos pendientes
			const estadoCuenta = await PagoModel.obtenerEstadoCuenta({ idPropiedad });

			if (estadoCuenta.cantidadCargosPendientes === 0) {
				return res.status(400).json({
					mensaje: 'No hay cargos pendientes para esta propiedad.',
				});
			}

			// 3. Crear pago con todos los cargos pendientes (RN-F7)
			const nuevoPago = await PagoModel.crear({
				datos: {
					idUsuario,
					idPropiedad,
					numeroBoleta,
					observaciones,
				},
			});

			// 4. Obtener detalles del pago creado
			const detalles = await PagoModel.obtenerDetallePago({ idPago: nuevoPago.ID_PAGO });

			res.status(201).json({
				...nuevoPago,
				detalles,
			});
		} catch (error) {
			console.error('Error al crear pago:', error);

			// Manejo específico de errores de Oracle (triggers)
			if (error.message.includes('ORA-20003')) {
				return res.status(403).json({
					mensaje: 'Solo usuarios vinculados a la propiedad pueden registrar pagos.',
				});
			}

			if (error.message.includes('ORA-20004')) {
				return res.status(400).json({
					mensaje: 'El pago debe incluir todos los cargos pendientes de la propiedad.',
				});
			}

			if (error.message.includes('unique constraint')) {
				return res.status(409).json({
					mensaje: 'El número de boleta ya está registrado.',
				});
			}

			if (error.message.includes('No hay cargos pendientes')) {
				return res.status(400).json({ mensaje: error.message });
			}

			res.status(500).json({ mensaje: error.message || 'Error al crear el pago.' });
		}
	}
}
