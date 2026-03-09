export const verificarRol = (...rolesPermitidos) => (req, res, next) => {
  const rolUsuario = req.usuario?.ROL

  if (!rolUsuario) {
    return res.status(401).json({ mensaje: 'No autenticado.' })
  }

  if (!rolesPermitidos.includes(rolUsuario)) {
    return res.status(403).json({
      mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}.`
    })
  }

  next()
}
