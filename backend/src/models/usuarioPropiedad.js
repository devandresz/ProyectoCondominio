import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    ID_USUARIO_PROPIEDAD,
    ID_USUARIO,
    ID_PROPIEDAD,
    TIPO_VINCULO,
    FECHA_INICIO,
    FECHA_FIN,
    ACTIVO
    FROM USUARIO_PROPIEDAD
`;

export class UsuarioPropiedadModel {
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
				consultaBase + ' WHERE ID_USUARIO_PROPIEDAD = :numero',
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
			const { idUsuario, idPropiedad, tipoVinculo, fechaFin } = datos;
			const resultado = await conexion.execute(
				`INSERT INTO USUARIO_PROPIEDAD
                (ID_USUARIO, ID_PROPIEDAD, TIPO_VINCULO, FECHA_FIN) 
                VALUES
                (:idUsuario, :idPropiedad, :tipoVinculo, :fechaFin)
                RETURNING ID_USUARIO_PROPIEDAD INTO :idUsuarioPropiedad`,
				{
					idUsuario,
					idPropiedad,
					tipoVinculo,
					fechaFin,
					idUsuarioPropiedad: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);
			const nuevoId = resultado.outBinds.idUsuarioPropiedad[0];
			return UsuarioPropiedadModel.obtenerPorNumero({ numero: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const camposPermitidos = {
				idUsuario: 'ID_USUARIO',
				idPropiedad: 'ID_PROPIEDAD',
				tipoVinculo: 'TIPO_VINCULO',
				fechaFin: 'FECHA_FIN',
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
				`UPDATE USUARIO_PROPIEDAD SET ${setCampos.join(', ')} WHERE ID_USUARIO_PROPIEDAD = :id`,
				parametros,
				{ autoCommit: true },
			);

			return UsuarioPropiedadModel.obtenerPorNumero({ numero: id });
		} finally {
			await conexion.close();
		}
	}

	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM USUARIO_PROPIEDAD WHERE ID_USUARIO_PROPIEDAD = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
}
