import { Router } from 'express';
import { invitacionesController } from '../controllers/invitaciones.js';

export const enrutadorInvitaciones = Router();

enrutadorInvitaciones.get('/', invitacionesController.obtenerTodas);
enrutadorInvitaciones.post('/', invitacionesController.crear);
enrutadorInvitaciones.patch('/:id', invitacionesController.actualizar);