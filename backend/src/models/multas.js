import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
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
  JOIN TIPO_CARGO tc
    ON c.ID_TIPO_CARGO = tc.ID_TIPO_CARGO
  WHERE tc.ES_MULTA = 1
`;

export class MultaModel {
  static async obtenerTodos() {
    const conexion = await conectar();

    try {
      const resultado = await conexion.execute(
        consultaBase + ' ORDER BY c.FECHA_EMISION DESC',
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
        consultaBase + ' AND c.ID_CARGO = :id',
        { id },
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
      const { idPropiedad, idTipoCargo, monto, descripcion, estado } = datos;

      const resultado = await conexion.execute(
        `INSERT INTO CARGO
          (ID_PROPIEDAD, ID_TIPO_CARGO, MONTO, DESCRIPCION, ESTADO, FECHA_EMISION)
         VALUES
          (:idPropiedad, :idTipoCargo, :monto, :descripcion, :estado, SYSDATE)
         RETURNING ID_CARGO INTO :idCargo`,
        {
          idPropiedad,
          idTipoCargo,
          monto,
          descripcion,
          estado,
          idCargo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true }
      );

      const nuevoId = resultado.outBinds.idCargo[0];

      return MultaModel.obtenerPorId({ id: nuevoId });
    } finally {
      await conexion.close();
    }
  }
}