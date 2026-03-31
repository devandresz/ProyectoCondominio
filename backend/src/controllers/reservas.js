import { ReservaModel } from '../models/reserva.js';
import { validarReserva, validarCancelacion } from '../schemas/reservas.js';

export class ReservaController {
	// Obtener todas las reservas (solo Admin)
	static async obtenerTodas(req, res) {
		try {
			const reservas = await ReservaModel.obtenerTodas();
			res.json(reservas);
		} catch (error) {
			console.error('Error al obtener reservas:', error);
			res.status(500).json({ mensaje: 'Error al obtener las reservas.' });
		}
	}

	// Obtener reserva por ID
	static async obtenerPorId(req, res) {
		try {
			const { id } = req.params;
			const reserva = await ReservaModel.obtenerPorId({ id });

			if (!reserva) {
				return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
			}

			// Residente solo puede ver sus propias reservas
			if (req.usuario.ROL === 'Residente' && reserva.ID_USUARIO !== req.usuario.ID_USUARIO) {
				return res.status(403).json({ mensaje: 'No tienes permiso para ver esta reserva.' });
			}

			res.json(reserva);
		} catch (error) {
			console.error('Error al obtener reserva:', error);
			res.status(500).json({ mensaje: 'Error al obtener la reserva.' });
		}
	}

	// Obtener reservas del usuario autenticado
	static async obtenerMisReservas(req, res) {
		try {
			const reservas = await ReservaModel.obtenerPorUsuario({
				idUsuario: req.usuario.ID_USUARIO,
			});
			res.json(reservas);
		} catch (error) {
			console.error('Error al obtener reservas del usuario:', error);
			res.status(500).json({ mensaje: 'Error al obtener tus reservas.' });
		}
	}

	// Obtener áreas sociales disponibles
	static async obtenerAreas(req, res) {
		try {
			const areas = await ReservaModel.obtenerAreasDisponibles();
			res.json(areas);
		} catch (error) {
			console.error('Error al obtener áreas:', error);
			res.status(500).json({ mensaje: 'Error al obtener las áreas sociales.' });
		}
	}

	// Verificar disponibilidad de un área en fecha/hora específica
	static async verificarDisponibilidad(req, res) {
		try {
			const { idArea, fechaReserva, horaInicio, horaFin } = req.query;

			if (!idArea || !fechaReserva || !horaInicio || !horaFin) {
				return res.status(400).json({
					mensaje: 'Se requieren idArea, fechaReserva, horaInicio y horaFin.',
				});
			}

			const disponible = await ReservaModel.verificarDisponibilidad({
				idArea: Number(idArea),
				fechaReserva,
				horaInicio,
				horaFin,
			});

			res.json({ disponible });
		} catch (error) {
			console.error('Error al verificar disponibilidad:', error);
			res.status(500).json({ mensaje: 'Error al verificar disponibilidad.' });
		}
	}

	// Calcular costo de una reserva
	static async calcularCosto(req, res) {
		try {
			const { idArea, horaInicio, horaFin } = req.query;

			if (!idArea || !horaInicio || !horaFin) {
				return res.status(400).json({
					mensaje: 'Se requieren idArea, horaInicio y horaFin.',
				});
			}

			const costo = await ReservaModel.calcularCostoReserva({
				idArea: Number(idArea),
				horaInicio,
				horaFin,
			});

			res.json(costo);
		} catch (error) {
			console.error('Error al calcular costo:', error);
			res.status(500).json({ mensaje: error.message || 'Error al calcular el costo.' });
		}
	}

	// Crear nueva reserva
	static async crear(req, res) {
		try {
			// Validar datos de entrada
			const resultado = validarReserva(req.body);
			if (!resultado.success) {
				return res.status(400).json({ error: JSON.parse(resultado.error.message) });
			}

			const { idArea, fechaReserva, horaInicio, horaFin, numeroBoleta } = resultado.data;
			const idUsuario = req.usuario.ID_USUARIO;

			// 1. Verificar que el usuario tiene una propiedad vinculada
			const propiedad = await ReservaModel.obtenerPropiedadUsuario({ idUsuario });
			if (!propiedad) {
				return res.status(400).json({
					mensaje:
						'No tienes una propiedad vinculada. Solo usuarios con propiedad pueden reservar áreas.',
				});
			}

			// 2. Verificar que el usuario no tiene deudas (RN-R5)
			const verificacionDeudas = await ReservaModel.verificarUsuarioSinDeudas({ idUsuario });
			if (!verificacionDeudas.sinDeudas) {
				return res.status(400).json({
					mensaje: verificacionDeudas.mensaje,
				});
			}

			// 3. Verificar disponibilidad del área (RN-R3)
			const disponible = await ReservaModel.verificarDisponibilidad({
				idArea,
				fechaReserva,
				horaInicio,
				horaFin,
			});

			if (!disponible) {
				return res.status(409).json({
					mensaje: 'El área ya está reservada en ese horario.',
				});
			}

			// 4. Calcular costo de la reserva
			const { costoTotal } = await ReservaModel.calcularCostoReserva({
				idArea,
				horaInicio,
				horaFin,
			});

			// 5. Crear reserva con pago (transacción completa)
			const nuevaReserva = await ReservaModel.crearConPago({
				datos: {
					idUsuario,
					idArea,
					fechaReserva,
					horaInicio,
					horaFin,
					numeroBoleta,
					montoTotal: costoTotal,
					idPropiedad: propiedad?.ID_PROPIEDAD,
				},
			});

			res.status(201).json(nuevaReserva);
		} catch (error) {
			console.error('Error al crear reserva:', error);

			// Manejo específico de errores de Oracle (triggers)
			if (error.message.includes('ORA-20005')) {
				return res.status(400).json({
					mensaje: 'No puede reservar mientras tenga cargos pendientes de pago.',
				});
			}

			if (error.message.includes('ORA-20006')) {
				return res.status(403).json({
					mensaje: 'Usuario inactivo. No puede realizar reservas.',
				});
			}

			if (error.message.includes('ORA-20007')) {
				return res.status(409).json({
					mensaje: 'El área ya está reservada en ese horario.',
				});
			}

			res.status(500).json({ mensaje: error.message || 'Error al crear la reserva.' });
		}
	}

	// Cancelar reserva (solo Administrador)
	static async cancelar(req, res) {
		try {
			const { id } = req.params;
			const resultado = validarCancelacion(req.body);

			if (!resultado.success) {
				return res.status(400).json({ error: JSON.parse(resultado.error.message) });
			}

			const { motivo } = resultado.data;

			const reservaCancelada = await ReservaModel.cancelar({
				id,
				idAdmin: req.usuario.ID_USUARIO,
				motivo,
			});

			res.json(reservaCancelada);
		} catch (error) {
			console.error('Error al cancelar reserva:', error);

			if (error.message.includes('no encontrada')) {
				return res.status(404).json({ mensaje: error.message });
			}

			if (error.message.includes('ya está cancelada')) {
				return res.status(400).json({ mensaje: error.message });
			}

			res.status(500).json({ mensaje: 'Error al cancelar la reserva.' });
		}
	}

	// Obtener historial de cancelaciones de una reserva
	static async obtenerHistorialCancelaciones(req, res) {
		try {
			const { id } = req.params;

			const historial = await ReservaModel.obtenerHistorialCancelaciones({
				idReserva: id,
			});

			res.json(historial);
		} catch (error) {
			console.error('Error al obtener historial de cancelaciones:', error);
			res.status(500).json({ mensaje: 'Error al obtener el historial de cancelaciones.' });
		}
	}
}
