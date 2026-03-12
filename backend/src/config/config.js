import 'dotenv/config';

export const {
	PORT = 1000,
	DB_USER = 'tu_usuario',
	DB_PASSWORD = 'tu_password',
	DB_HOST = 'localhost',
	DB_PORT = 1000,
	DB_SERVICE = 'tu_servicio',
	SALT_ROUND = 10,
	SECRET_JWT_KEY = 'tu_clave_secreta_para_jwt',
} = process.env;
