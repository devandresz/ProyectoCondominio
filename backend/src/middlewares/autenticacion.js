import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config/config.js'
import { UsuarioModel } from '../models/usuario.js'

export const autenticacion = async (req, res, next) => {
  const { token_sesion: tokenSesion } = req.cookies

  if (!tokenSesion) {
    return res.status(401).json({ mensaje: 'Acceso no autorizado. Se requiere iniciar sesión.' })
  }

  let datosToken
  try {
    datosToken = jwt.verify(tokenSesion, SECRET_JWT_KEY)
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' })
  }

  const usuario = await UsuarioModel.obtenerPorId({ id: datosToken.id })

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Usuario no encontrado.' })
  }

  if (!usuario.ACTIVO) {
    return res.status(403).json({ mensaje: 'Usuario inactivo. Contacte al administrador.' })
  }

  req.usuario = usuario
  next()
}
