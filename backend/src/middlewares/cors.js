import cors from 'cors'

const origenesAceptados = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:3000'
]

export const middlewareCors = ({ origenes = origenesAceptados } = {}) => cors({
  origin: (origen, callback) => {
    if (origenes.includes(origen)) {
      return callback(null, true)
    }
    if (!origen) {
      return callback(null, true)
    }
    return callback(new Error('Origen no permitido por CORS'))
  }
})
