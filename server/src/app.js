import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { errorMiddleware } from './middlewares/error.middleware.js'

import authRoutes from './modules/auth/auth.routes.js'
import studentRoutes from './modules/student/student.routes.js'
import companyRoutes from './modules/company/company.routes.js'
import internshipRoutes from './modules/internship/internship.routes.js'
import applicationRoutes from './modules/application/application.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorMiddleware)

export default app
