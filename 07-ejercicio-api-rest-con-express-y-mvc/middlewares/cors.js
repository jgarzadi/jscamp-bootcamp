import cors from 'cors'

/* Aquí debe ir la lógica de tu middleware */
const ACCEPTED_ORIGINS = [
    'http://localhost:1234', 
    'http://localhost:3000',
    'https://midu.dev',
    'http://jscamp.dev',
    'http://localhost:5173'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
    return cors({
        origin: (origin, callback) => {
            console.log('Origin:', origin)
            if (acceptedOrigins.includes(origin)) {
                return callback(null, true)
            }
            return callback(new Error('No permitido por CORS'))
        }
    })
}
