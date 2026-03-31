import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

export class CargosFinancierosModel {
  static async obtenerPorPropiedad(idPropiedad) {
    const conexion = await conectar();

    try {
      const resultado = await conexion.execute(
        `
        SELECT
        c.id_cargo,
        TO_CHAR(c.fecha_emision, 'YYYY-MM') AS PERIODO,
        c.descripcion,
        c.monto,
        c.estado,
        TO_CHAR(c.fecha_vencimiento, 'YYYY-MM-DD') AS FECHA_VENCIMIENTO
        FROM CARGO c
        WHERE c.id_propiedad = :idPropiedad
        ORDER BY c.fecha_emision DESC
        `,
        { idPropiedad },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return resultado.rows;
    } finally {
      await conexion.close();
    }
  }
}