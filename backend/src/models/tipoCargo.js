import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    ID_TIPO_CARGO,
    NOMBRE,
    DESCRIPCION,
    MONTO,
    ES_MULTA,
    ACTIVO
  FROM TIPO_CARGO
`;

export class TipoCargoModel {
	static async obtenerTodos() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' ORDER BY ID_TIPO_CARGO',
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
				consultaBase + ' WHERE ID_TIPO_CARGO = :id',
				{ id },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorNombre({ nombre }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE NOMBRE = :nombre',
				{ nombre },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}

	static async crear({ datos }) {
		const conexion = await conectar();
		try {
			const { nombre, descripcion, monto, esMulta, activo } = datos;

			const resultado = await conexion.execute(
				`INSERT INTO TIPO_CARGO (NOMBRE, DESCRIPCION, MONTO, ES_MULTA, ACTIVO)
         VALUES (:nombre, :descripcion, :monto, :esMulta, :activo)
         RETURNING ID_TIPO_CARGO INTO :idTipoCargo`,
				{
					nombre,
					descripcion: descripcion ?? null,
					monto,
					esMulta,
					activo: activo ?? 1,
					idTipoCargo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);

			const nuevoId = resultado.outBinds.idTipoCargo[0];
			return TipoCargoModel.obtenerPorId({ id: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const camposPermitidos = {
				nombre: 'NOMBRE',
				descripcion: 'DESCRIPCION',
				monto: 'MONTO',
				esMulta: 'ES_MULTA',
				activo: 'ACTIVO',
			};

			const setCampos = [];
			const parametros = { id };

			for (const [nombreCampo, columnaOracle] of Object.entries(camposPermitidos)) {
				if (datos[nombreCampo] !== undefined) {
					setCampos.push(`${columnaOracle} = :${nombreCampo}`);
					parametros[nombreCampo] = datos[nombreCampo];
				}
			}

			if (setCampos.length === 0) return null;

			await conexion.execute(
				`UPDATE TIPO_CARGO SET ${setCampos.join(', ')} WHERE ID_TIPO_CARGO = :id`,
				parametros,
				{ autoCommit: true },
			);

			return TipoCargoModel.obtenerPorId({ id });
		} finally {
			await conexion.close();
		}
	}

	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM TIPO_CARGO WHERE ID_TIPO_CARGO = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
}