export const {
  // Servidor
  PORT = 1000,

  // Oracle DB
  DB_USER = 'tu_usuario',
  DB_PASSWORD = 'tu_password',
  DB_HOST = 'localhost',
  DB_PORT = 1000,
  DB_SERVICE = 'tu_servicio',

   // Autenticación
  SALT_ROUND = 10,
  SECRET_JWT_KEY = 'tu_clave_secreta_para_jwt'
} = process.env

