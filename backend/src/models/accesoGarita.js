import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    ac.ID_ACCESO,
    ac.ID_GUARDIA,
    ac.TIPO_DOCUMENTO,
    ac.NUMERO_DOCUMENTO,
    ac.NOMBRE_COMPLETO_REAL,
    ac.HORA_INGRESO,
    ac.OBSERVACIONES,
    i.ID_USUARIO,
    i.ID_TIPO,
    i.NOMBRE_VISITANTE,
    i.FECHA_GENERACION,
    i.FECHA_EXPIRACION,
    i.ACTIVO
    FROM ACCESO_VISITANTE ac JOIN INVITACION i ON ac.ID_INVITACION = i.ID_INVITACION
`;

export class AccesoGaritaModel {
    static async obtenerTodos() {
        const conexion = await conectar();
        try {
            const parametros = {};
            const resultado = await conexion.execute(consultaBase, parametros, {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            });
            return resultado.rows;
        } catch (error) {
            console.error('Error al obtener todas las invitaciones:', error);
            throw error;
        } finally {
            await conexion.close();
        }
    }

    static async obtenerPorId({ id }) {
        const conexion = await conectar();
        try {
            const resultado = await conexion.execute(
                consultaBase + ' WHERE ac.ID_ACCESO = :id',
                { id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT },
            );
            return resultado.rows;
        } finally {
            await conexion.close();
        }
    }

    // NUEVO MÉTODO: Para que el Guardia busque el QR escaneado
    static async validarQr({ codigoQr }) {
        const conexion = await conectar();
        try {
            const resultado = await conexion.execute(
                `SELECT i.ID_INVITACION, i.NOMBRE_VISITANTE, ti.NOMBRE AS TIPO, i.ACTIVO, i.FECHA_EXPIRACION
                 FROM INVITACION i
                 JOIN TIPO_INVITACION ti ON i.ID_TIPO = ti.ID_TIPO
                 WHERE i.CODIGO_QR = :codigoQr`,
                { codigoQr },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return resultado.rows[0] ?? null;
        } finally {
            await conexion.close();
        }
    }

    static async crear({ datos }) {
        const conexion = await conectar();
        try {
            const {
                idInvitacion,
                idGuardia,
                tipoDocumento,
                numeroDocumento,
                nombreCompletoReal,
                observaciones,
            } = datos;

            const resultado = await conexion.execute(
                `INSERT INTO ACCESO_VISITANTE (ID_INVITACION, ID_GUARDIA, TIPO_DOCUMENTO, NUMERO_DOCUMENTO, NOMBRE_COMPLETO_REAL, OBSERVACIONES) 
                 VALUES(:idInvitacion, :idGuardia, :tipoDocumento, :numeroDocumento, :nombreCompletoReal, :observaciones) 
                 RETURNING ID_ACCESO INTO :idAcceso`,
                {
                    idInvitacion,
                    idGuardia,
                    tipoDocumento,
                    numeroDocumento,
                    nombreCompletoReal,
                    observaciones,
                    idAcceso: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                },
                { autoCommit: true },
            );
            const nuevoId = resultado.outBinds.idAcceso[0];
            return AccesoGaritaModel.obtenerPorId({ id: nuevoId });
        } finally {
            await conexion.close();
        }
    }

    static async actualizar({ id, datos }) {
        const conexion = await conectar();
        try {
            const camposPermitidos = {
                tipoDocumento: 'TIPO_DOCUMENTO',
                numeroDocumento: 'NUMERO_DOCUMENTO',
                nombreCompletoReal: 'NOMBRE_COMPLETO_REAL',
                observaciones: 'OBSERVACIONES',
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
                `UPDATE ACCESO_VISITANTE SET ${setCampos.join(', ')} WHERE ID_ACCESO = :id`,
                parametros,
                { autoCommit: true },
            );

            return AccesoGaritaModel.obtenerPorId({ id: id });
        } finally {
            await conexion.close();
        }
    }

    static async eliminar({ id }) {
        const conexion = await conectar();
        try {
            const resultado = await conexion.execute(
                'DELETE FROM ACCESO_VISITANTE WHERE ID_ACCESO = :id',
                { id },
                { autoCommit: true },
            );
            return resultado.rowsAffected > 0;
        } finally {
            await conexion.close();
        }
    }
}