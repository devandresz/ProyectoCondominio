import oracledb from 'oracledb';
import { conectar } from '../config/db.js';
import { ca } from 'zod/v4/locales';

const consultaBase = `
  SELECT
    la.ID_LLAMADO,
    la.ID_PROPIEDAD,
    la.ID_ADMIN,
    la.ID_TIPO_CARGO,
    la.DESCRIPCION,
    la.FECHA_EMISION
    FROM LLAMADO_ATENCION la
`;

export class LlamadasAtencionModel {
	static async obtenerTodos() {
		const conexion = await conectar();
		try {
			const parametros = {};

			const resultado = await conexion.execute(consultaBase, parametros, {
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			});
			return resultado.rows;
		} catch (error) {
			console.error('Error al obtener todas las llamadas de atencion:', error);
			throw error;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorId({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE la.ID_LLAMADO = :id',
				{ id },
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
			const { idPropiedad, idAdmin, idTipoCargo, descripcion } = datos;
			const resultado = await conexion.execute(
				`INSERT INTO LLAMADO_ATENCION
                (ID_PROPIEDAD, ID_ADMIN, ID_TIPO_CARGO, DESCRIPCION) 
                VALUES
                (:idPropiedad, :idAdmin, :idTipoCargo, :descripcion)
                RETURNING ID_LLAMADO INTO :idLlamado`,
				{
					idPropiedad,
					idAdmin,
					idTipoCargo,
					descripcion,
					idLlamado: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);
			const nuevoId = resultado.outBinds.idLlamado[0];
			return LlamadasAtencionModel.obtenerPorId({ id: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const camposPermitidos = {
				idPropiedad: 'ID_PROPIEDAD',
				idAdmin: 'ID_ADMIN',
				idTipoCargo: 'ID_TIPO_CARGO',
				descripcion: 'DESCRIPCION',
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
				`UPDATE LLAMADO_ATENCION SET ${setCampos.join(', ')} WHERE ID_LLAMADO = :id`,
				parametros,
				{ autoCommit: true },
			);

			return LlamadasAtencionModel.obtenerPorId({ id: id });
		} finally {
			await conexion.close();
		}
	}

	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM LLAMADO_ATENCION WHERE ID_LLAMADO = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
}
