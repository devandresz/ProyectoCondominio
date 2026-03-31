import z from 'zod';

export const validarIdPropiedad = (data) =>
  z.object({
    idPropiedad: z.coerce.number().int().positive()
  }).safeParse(data);