import z from 'zod';

const esquemaUP = z.object({
	idUsuario: z
		.number({
			required_error: 'El campo idUsuario es requerido.',
			invalid_type_error: 'idUsuario debe ser un número.',
		})
		.int()
		.positive(),

	idPropiedad: z
		.number({
			required_error: 'El campo idPropiedad es requerido.',
			invalid_type_error: 'idPropiedad debe ser un número.',
		})
		.int()
		.positive(),

	tipoVinculo: z
		.string({
			required_error: 'El campo tipoVinculo es requerido.',
			invalid_type_error: 'tipoVinculo debe ser alfanumerico.',
		})
		.min(1)
		.max(20),

	fechaFin: z.string(),
});

export function validarUsuarioPropiedad(entrada) {
	return esquemaUP.safeParse(entrada);
}

export function validarUsuarioPropiedadParcial(entrada) {
	return esquemaUP.partial().safeParse(entrada);
}
