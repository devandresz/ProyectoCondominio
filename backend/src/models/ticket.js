import oracledb from 'oracledb'
import { conectar } from '../config/db.js'

const consultaBase = `
  SELECT
    t.ID_TICKET,
    t.TITULO,
    t.DESCRIPCION,
    t.ESTADO,
    t.FECHA_CREACION,
    t.FECHA_LIMITE,
    t.FECHA_CIERRE,
    t.NOTAS_CIERRE,
    p.ID_PRIORIDAD,
    p.NOMBRE        AS PRIORIDAD,
    a.ID_USUARIO    AS ID_ASIGNADO_A,
    a.NOMBRE  || ' ' || a.APELLIDO AS ASIGNADO_A,
    e.ID_USUARIO    AS ID_ASIGNADO_POR,
    e.NOMBRE  || ' ' || e.APELLIDO AS ASIGNADO_POR
  FROM TICKET t
  JOIN PRIORIDAD_TICKET p ON t.ID_PRIORIDAD    = p.ID_PRIORIDAD
  JOIN USUARIO a          ON t.ID_ASIGNADO_A   = a.ID_USUARIO
  JOIN USUARIO e          ON t.ID_ASIGNADO_POR = e.ID_USUARIO
`

export class TicketModel {
  static async obtenerTodos ({ estado, idAsignadoA } = {}) {
    const conexion = await conectar()
    try {
      let consulta = consultaBase + ' WHERE 1=1'
      const parametros = {}

      if (estado) {
        consulta += ' AND t.ESTADO = :estado'
        parametros.estado = estado.toUpperCase()
      }

      if (idAsignadoA) {
        consulta += ' AND t.ID_ASIGNADO_A = :idAsignadoA'
        parametros.idAsignadoA = idAsignadoA
      }

      consulta += ' ORDER BY t.FECHA_CREACION DESC'

      const resultado = await conexion.execute(consulta, parametros, { outFormat: oracledb.OUT_FORMAT_OBJECT })
      return resultado.rows
    } finally {
      await conexion.close()
    }
  }

  static async obtenerPorId ({ id }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        consultaBase + ' WHERE t.ID_TICKET = :id',
        { id },
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
      const { idAsignadoA, idAsignadoPor, idPrioridad, titulo, descripcion, fechaLimite } = datos

      const resultado = await conexion.execute(
        `INSERT INTO TICKET
          (ID_ASIGNADO_A, ID_ASIGNADO_POR, ID_PRIORIDAD, TITULO, DESCRIPCION, FECHA_LIMITE)
        VALUES
          (:idAsignadoA, :idAsignadoPor, :idPrioridad, :titulo, :descripcion, :fechaLimite)
        RETURNING ID_TICKET INTO :idTicket`,
        {
          idAsignadoA,
          idAsignadoPor,
          idPrioridad,
          titulo,
          descripcion,
          fechaLimite: fechaLimite ? new Date(fechaLimite) : null,
          idTicket: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true }
      )

      const nuevoId = resultado.outBinds.idTicket[0]
      return TicketModel.obtenerPorId({ id: nuevoId })
    } finally {
      await conexion.close()
    }
  }

  static async actualizar ({ id, datos }) {
    const conexion = await conectar()
    try {
      const camposPermitidos = {
        idPrioridad: 'ID_PRIORIDAD',
        titulo:      'TITULO',
        descripcion: 'DESCRIPCION',
        estado:      'ESTADO',
        fechaLimite: 'FECHA_LIMITE',
        fechaCierre: 'FECHA_CIERRE',
        notasCierre: 'NOTAS_CIERRE'
      }

      const setCampos = []
      const parametros = { id }

      for (const [claveCamel, columnaOracle] of Object.entries(camposPermitidos)) {
        if (datos[claveCamel] !== undefined) {
          setCampos.push(`${columnaOracle} = :${claveCamel}`)
          const esFecha = claveCamel.startsWith('fecha')
          parametros[claveCamel] = esFecha && datos[claveCamel]
            ? new Date(datos[claveCamel])
            : datos[claveCamel]
        }
      }

      if (setCampos.length === 0) return null

      await conexion.execute(
        `UPDATE TICKET SET ${setCampos.join(', ')} WHERE ID_TICKET = :id`,
        parametros,
        { autoCommit: true }
      )

      return TicketModel.obtenerPorId({ id })
    } finally {
      await conexion.close()
    }
  }

  static async eliminar ({ id }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        'DELETE FROM TICKET WHERE ID_TICKET = :id',
        { id },
        { autoCommit: true }
      )
      return resultado.rowsAffected > 0
    } finally {
      await conexion.close()
    }
  }

  static async obtenerHistorial ({ id }) {
    const conexion = await conectar()
    try {
      const resultado = await conexion.execute(
        `SELECT
          h.ID_HISTORIAL,
          h.ESTADO_ANTERIOR,
          h.ESTADO_NUEVO,
          h.COMENTARIO,
          h.FECHA_CAMBIO,
          u.NOMBRE || ' ' || u.APELLIDO AS MODIFICADO_POR
        FROM TICKET_HISTORIAL h
        JOIN USUARIO u ON h.ID_USUARIO = u.ID_USUARIO
        WHERE h.ID_TICKET = :id
        ORDER BY h.FECHA_CAMBIO ASC`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
      return resultado.rows
    } finally {
      await conexion.close()
    }
  }
}
