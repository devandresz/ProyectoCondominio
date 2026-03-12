import z from 'zod';

const esquemaLlamadasAtencion = z.object({
	idPropiedad: z
		.number({
			required_error: 'El campo idPropiedad es requerido.',
			invalid_type_error: 'idPropiedad debe ser un número.',
		})
		.int()
		.positive(),

	idAdmin: z
		.number({
			required_error: 'El campo idAdmin es requerido.',
			invalid_type_error: 'idAdmin debe ser un numero.',
		})
		.int()
		.positive(),

	idTipoCargo: z
		.number({
			required_error: 'El campo idTipoCargo es requerido.',
			invalid_type_error: 'idTipoCargo debe ser un número.',
		})
		.int()
		.positive(),

	descripcion: z
		.string({
			required_error: 'La descripcion es requerida.',
			invalid_type_error: 'La descripcion debe ser una cadena de texto.',
		})
		.min(2)
		.max(500),

	estado: z.enum(['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO', 'CANCELADO']).optional(),
});

export function validarLlamadasAtencion(entrada) {
	return esquemaLlamadasAtencion.safeParse(entrada);
}

export function validarLlamadasAtencionParcial(entrada) {
	return esquemaLlamadasAtencion.partial().safeParse(entrada);
}
