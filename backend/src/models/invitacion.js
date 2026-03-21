import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    i.ID_INVITACION,
    i.ID_USUARIO,
    u.NOMBRE || ' ' || u.APELLIDO AS NOMBRE_RESIDENTE,
    i.ID_TIPO,
    ti.NOMBRE AS TIPO_INVITACION,
    i.NOMBRE_VISITANTE,
    i.CODIGO_QR,
    i.FECHA_GENERACION,
    i.FECHA_EXPIRACION,
    i.ACTIVO
  FROM INVITACION i
  JOIN USUARIO u ON i.ID_USUARIO = u.ID_USUARIO
  JOIN TIPO_INVITACION ti ON i.ID_TIPO = ti.ID_TIPO
`;

export class InvitacionModel {
    static async obtenerTodas() {
        const conexion = await conectar();
        try {
            const resultado = await conexion.execute(
                consultaBase + ' ORDER BY i.FECHA_GENERACION DESC', 
                {}, 
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
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
                consultaBase + ' WHERE i.ID_INVITACION = :id',
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
            const { idUsuario, idTipo, nombreVisitante, codigoQr, fechaExpiracion } = datos;
            
            const resultado = await conexion.execute(
                `INSERT INTO INVITACION
                (ID_USUARIO, ID_TIPO, NOMBRE_VISITANTE, CODIGO_QR, FECHA_EXPIRACION, ACTIVO) 
                VALUES
                (:idUsuario, :idTipo, :nombreVisitante, :codigoQr, :fechaExpiracion, 1)
                RETURNING ID_INVITACION INTO :idInvitacion`,
                {
                    idUsuario,
                    idTipo,
                    nombreVisitante,
                    codigoQr,
                    fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion) : null,
                    idInvitacion: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                },
                { autoCommit: true },
            );
            const nuevoId = resultado.outBinds.idInvitacion[0];
            return InvitacionModel.obtenerPorId({ id: nuevoId });
        } finally {
            await conexion.close();
        }
    }

    static async actualizar({ id, datos }) {
        const conexion = await conectar();
        try {
            // Solo permitimos desactivar/activar, no editar el nombre o el QR por seguridad
            if (datos.activo === undefined) return null;

            await conexion.execute(
                `UPDATE INVITACION SET ACTIVO = :activo WHERE ID_INVITACION = :id`,
                { activo: datos.activo, id },
                { autoCommit: true },
            );
            return InvitacionModel.obtenerPorId({ id });
        } finally {
            await conexion.close();
        }
    }
}