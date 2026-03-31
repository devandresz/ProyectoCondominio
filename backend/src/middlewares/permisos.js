export const verificarRol =
	(...rolesPermitidos) =>
	(req, res, next) => {
		const rolUsuario = req.usuario?.ROL?.trim().toLowerCase();
		const rolesNormalizados = rolesPermitidos.map((rol) => rol.trim().toLowerCase());

		console.log('ROL USUARIO:', req.usuario?.ROL);
		console.log('ROLES PERMITIDOS:', rolesPermitidos);

		if (!rolUsuario) {
			return res.status(401).json({ mensaje: 'No autenticado.' });
		}

		if (!rolesNormalizados.includes(rolUsuario)) {
			return res.status(403).json({
				mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}.`,
			});
		}

		next();
	};