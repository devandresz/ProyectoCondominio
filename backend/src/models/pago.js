import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBasePago = `
  SELECT
    p.ID_PAGO,
    p.ID_PROPIEDAD,
    p.ID_USUARIO,
    p.NUMERO_BOLETA,
    p.MONTO_TOTAL,
    p.FECHA_PAGO,
    p.OBSERVACIONES,
    u.NOMBRE || ' ' || u.APELLIDO AS NOMBRE_USUARIO,
    prop.NUMERO_PROPIEDAD
  FROM PAGO p
  JOIN USUARIO u ON p.ID_USUARIO = u.ID_USUARIO
  JOIN PROPIEDAD prop ON p.ID_PROPIEDAD = prop.ID_PROPIEDAD
`;

const consultaBaseCargo = `
  SELECT
    c.ID_CARGO,
    c.ID_PROPIEDAD,
    c.ID_TIPO_CARGO,
    c.MONTO,
    c.DESCRIPCION,
    c.ESTADO,
    c.FECHA_EMISION,
    c.FECHA_VENCIMIENTO,
    tc.NOMBRE AS TIPO_CARGO,
    tc.ES_MULTA
  FROM CARGO c
  JOIN TIPO_CARGO tc ON c.ID_TIPO_CARGO = tc.ID_TIPO_CARGO
`;

export class PagoModel {
	static async obtenerTodos() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBasePago + ' ORDER BY p.FECHA_PAGO DESC',
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
				consultaBasePago + ' WHERE p.ID_PAGO = :id',
				{ id },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorPropiedad({ idPropiedad }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBasePago + ' WHERE p.ID_PROPIEDAD = :idPropiedad ORDER BY p.FECHA_PAGO DESC',
				{ idPropiedad },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorUsuario({ idUsuario }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBasePago + ' WHERE p.ID_USUARIO = :idUsuario ORDER BY p.FECHA_PAGO DESC',
				{ idUsuario },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerDetallePago({ idPago }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT
          pd.ID_DETALLE,
          pd.ID_PAGO,
          pd.ID_CARGO,
          pd.MONTO_APLICADO,
          c.DESCRIPCION AS DESCRIPCION_CARGO,
          tc.NOMBRE AS TIPO_CARGO,
          c.FECHA_EMISION
        FROM PAGO_DETALLE pd
        JOIN CARGO c ON pd.ID_CARGO = c.ID_CARGO
        JOIN TIPO_CARGO tc ON c.ID_TIPO_CARGO = tc.ID_TIPO_CARGO
        WHERE pd.ID_PAGO = :idPago
        ORDER BY c.FECHA_EMISION`,
				{ idPago },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	// Obtener todos los cargos pendientes de una propiedad (RN-F7)
	static async obtenerCargosPendientes({ idPropiedad }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBaseCargo +
					` WHERE c.ID_PROPIEDAD = :idPropiedad
           AND c.ESTADO = 'PENDIENTE'
          ORDER BY c.FECHA_EMISION`,
				{ idPropiedad },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	// Obtener estado de cuenta de una propiedad
	static async obtenerEstadoCuenta({ idPropiedad }) {
		const conexion = await conectar();
		try {
			// Cargos pendientes
			const pendientes = await this.obtenerCargosPendientes({ idPropiedad });

			// Total adeudado
			const totalPendiente = pendientes.reduce((sum, cargo) => sum + cargo.MONTO, 0);

			// Último pago
			const ultimoPago = await conexion.execute(
				`SELECT
          p.ID_PAGO,
          p.NUMERO_BOLETA,
          p.MONTO_TOTAL,
          p.FECHA_PAGO
        FROM PAGO p
        WHERE p.ID_PROPIEDAD = :idPropiedad
        ORDER BY p.FECHA_PAGO DESC
        FETCH FIRST 1 ROW ONLY`,
				{ idPropiedad },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			return {
				cargosPendientes: pendientes,
				totalPendiente,
				cantidadCargosPendientes: pendientes.length,
				ultimoPago: ultimoPago.rows[0] ?? null,
			};
		} finally {
			await conexion.close();
		}
	}

	// Verificar que usuario está vinculado a la propiedad
	static async verificarVinculacion({ idUsuario, idPropiedad }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT COUNT(*) AS VINCULADO
        FROM USUARIO_PROPIEDAD
        WHERE ID_USUARIO = :idUsuario
          AND ID_PROPIEDAD = :idPropiedad
          AND ACTIVO = 1`,
				{ idUsuario, idPropiedad },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			return resultado.rows[0].VINCULADO > 0;
		} finally {
			await conexion.close();
		}
	}

	// Crear pago completo (PAGO + PAGO_DETALLE para todos los cargos pendientes)
	static async crear({ datos }) {
		const conexion = await conectar();
		try {
			const { idUsuario, idPropiedad, numeroBoleta, observaciones } = datos;

			// 1. Obtener todos los cargos pendientes
			const cargosPendientes = await this.obtenerCargosPendientes({ idPropiedad });

			if (cargosPendientes.length === 0) {
				throw new Error('No hay cargos pendientes para esta propiedad.');
			}

			// 2. Calcular monto total
			const montoTotal = cargosPendientes.reduce((sum, cargo) => sum + cargo.MONTO, 0);

			// 3. Crear el PAGO
			const resultadoPago = await conexion.execute(
				`INSERT INTO PAGO (ID_PROPIEDAD, ID_USUARIO, NUMERO_BOLETA, MONTO_TOTAL, OBSERVACIONES)
         VALUES (:idPropiedad, :idUsuario, :numeroBoleta, :montoTotal, :observaciones)
         RETURNING ID_PAGO INTO :idPago`,
				{
					idPropiedad,
					idUsuario,
					numeroBoleta,
					montoTotal,
					observaciones: observaciones ?? null,
					idPago: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
			);

			const idPago = resultadoPago.outBinds.idPago[0];

			// 4. Crear PAGO_DETALLE para cada cargo pendiente
			for (const cargo of cargosPendientes) {
				await conexion.execute(
					`INSERT INTO PAGO_DETALLE (ID_PAGO, ID_CARGO, MONTO_APLICADO)
           VALUES (:idPago, :idCargo, :montoAplicado)`,
					{
						idPago,
						idCargo: cargo.ID_CARGO,
						montoAplicado: cargo.MONTO,
					},
				);
			}

			// 5. Confirmar transacción
			await conexion.commit();

			// 6. Retornar el pago creado con sus detalles
			return this.obtenerPorId({ id: idPago });
		} catch (error) {
			await conexion.rollback();
			throw error;
		} finally {
			await conexion.close();
		}
	}

	// Obtener propiedad de un usuario
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

	// Obtener historial de pagos de una propiedad con detalles
	static async obtenerHistorialCompleto({ idPropiedad }) {
		const conexion = await conectar();
		try {
			const pagos = await this.obtenerPorPropiedad({ idPropiedad });

			// Para cada pago, obtener sus detalles
			const pagosConDetalle = await Promise.all(
				pagos.map(async (pago) => {
					const detalles = await this.obtenerDetallePago({ idPago: pago.ID_PAGO });
					return {
						...pago,
						detalles,
					};
				}),
			);

			return pagosConDetalle;
		} finally {
			await conexion.close();
		}
	}
}
