import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    r.ID_RESERVA,
    r.ID_USUARIO,
    r.ID_AREA,
    r.ID_PAGO,
    r.FECHA_RESERVA,
    r.HORA_INICIO,
    r.HORA_FIN,
    r.ESTADO,
    r.FECHA_CREACION,
    u.NOMBRE || ' ' || u.APELLIDO AS NOMBRE_USUARIO,
    a.NOMBRE AS NOMBRE_AREA,
    a.PRECIO_POR_HORA,
    p.NUMERO_BOLETA,
    p.MONTO_TOTAL AS MONTO_PAGADO
  FROM RESERVA r
  JOIN USUARIO u ON r.ID_USUARIO = u.ID_USUARIO
  JOIN AREA_SOCIAL a ON r.ID_AREA = a.ID_AREA
  JOIN PAGO p ON r.ID_PAGO = p.ID_PAGO
`;

export class ReservaModel {
	static async obtenerTodas() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' ORDER BY r.FECHA_RESERVA DESC, r.HORA_INICIO DESC',
				{},
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorId({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE r.ID_RESERVA = :id',
				{ id },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorUsuario({ idUsuario }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase +
					' WHERE r.ID_USUARIO = :idUsuario ORDER BY r.FECHA_RESERVA DESC, r.HORA_INICIO DESC',
				{ idUsuario },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerAreasDisponibles() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT 
          ID_AREA,
          NOMBRE,
          DESCRIPCION,
          HORA_APERTURA,
          HORA_CIERRE,
          PRECIO_POR_HORA,
          ACTIVO
        FROM AREA_SOCIAL
        WHERE ACTIVO = 1
        ORDER BY NOMBRE`,
				{},
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async verificarDisponibilidad({ idArea, fechaReserva, horaInicio, horaFin }) {
		const conexion = await conectar();
		try {
			// Verificar conflictos de horario
			const resultado = await conexion.execute(
				`SELECT COUNT(*) AS CONFLICTOS
        FROM RESERVA
        WHERE ID_AREA = :idArea
          AND FECHA_RESERVA = TO_DATE(:fechaReserva, 'YYYY-MM-DD')
          AND ESTADO = 'APARTADA'
          AND :horaInicio < HORA_FIN
          AND :horaFin > HORA_INICIO`,
				{ idArea, fechaReserva, horaInicio, horaFin },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			return resultado.rows[0].CONFLICTOS === 0;
		} finally {
			await conexion.close();
		}
	}

	static async verificarUsuarioSinDeudas({ idUsuario }) {
		const conexion = await conectar();
		try {
			// Obtener propiedad del usuario
			const resultadoPropiedad = await conexion.execute(
				`SELECT ID_PROPIEDAD
        FROM USUARIO_PROPIEDAD
        WHERE ID_USUARIO = :idUsuario
          AND ACTIVO = 1
          AND ROWNUM = 1`,
				{ idUsuario },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			if (resultadoPropiedad.rows.length === 0) {
				return { sinDeudas: true, mensaje: 'Usuario sin propiedad vinculada' };
			}

			const idPropiedad = resultadoPropiedad.rows[0].ID_PROPIEDAD;

			// Verificar deudas pendientes
			const resultadoDeudas = await conexion.execute(
				`SELECT COUNT(*) AS DEUDAS
        FROM CARGO
        WHERE ID_PROPIEDAD = :idPropiedad
          AND ESTADO = 'PENDIENTE'`,
				{ idPropiedad },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			const tieneDeudas = resultadoDeudas.rows[0].DEUDAS > 0;

			return {
				sinDeudas: !tieneDeudas,
				mensaje: tieneDeudas ? 'El usuario tiene cargos pendientes de pago' : null,
			};
		} finally {
			await conexion.close();
		}
	}

	static async calcularCostoReserva({ idArea, horaInicio, horaFin }) {
		const conexion = await conectar();
		try {
			// Obtener precio por hora del área
			const resultado = await conexion.execute(
				`SELECT PRECIO_POR_HORA
        FROM AREA_SOCIAL
        WHERE ID_AREA = :idArea`,
				{ idArea },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			if (resultado.rows.length === 0) {
				throw new Error('Área social no encontrada');
			}

			const precioPorHora = resultado.rows[0].PRECIO_POR_HORA;

			// Calcular horas de diferencia
			const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
			const [horaFinH, horaFinM] = horaFin.split(':').map(Number);

			const minutosInicio = horaInicioH * 60 + horaInicioM;
			const minutosFin = horaFinH * 60 + horaFinM;
			const diferenciaMinutos = minutosFin - minutosInicio;

			if (diferenciaMinutos <= 0) {
				throw new Error('La hora de fin debe ser posterior a la hora de inicio');
			}

			const horas = diferenciaMinutos / 60;
			const costoTotal = precioPorHora * horas;

			return {
				precioPorHora,
				horas,
				costoTotal,
			};
		} finally {
			await conexion.close();
		}
	}

	static async crearConPago({ datos }) {
		const conexion = await conectar();
		try {
			// Iniciar transacción
			const {
				idUsuario,
				idArea,
				fechaReserva,
				horaInicio,
				horaFin,
				numeroBoleta,
				montoTotal,
				idPropiedad,
			} = datos;

			// 1. Crear el PAGO primero
			const resultadoPago = await conexion.execute(
				`INSERT INTO PAGO (ID_PROPIEDAD, ID_USUARIO, NUMERO_BOLETA, MONTO_TOTAL, FECHA_PAGO)
         VALUES (:idPropiedad, :idUsuario, :numeroBoleta, :montoTotal, SYSDATE)
         RETURNING ID_PAGO INTO :idPago`,
				{
					idPropiedad,
					idUsuario,
					numeroBoleta,
					montoTotal,
					idPago: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
			);

			const idPago = resultadoPago.outBinds.idPago[0];

			// 2. Obtener el id_tipo_cargo para "Reserva de área"
			const resultadoTipoCargo = await conexion.execute(
				`SELECT ID_TIPO_CARGO
         FROM TIPO_CARGO
         WHERE NOMBRE = 'Reserva de área'
           AND ROWNUM = 1`,
				{},
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			if (resultadoTipoCargo.rows.length === 0) {
				throw new Error('Tipo de cargo "Reserva de área" no encontrado en la base de datos');
			}

			const idTipoCargo = resultadoTipoCargo.rows[0].ID_TIPO_CARGO;

			// 3. Crear el CARGO por la reserva
			const resultadoCargo = await conexion.execute(
				`INSERT INTO CARGO (ID_PROPIEDAD, ID_TIPO_CARGO, MONTO, DESCRIPCION, ESTADO, FECHA_EMISION)
         VALUES (:idPropiedad, :idTipoCargo, :monto, :descripcion, 'PENDIENTE', SYSDATE)
         RETURNING ID_CARGO INTO :idCargo`,
				{
					idPropiedad,
					idTipoCargo,
					monto: montoTotal,
					descripcion: `Reserva de área - ${fechaReserva} ${horaInicio}-${horaFin}`,
					idCargo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
			);

			const idCargo = resultadoCargo.outBinds.idCargo[0];

			// 4. Crear el PAGO_DETALLE que vincula el pago con el cargo
			await conexion.execute(
				`INSERT INTO PAGO_DETALLE (ID_PAGO, ID_CARGO, MONTO_APLICADO)
         VALUES (:idPago, :idCargo, :montoAplicado)`,
				{
					idPago,
					idCargo,
					montoAplicado: montoTotal,
				},
			);

			// 5. Finalmente crear la RESERVA
			const resultadoReserva = await conexion.execute(
				`INSERT INTO RESERVA (ID_USUARIO, ID_AREA, ID_PAGO, FECHA_RESERVA, HORA_INICIO, HORA_FIN)
         VALUES (:idUsuario, :idArea, :idPago, TO_DATE(:fechaReserva, 'YYYY-MM-DD'), :horaInicio, :horaFin)
         RETURNING ID_RESERVA INTO :idReserva`,
				{
					idUsuario,
					idArea,
					idPago,
					fechaReserva,
					horaInicio,
					horaFin,
					idReserva: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
			);

			const idReserva = resultadoReserva.outBinds.idReserva[0];

			// Confirmar transacción
			await conexion.commit();

			// Retornar la reserva creada
			return this.obtenerPorId({ id: idReserva });
		} catch (error) {
			await conexion.rollback();
			throw error;
		} finally {
			await conexion.close();
		}
	}

	static async cancelar({ id, idAdmin, motivo }) {
		const conexion = await conectar();
		try {
			// Verificar que la reserva existe y está APARTADA
			const reserva = await this.obtenerPorId({ id });
			if (!reserva) {
				throw new Error('Reserva no encontrada');
			}

			if (reserva.ESTADO === 'CANCELADA') {
				throw new Error('La reserva ya está cancelada');
			}

			// Actualizar estado de la reserva
			await conexion.execute(`UPDATE RESERVA SET ESTADO = 'CANCELADA' WHERE ID_RESERVA = :id`, {
				id,
			});

			// Crear registro de auditoría
			await conexion.execute(
				`INSERT INTO AUDITORIA_RESERVA (ID_RESERVA, ID_ADMIN, MOTIVO)
         VALUES (:idReserva, :idAdmin, :motivo)`,
				{
					idReserva: id,
					idAdmin,
					motivo: motivo || 'Cancelación administrativa',
				},
			);

			await conexion.commit();

			return this.obtenerPorId({ id });
		} catch (error) {
			await conexion.rollback();
			throw error;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerHistorialCancelaciones({ idReserva }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT 
          ar.ID_AUDITORIA,
          ar.ID_RESERVA,
          ar.ID_ADMIN,
          u.NOMBRE || ' ' || u.APELLIDO AS NOMBRE_ADMIN,
          ar.MOTIVO,
          ar.FECHA_ACCION
        FROM AUDITORIA_RESERVA ar
        JOIN USUARIO u ON ar.ID_ADMIN = u.ID_USUARIO
        WHERE ar.ID_RESERVA = :idReserva
        ORDER BY ar.FECHA_ACCION DESC`,
				{ idReserva },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPropiedadUsuario({ idUsuario }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT 
          up.ID_PROPIEDAD,
          p.NUMERO_PROPIEDAD,
          up.TIPO_VINCULO
        FROM USUARIO_PROPIEDAD up
        JOIN PROPIEDAD p ON up.ID_PROPIEDAD = p.ID_PROPIEDAD
        WHERE up.ID_USUARIO = :idUsuario
          AND up.ACTIVO = 1
          AND ROWNUM = 1`,
				{ idUsuario },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}
}
