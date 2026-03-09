import { TicketModel } from '../models/ticket.js'
import { validarTicket, validarTicketParcial } from '../schemas/tickets.js'

export class TicketController {
  static async obtenerTodos (req, res) {
    const { estado, idAsignadoA } = req.query
    const tickets = await TicketModel.obtenerTodos({ estado, idAsignadoA })
    res.json(tickets)
  }

  static async obtenerPorId (req, res) {
    const { id } = req.params
    const ticket = await TicketModel.obtenerPorId({ id })
    if (ticket) return res.json(ticket)
    res.status(404).json({ mensaje: 'Ticket no encontrado.' })
  }

  static async obtenerHistorial (req, res) {
    const { id } = req.params
    const ticket = await TicketModel.obtenerPorId({ id })
    if (!ticket) return res.status(404).json({ mensaje: 'Ticket no encontrado.' })

    const historial = await TicketModel.obtenerHistorial({ id })
    res.json(historial)
  }

  static async crear (req, res) {
    const resultado = validarTicket(req.body)
    if (!resultado.success) {
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    // idAsignadoPor se obtiene de la sesión, no del body (RN-AU2)
    const idAsignadoPor = req.usuario.ID_USUARIO

    const nuevoTicket = await TicketModel.crear({
      datos: { ...resultado.data, idAsignadoPor }
    })
    res.status(201).json(nuevoTicket)
  }

  static async actualizar (req, res) {
    const resultado = validarTicketParcial(req.body)
    if (!resultado.success) {
      return res.status(400).json({ error: JSON.parse(resultado.error.message) })
    }

    const { id } = req.params
    const ticketActualizado = await TicketModel.actualizar({ id, datos: resultado.data })

    if (!ticketActualizado) return res.status(404).json({ mensaje: 'Ticket no encontrado.' })
    return res.json(ticketActualizado)
  }

  static async eliminar (req, res) {
    const { id } = req.params
    const resultado = await TicketModel.eliminar({ id })

    if (!resultado) return res.status(404).json({ mensaje: 'Ticket no encontrado.' })
    return res.json({ mensaje: 'Ticket eliminado.' })
  }
}
