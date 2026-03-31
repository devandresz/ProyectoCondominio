import z from 'zod';

const esquemaReserva = z.object({
	idArea: z
		.number({
			required_error: 'El ID del área es requerido.',
			invalid_type_error: 'El ID del área debe ser un número.',
		})
		.int()
		.positive(),

	fechaReserva: z
		.string({
			required_error: 'La fecha de reserva es requerida.',
			invalid_type_error: 'La fecha debe ser una cadena de texto.',
		})
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: 'La fecha debe estar en formato YYYY-MM-DD',
		})
		.refine(
			(fecha) => {
				const fechaReserva = new Date(fecha);
				const hoy = new Date();
				hoy.setHours(0, 0, 0, 0);
				return fechaReserva >= hoy;
			},
			{ message: 'La fecha de reserva no puede ser anterior a hoy' },
		),

	horaInicio: z
		.string({
			required_error: 'La hora de inicio es requerida.',
			invalid_type_error: 'La hora de inicio debe ser una cadena de texto.',
		})
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
			message: 'La hora de inicio debe estar en formato HH:MM (24 horas)',
		}),

	horaFin: z
		.string({
			required_error: 'La hora de fin es requerida.',
			invalid_type_error: 'La hora de fin debe ser una cadena de texto.',
		})
		.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
			message: 'La hora de fin debe estar en formato HH:MM (24 horas)',
		}),

	numeroBoleta: z
		.string({
			required_error: 'El número de boleta es requerido.',
			invalid_type_error: 'El número de boleta debe ser una cadena de texto.',
		})
		.min(1, { message: 'El número de boleta no puede estar vacío' })
		.max(100),
});

// Validación adicional: hora_fin > hora_inicio
const esquemaReservaConValidacionHorario = esquemaReserva.refine(
	(data) => {
		const [horaInicioH, horaInicioM] = data.horaInicio.split(':').map(Number);
		const [horaFinH, horaFinM] = data.horaFin.split(':').map(Number);

		const minutosInicio = horaInicioH * 60 + horaInicioM;
		const minutosFin = horaFinH * 60 + horaFinM;

		return minutosFin > minutosInicio;
	},
	{
		message: 'La hora de fin debe ser posterior a la hora de inicio',
		path: ['horaFin'],
	},
);

const esquemaCancelacion = z.object({
	motivo: z
		.string({
			invalid_type_error: 'El motivo debe ser una cadena de texto.',
		})
		.max(300, { message: 'El motivo no puede exceder 300 caracteres' })
		.optional(),
});

export function validarReserva(entrada) {
	return esquemaReservaConValidacionHorario.safeParse(entrada);
}

export function validarCancelacion(entrada) {
	return esquemaCancelacion.safeParse(entrada);
}
