import 'dotenv/config'
import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import { enrutadorTickets } from './routes/tickets.js'
import { middlewareCors } from './middlewares/cors.js'
import { PORT } from './config/config.js'

const aplicacion = express()
aplicacion.use(json())
aplicacion.use(cookieParser())
aplicacion.use(middlewareCors())
aplicacion.disable('x-powered-by')

aplicacion.use('/tickets', enrutadorTickets)

aplicacion.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
