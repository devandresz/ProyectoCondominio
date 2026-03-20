import z from 'zod';

const tipoCargoSchema = z.object({
	nombre: z
		.string({
			invalid_type_error: 'El nombre debe ser texto.',
			required_error: 'El nombre es obligatorio.',
		})
		.min(1, 'El nombre es obligatorio.')
		.max(50, 'El nombre no puede exceder 50 caracteres.'),

	descripcion: z
		.string({
			invalid_type_error: 'La descripción debe ser texto.',
		})
		.max(200, 'La descripción no puede exceder 200 caracteres.')
		.optional()
		.or(z.literal('')),

	monto: z
		.number({
			invalid_type_error: 'El monto debe ser numérico.',
			required_error: 'El monto es obligatorio.',
		})
		.min(0, 'El monto no puede ser negativo.'),

	esMulta: z
		.number({
			invalid_type_error: 'esMulta debe ser 0 o 1.',
			required_error: 'esMulta es obligatorio.',
		})
		.refine((valor) => valor === 0 || valor === 1, {
			message: 'esMulta debe ser 0 o 1.',
		}),

	activo: z
		.number({
			invalid_type_error: 'activo debe ser 0 o 1.',
		})
		.refine((valor) => valor === 0 || valor === 1, {
			message: 'activo debe ser 0 o 1.',
		})
		.optional(),
});

export function validarTipoCargo(input) {
	return tipoCargoSchema.safeParse(input);
}

export function validarTipoCargoParcial(input) {
	return tipoCargoSchema.partial().safeParse(input);
}