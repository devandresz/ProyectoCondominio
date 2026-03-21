import z from 'zod';

export const validarAreaSocial = (data) =>
  z.object({
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    hora_apertura: z.string().min(5).max(5),
    hora_cierre: z.string().min(5).max(5),
    precio_por_hora: z.coerce.number().min(0),
    activo: z.coerce.number().int().min(0).max(1),
  }).safeParse(data);

export const validarParcialAreaSocial = (data) =>
  z.object({
    nombre: z.string().min(1),
    descripcion: z.string().optional(),
    hora_apertura: z.string().min(5).max(5),
    hora_cierre: z.string().min(5).max(5),
    precio_por_hora: z.coerce.number().min(0),
    activo: z.coerce.number().int().min(0).max(1),
  }).safeParse(data);

export const validarIdArea = (data) =>
  z.object({
    id: z.coerce.number().int().positive(),
  }).safeParse(data);

export const validarEstadoArea = (data) =>
  z.object({
    activo: z.coerce.number().int().min(0).max(1),
  }).safeParse(data);