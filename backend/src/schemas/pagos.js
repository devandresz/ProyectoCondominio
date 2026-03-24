import z from 'zod';

const esquemaPago = z.object({
	idPropiedad: z
		.number({
			required_error: 'El ID de la propiedad es requerido.',
			invalid_type_error: 'El ID de la propiedad debe ser un número.',
		})
		.int()
		.positive(),

	numeroBoleta: z
		.string({
			required_error: 'El número de boleta es requerido.',
			invalid_type_error: 'El número de boleta debe ser una cadena de texto.',
		})
		.min(1, { message: 'El número de boleta no puede estar vacío' })
		.max(100, { message: 'El número de boleta no puede exceder 100 caracteres' }),

	observaciones: z
		.string({
			invalid_type_error: 'Las observaciones deben ser una cadena de texto.',
		})
		.max(300, { message: 'Las observaciones no pueden exceder 300 caracteres' })
		.optional()
		.nullable(),
});

export function validarPago(entrada) {
	return esquemaPago.safeParse(entrada);
}
