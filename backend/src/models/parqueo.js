import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    p.ID_PARQUEO,
    p.ID_PROPIEDAD,
    p.NUMERO_PARQUEO,
    p.DESCRIPCION,
    p.ACTIVO,
	pr.NUMERO_PROPIEDAD
	FROM PARQUEO p JOIN PROPIEDAD pr ON p.ID_PROPIEDAD = pr.ID_PROPIEDAD
`;

export class ParqueoModel {
	static async obtenerTodos() {
		const conexion = await conectar();
		try {
			const parametros = {};

			const resultado = await conexion.execute(consultaBase, parametros, {
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			});
			return resultado.rows;
		} catch (error) {
			console.error('Error al obtener todos los parqueos:', error);
			throw error;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorNumero({ numero }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE p.ID_PARQUEO = :numero',
				{ numero },
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
			const { idPropiedad, numeroParqueo, descripcion, activo } = datos;
			const resultado = await conexion.execute(
				`INSERT INTO PARQUEO
				(ID_PROPIEDAD, NUMERO_PARQUEO, DESCRIPCION, ACTIVO) 
				VALUES
				(:idPropiedad, :numeroParqueo, :descripcion, :activo)
				RETURNING ID_PARQUEO INTO :idParqueo`,
				{
					idPropiedad,
					numeroParqueo,
					descripcion,
					activo,
					idParqueo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);
			const nuevoId = resultado.outBinds.idParqueo[0];
			return ParqueoModel.obtenerPorNumero({ numero: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const camposPermitidos = {
				idPropiedad: 'ID_PROPIEDAD',
				numeroParqueo: 'NUMERO_PARQUEO',
				descripcion: 'DESCRIPCION',
				activo: 'ACTIVO',
			};

			const setCampos = [];
			const parametros = { id };

			for (const [claveCamel, columnaOracle] of Object.entries(camposPermitidos)) {
				if (datos[claveCamel] !== undefined) {
					setCampos.push(`${columnaOracle} = :${claveCamel}`);
					const esFecha = claveCamel.startsWith('fecha');
					parametros[claveCamel] =
						esFecha && datos[claveCamel] ? new Date(datos[claveCamel]) : datos[claveCamel];
				}
			}

			if (setCampos.length === 0) return null;

			await conexion.execute(
				`UPDATE PARQUEO SET ${setCampos.join(', ')} WHERE ID_PARQUEO = :id`,
				parametros,
				{ autoCommit: true },
			);

			return ParqueoModel.obtenerPorNumero({ numero: id });
		} finally {
			await conexion.close();
		}
	}

	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM PARQUEO WHERE ID_PARQUEO = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
}
