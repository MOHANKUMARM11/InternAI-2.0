const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/config/cloudinary.js', `
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'test',
  api_key: process.env.CLOUDINARY_API_KEY || 'test',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'test'
})

export default cloudinary
`);

write('src/middlewares/upload.middleware.js', `
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'internai/resumes', allowed_formats: ['pdf'], resource_type: 'raw' }
})

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'internai/logos', allowed_formats: ['png', 'jpg', 'jpeg'] }
})

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
})
`);

write('src/modules/student/student.validation.js', `
import Joi from 'joi'

export const updateProfileSchema = Joi.object({
  college: Joi.string().allow(''),
  cgpa: Joi.number().min(0).max(10).allow(null),
  skills: Joi.array().items(Joi.string()).allow(null),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string(),
      institution: Joi.string(),
      year: Joi.number(),
      percentage: Joi.number()
    })
  ).allow(null),
  projects: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      techStack: Joi.array().items(Joi.string()),
      link: Joi.string()
    })
  ).allow(null),
  experience: Joi.array().items(
    Joi.object({
      role: Joi.string(),
      company: Joi.string(),
      duration: Joi.string(),
      description: Joi.string()
    })
  ).allow(null),
  portfolioLinks: Joi.object({
    github: Joi.string().allow(''),
    linkedin: Joi.string().allow(''),
    website: Joi.string().allow('')
  }).allow(null),
  careerGoal: Joi.string().allow(''),
  preferredDomains: Joi.array().items(Joi.string()).allow(null)
})
`);

write('src/modules/student/student.service.js', `
import { studentRepo } from './student.repository.js'
import pdfParse from 'pdf-parse'
import { ApiError } from '../../utils/ApiError.js'

export const getProfile = async (userId) => {
  const profile = await studentRepo.findByUserId(userId)
  if (!profile) throw new ApiError(404, 'Student profile not found')
  return profile
}

export const getProfileById = async (studentId) => {
  // Using findById via repo isn't strictly there, let's implement it
  const profile = await studentRepo.findById(studentId)
  if (!profile) throw new ApiError(404, 'Student profile not found')
  return profile
}

export const updateProfile = async (userId, data) => {
  data.updatedAt = new Date()
  return await studentRepo.updateByUserId(userId, data)
}

export const uploadResume = async (userId, file) => {
  // Cloudinary returns the file URL in file.path
  let resumeText = ''
  try {
    const response = await fetch(file.path)
    const buffer = await response.arrayBuffer()
    const pdfData = await pdfParse(Buffer.from(buffer))
    resumeText = pdfData.text
  } catch (err) {
    console.error('Failed to parse PDF', err)
  }

  return await studentRepo.updateByUserId(userId, {
    resumeUrl: file.path,
    resumeText,
    updatedAt: new Date()
  })
}
`);

// Updating studentRepo to include findById
write('src/modules/student/student.repository.js', `
import { Student } from './student.model.js'

export const studentRepo = {
  create: async (data) => await Student.create(data),
  findByUserId: async (userId) => await Student.findOne({ userId }),
  updateByUserId: async (userId, update) => await Student.findOneAndUpdate({ userId }, update, { new: true }),
  findById: async (id) => await Student.findById(id)
}
`);

write('src/modules/student/student.controller.js', `
import * as studentService from './student.service.js'

export const getMe = async (req, res, next) => {
  try {
    const profile = await studentService.getProfile(req.user.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const profile = await studentService.updateProfile(req.user.id, req.body)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const uploadResume = async (req, res, next) => {
  try {
    const profile = await studentService.uploadResume(req.user.id, req.file)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const getStudent = async (req, res, next) => {
  try {
    const profile = await studentService.getProfileById(req.params.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/student/student.routes.js', `
import express from 'express'
import * as studentController from './student.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import { updateProfileSchema } from './student.validation.js'
import { uploadResume } from '../../middlewares/upload.middleware.js'

const router = express.Router()

router.get('/me', protect, authorize('student'), studentController.getMe)
router.put('/me', protect, authorize('student'), validate(updateProfileSchema), studentController.updateMe)
router.post('/me/resume', protect, authorize('student'), uploadResume.single('resume'), studentController.uploadResume)
router.get('/:id', protect, authorize('company', 'admin'), studentController.getStudent)

export default router
`);

write('src/app.js', `
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { errorMiddleware } from './middlewares/error.middleware.js'

import authRoutes from './modules/auth/auth.routes.js'
import studentRoutes from './modules/student/student.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)

app.use(errorMiddleware)

export default app
`);

console.log("Module 2 backend files generated successfully!");
