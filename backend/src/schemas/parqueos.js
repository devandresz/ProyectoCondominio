import z from 'zod';

const esquemaParqueo = z.object({
	idPropiedad: z
		.number({
			required_error: 'El campo idPropiedad es requerido.',
			invalid_type_error: 'idPropiedad debe ser un número.',
		})
		.int()
		.positive(),

	numeroParqueo: z
		.string({
			required_error: 'El campo numeroParqueo es requerido.',
			invalid_type_error: 'numeroParqueo debe ser alfanumerico.',
		})
		.min(1)
		.max(20),

	descripcion: z
		.string({
			invalid_type_error: 'La descripcion debe ser una cadena de texto.',
		})
		.min(1)
		.max(200),

	activo: z
		.number({
			required_error: 'La propiedad activa es requerida.',
			invalid_type_error: 'La propiedad activa debe ser un número.',
		})
		.int(),
});

export function validarParqueo(entrada) {
	return esquemaParqueo.safeParse(entrada);
}

export function validarParqueoParcial(entrada) {
	return esquemaParqueo.partial().safeParse(entrada);
}
