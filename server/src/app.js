import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { errorMiddleware } from './middlewares/error.middleware.js'

import authRoutes from './modules/auth/auth.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)

app.use(errorMiddleware)

export default app
