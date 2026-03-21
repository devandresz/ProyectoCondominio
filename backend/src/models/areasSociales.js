import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

export class AreasSocialesModel {
  static async obtenerTodas() {
    const conexion = await conectar();

    try {
      const resultado = await conexion.execute(
        `
        SELECT
          id_area,
          nombre,
          descripcion,
          hora_apertura,
          hora_cierre,
          precio_por_hora,
          activo
        FROM AREA_SOCIAL
        ORDER BY id_area
        `,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return resultado.rows;
    } finally {
      await conexion.close();
    }
  }

  static async actualizar({ id, datos }) {
    const conexion = await conectar();

    try {
      await conexion.execute(
        `
        UPDATE AREA_SOCIAL
        SET
          nombre = :nombre,
          descripcion = :descripcion,
          hora_apertura = :hora_apertura,
          hora_cierre = :hora_cierre,
          precio_por_hora = :precio_por_hora,
          activo = :activo
        WHERE id_area = :id
        `,
        {
          id,
          nombre: datos.nombre,
          descripcion: datos.descripcion ?? null,
          hora_apertura: datos.hora_apertura,
          hora_cierre: datos.hora_cierre,
          precio_por_hora: datos.precio_por_hora,
          activo: datos.activo,
        },
        { autoCommit: true }
      );

      return { id, ...datos };
    } finally {
      await conexion.close();
    }
  }

  static async cambiarEstado({ id, activo }) {
    const conexion = await conectar();

    try {
      await conexion.execute(
        `
        UPDATE AREA_SOCIAL
        SET activo = :activo
        WHERE id_area = :id
        `,
        { id, activo },
        { autoCommit: true }
      );

      return { id, activo };
    } finally {
      await conexion.close();
    }
  }
}