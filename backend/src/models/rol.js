import oracledb from 'oracledb'
import { conectar } from '../config/db.js'

export class RolModel {
  static async obtenerTodos () {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        `SELECT ID_ROL, NOMBRE, DESCRIPCION, ACTIVO
         FROM ROL
         ORDER BY ID_ROL`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
      return resultado.rows
    } finally {
      await conexion.close()
    }
  }

  static async obtenerPorId ({ id }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        `SELECT ID_ROL, NOMBRE, DESCRIPCION, ACTIVO
         FROM ROL
         WHERE ID_ROL = :id`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
      return resultado.rows[0] ?? null
    } finally {
      await conexion.close()
    }
  }

  static async obtenerPorNombre ({ nombre }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        `SELECT ID_ROL, NOMBRE, DESCRIPCION, ACTIVO
         FROM ROL
         WHERE NOMBRE = :nombre`,
        { nombre },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
      return resultado.rows[0] ?? null
    } finally {
      await conexion.close()
    }
  }
}
