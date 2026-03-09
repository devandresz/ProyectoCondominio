import { Router } from 'express'
import { TicketController } from '../controllers/tickets.js'
import { autenticacion } from '../middlewares/autenticacion.js'
import { verificarRol } from '../middlewares/permisos.js'

export const enrutadorTickets = Router()

// Todas las rutas requieren estar autenticado
enrutadorTickets.use(autenticacion)

// Solo el administrador puede crear, actualizar y eliminar tickets
enrutadorTickets.get('/',                  verificarRol('Administrador', 'Guardia', 'Colaborador'), TicketController.obtenerTodos)
enrutadorTickets.post('/',                 verificarRol('Administrador'),                           TicketController.crear)
enrutadorTickets.get('/:id',               verificarRol('Administrador', 'Guardia', 'Colaborador'), TicketController.obtenerPorId)
enrutadorTickets.patch('/:id',             verificarRol('Administrador'),                           TicketController.actualizar)
enrutadorTickets.delete('/:id',            verificarRol('Administrador'),                           TicketController.eliminar)
enrutadorTickets.get('/:id/historial',     verificarRol('Administrador', 'Guardia', 'Colaborador'), TicketController.obtenerHistorial)
