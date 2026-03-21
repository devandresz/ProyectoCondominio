import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    p.ID_PROPIEDAD,
    p.ID_CATEGORIA,
    c.NOMBRE AS CATEGORIA_NOMBRE,
    c.MAX_PARQUEOS,
    c.CUOTA_MENSUAL,
    p.NUMERO_PROPIEDAD,
    p.DESCRIPCION,
    p.ACTIVO,
    p.FECHA_REGISTRO
  FROM PROPIEDAD p
  JOIN CATEGORIA_PROPIEDAD c ON p.ID_CATEGORIA = c.ID_CATEGORIA
`;

export class PropiedadModel {
    static async obtenerTodas() {
        const conexion = await conectar();
        try {
            const resultado = await conexion.execute(consultaBase, {}, {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            });
            return resultado.rows;
        } catch (error) {
            console.error('Error al obtener todas las propiedades:', error);
            throw error;
        } finally {
            await conexion.close();
        }
    }

    static async obtenerPorId({ id }) {
        const conexion = await conectar();
        try {
            const resultado = await conexion.execute(
                consultaBase + ' WHERE p.ID_PROPIEDAD = :id',
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
            const { idCategoria, numeroPropiedad, descripcion, activo = 1 } = datos;
            const resultado = await conexion.execute(
                `INSERT INTO PROPIEDAD
                (ID_CATEGORIA, NUMERO_PROPIEDAD, DESCRIPCION, ACTIVO) 
                VALUES
                (:idCategoria, :numeroPropiedad, :descripcion, :activo)
                RETURNING ID_PROPIEDAD INTO :idPropiedad`,
                {
                    idCategoria,
                    numeroPropiedad,
                    descripcion,
                    activo,
                    idPropiedad: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                },
                { autoCommit: true },
            );
            const nuevoId = resultado.outBinds.idPropiedad[0];
            return PropiedadModel.obtenerPorId({ id: nuevoId });
        } finally {
            await conexion.close();
        }
    }

    static async actualizar({ id, datos }) {
        const conexion = await conectar();
        try {
            const camposPermitidos = {
                idCategoria: 'ID_CATEGORIA',
                numeroPropiedad: 'NUMERO_PROPIEDAD',
                descripcion: 'DESCRIPCION',
                activo: 'ACTIVO',
            };

            const setCampos = [];
            const parametros = { id };

            for (const [claveCamel, columnaOracle] of Object.entries(camposPermitidos)) {
                if (datos[claveCamel] !== undefined) {
                    setCampos.push(`${columnaOracle} = :${claveCamel}`);
                    parametros[claveCamel] = datos[claveCamel];
                }
            }

            if (setCampos.length === 0) return null;

            await conexion.execute(
                `UPDATE PROPIEDAD SET ${setCampos.join(', ')} WHERE ID_PROPIEDAD = :id`,
                parametros,
                { autoCommit: true },
            );

            return PropiedadModel.obtenerPorId({ id });
        } finally {
            await conexion.close();
        }
    }
}