import oracledb from 'oracledb'
import { conectar } from '../config/db.js'

const consultaBase = `
  SELECT
    u.ID_USUARIO,
    u.NOMBRE,
    u.APELLIDO,
    u.CORREO,
    u.CONTRASENA_HASH,
    u.TELEFONO,
    u.ACTIVO,
    u.FECHA_CREACION,
    r.ID_ROL,
    r.NOMBRE AS ROL
  FROM USUARIO u
  JOIN ROL r ON u.ID_ROL = r.ID_ROL
`

export class UsuarioModel {
  static async obtenerTodos () {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        consultaBase + ' ORDER BY u.ID_USUARIO',
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
        consultaBase + ' WHERE u.ID_USUARIO = :id',
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
      return resultado.rows[0] ?? null
    } finally {
      await conexion.close()
    }
  }

  static async obtenerPorCorreo ({ correo }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        consultaBase + ' WHERE u.CORREO = :correo',
        { correo },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
      return resultado.rows[0] ?? null
    } finally {
      await conexion.close()
    }
  }

  static async crear ({ datos }) {
    const conexion = await conectar()
    try {
      const { idRol, nombre, apellido, correo, contrasenaHash, telefono } = datos

      const resultado = await conexion.execute(
        `INSERT INTO USUARIO (ID_ROL, NOMBRE, APELLIDO, CORREO, CONTRASENA_HASH, TELEFONO)
         VALUES (:idRol, :nombre, :apellido, :correo, :contrasenaHash, :telefono)
         RETURNING ID_USUARIO INTO :idUsuario`,
        {
          idRol,
          nombre,
          apellido,
          correo,
          contrasenaHash,
          telefono: telefono ?? null,
          idUsuario: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true }
      )

      const nuevoId = resultado.outBinds.idUsuario[0]
      return UsuarioModel.obtenerPorId({ id: nuevoId })
    } finally {
      await conexion.close()
    }
  }

  static async actualizar ({ id, datos }) {
    const conexion = await conectar()
    try {
      const camposPermitidos = {
        idRol:          'ID_ROL',
        nombre:         'NOMBRE',
        apellido:       'APELLIDO',
        correo:         'CORREO',
        contrasenaHash: 'CONTRASENA_HASH',
        telefono:       'TELEFONO',
        activo:         'ACTIVO'
      }

      const setCampos = []
      const parametros = { id }

      for (const [claveCamel, columnaOracle] of Object.entries(camposPermitidos)) {
        if (datos[claveCamel] !== undefined) {
          setCampos.push(`${columnaOracle} = :${claveCamel}`)
          parametros[claveCamel] = datos[claveCamel]
        }
      }

      if (setCampos.length === 0) return null

      await conexion.execute(
        `UPDATE USUARIO SET ${setCampos.join(', ')} WHERE ID_USUARIO = :id`,
        parametros,
        { autoCommit: true }
      )

      return UsuarioModel.obtenerPorId({ id })
    } finally {
      await conexion.close()
    }
  }

  static async eliminar ({ id }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        'DELETE FROM USUARIO WHERE ID_USUARIO = :id',
        { id },
        { autoCommit: true }
      )
      return resultado.rowsAffected > 0
    } finally {
      await conexion.close()
    }
  }
}
