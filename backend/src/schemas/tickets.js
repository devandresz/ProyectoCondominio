import z from 'zod'

const esquemaTicket = z.object({
  idAsignadoA: z.number({
    required_error: 'El campo idAsignadoA es requerido.',
    invalid_type_error: 'idAsignadoA debe ser un número.'
  }).int().positive(),

  idPrioridad: z.number({
    required_error: 'El campo idPrioridad es requerido.',
    invalid_type_error: 'idPrioridad debe ser un número.'
  }).int().positive(),

  titulo: z.string({
    required_error: 'El título es requerido.',
    invalid_type_error: 'El título debe ser una cadena de texto.'
  }).min(1).max(150),

  descripcion: z.string({
    required_error: 'La descripción es requerida.',
    invalid_type_error: 'La descripción debe ser una cadena de texto.'
  }).min(1).max(1000),

  estado: z.enum(['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO', 'CANCELADO']).optional(),

  fechaLimite:  z.string().datetime({ offset: true }).optional().nullable(),
  fechaCierre:  z.string().datetime({ offset: true }).optional().nullable(),
  notasCierre:  z.string().max(500).optional().nullable()
})

export function validarTicket (entrada) {
  return esquemaTicket.safeParse(entrada)
}

export function validarTicketParcial (entrada) {
  return esquemaTicket.partial().safeParse(entrada)
}
