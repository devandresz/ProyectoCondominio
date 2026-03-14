import { z } from 'zod';

export const validarMulta = (data) => {

  const schema = z.object({
    idPropiedad: z.number(),
    idTipoCargo: z.number(),
    monto: z.number(),
    descripcion: z.string().optional(),
    estado: z.string().default('PENDIENTE')
  });

  return schema.safeParse(data);

};