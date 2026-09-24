const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/config/db.js', `
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 50 })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('DB connection error:', err)
    process.exit(1)
  }
}
`);

write('src/utils/ApiError.js', `
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}
`);

write('src/middlewares/error.middleware.js', `
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal server error'
  res.status(statusCode).json({ success: false, error: message })
}
`);

write('src/middlewares/validate.middleware.js', `
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }
  next();
};
`);

write('src/modules/auth/user.model.js', `
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['student', 'company', 'admin'], required: true },
  isVerified:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'))
  next()
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.index({ email: 1 })

export const User = mongoose.model('User', userSchema)
`);

write('src/modules/auth/auth.repository.js', `
import { User } from './user.model.js'

export const authRepo = {
  findByEmail: async (email) => await User.findOne({ email }),
  create: async (data) => await User.create(data)
}
`);

write('src/modules/student/student.model.js', `
import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college:      String,
  cgpa:         { type: Number, min: 0, max: 10 },
  skills:       [{ type: String }],
  education:    [{
    degree:     String,
    institution:String,
    year:       Number,
    percentage: Number
  }],
  projects:     [{
    title:      String,
    description:String,
    techStack:  [String],
    link:       String
  }],
  experience:   [{
    role:       String,
    company:    String,
    duration:   String,
    description:String
  }],
  portfolioLinks: {
    github:     String,
    linkedin:   String,
    website:    String
  },
  resumeUrl:    String,
  resumeText:   String,
  resumeScore:  { type: Number, default: null },
  githubScore:  { type: Number, default: null },
  interviewScore: { type: Number, default: null },
  careerGoal:   String,
  preferredDomains: [String],
  updatedAt:    { type: Date, default: Date.now }
})

studentSchema.index({ userId: 1 })
studentSchema.index({ skills: 1 })

export const Student = mongoose.model('Student', studentSchema)
`);

write('src/modules/student/student.repository.js', `
import { Student } from './student.model.js'

export const studentRepo = {
  create: async (data) => await Student.create(data),
  findByUserId: async (userId) => await Student.findOne({ userId }),
  updateByUserId: async (userId, update) => await Student.findOneAndUpdate({ userId }, update, { new: true })
}
`);

write('src/modules/company/company.model.js', `
import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName:  { type: String, required: true },
  industry:     String,
  description:  String,
  website:      String,
  logoUrl:      String,
  size:         { type: String, enum: ['1-10', '11-50', '51-200', '200+'] },
  location:     String,
  cultureValues: [String],
  workStyle:    { type: String, enum: ['remote', 'onsite', 'hybrid'] },
  createdAt:    { type: Date, default: Date.now }
})

export const Company = mongoose.model('Company', companySchema)
`);

write('src/modules/company/company.repository.js', `
import { Company } from './company.model.js'

export const companyRepo = {
  create: async (data) => await Company.create(data)
}
`);

write('src/utils/jwt.js', `
import jwt from 'jsonwebtoken'

export const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET)
`);

write('src/middlewares/auth.middleware.js', `
import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return next(new ApiError(401, 'No token provided'))

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'))
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new ApiError(403, 'Access denied'))
  next()
}
`);

write('src/modules/auth/auth.service.js', `
import { authRepo } from './auth.repository.js'
import { studentRepo } from '../student/student.repository.js'
import { companyRepo } from '../company/company.repository.js'
import { ApiError } from '../../utils/ApiError.js'
import { generateToken } from '../../utils/jwt.js'

export const signup = async ({ name, email, password, role }) => {
  const exists = await authRepo.findByEmail(email)
  if (exists) throw new ApiError(409, 'Email already registered')

  const user = await authRepo.create({ name, email, passwordHash: password, role })

  if (role === 'student') await studentRepo.create({ userId: user._id })
  if (role === 'company') await companyRepo.create({ userId: user._id, companyName: name })

  const token = generateToken(user)
  return { token, user: { id: user._id, name, email, role } }
}

export const login = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email)
  if (!user) throw new ApiError(401, 'Invalid credentials')

  const match = await user.comparePassword(password)
  if (!match) throw new ApiError(401, 'Invalid credentials')

  const token = generateToken(user)
  return { token, user: { id: user._id, name: user.name, email, role: user.role } }
}
`);

write('src/modules/auth/auth.validation.js', `
import Joi from 'joi'

export const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'company', 'admin').required()
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})
`);

write('src/modules/auth/auth.controller.js', `
import * as authService from './auth.service.js'
import { ApiError } from '../../utils/ApiError.js'

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { user: req.user } })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/auth/auth.routes.js', `
import express from 'express'
import * as authController from './auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { protect } from '../../middlewares/auth.middleware.js'
import { signupSchema, loginSchema } from './auth.validation.js'

const router = express.Router()

router.post('/signup', validate(signupSchema), authController.signup)
router.post('/login', validate(loginSchema), authController.login)
router.get('/me', protect, authController.getMe)

export default router
`);

write('src/app.js', `
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
`);

write('src/server.js', `
import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(\`Server running on port \${PORT}\`)
    })
  } catch (error) {
    console.error(error)
  }
}

startServer()
`);

console.log("Files refactored successfully!");
