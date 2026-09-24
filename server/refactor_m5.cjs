const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/modules/application/application.model.js', `
import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  internshipId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status:        {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  coverNote:     String,
  aiMatchScore:  Number,
  appliedAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now }
})

applicationSchema.index({ studentId: 1 })
applicationSchema.index({ internshipId: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true })

applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export const Application = mongoose.model('Application', applicationSchema)
`);

write('src/modules/application/application.repository.js', `
import { Application } from './application.model.js'

export const applicationRepo = {
  create: async (data) => await Application.create(data),
  
  findById: async (id) => await Application.findById(id).populate('internshipId').populate('studentId'),
  
  findByStudentAndInternship: async (studentId, internshipId) => 
    await Application.findOne({ studentId, internshipId }),
  
  findByStudent: async (studentId) => 
    await Application.find({ studentId })
      .populate({
        path: 'internshipId',
        populate: { path: 'companyId', select: 'companyName logoUrl' }
      })
      .sort({ appliedAt: -1 }),
      
  findByInternship: async (internshipId) => 
    await Application.find({ internshipId })
      .populate('studentId', 'userId skills education resumeUrl name')
      .sort({ appliedAt: -1 }),

  updateById: async (id, update) => 
    await Application.findByIdAndUpdate(id, update, { new: true }),
    
  deleteById: async (id) => await Application.findByIdAndDelete(id)
}
`);

write('src/modules/application/application.service.js', `
import { applicationRepo } from './application.repository.js'
import { studentRepo } from '../student/student.repository.js'
import { companyRepo } from '../company/company.repository.js'
import { internshipRepo } from '../internship/internship.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const applyToInternship = async (userId, internshipId, coverNote) => {
  const student = await studentRepo.findByUserId(userId)
  if (!student) throw new ApiError(404, 'Student profile not found')

  const internship = await internshipRepo.findById(internshipId)
  if (!internship || !internship.isActive) throw new ApiError(404, 'Internship not found or inactive')

  const existing = await applicationRepo.findByStudentAndInternship(student._id, internshipId)
  if (existing) throw new ApiError(409, 'You have already applied to this internship')

  const application = await applicationRepo.create({
    studentId: student._id,
    internshipId,
    coverNote
  })

  await internshipRepo.updateById(internshipId, { $inc: { applicantCount: 1 } })

  return application
}

export const getStudentApplications = async (userId) => {
  const student = await studentRepo.findByUserId(userId)
  if (!student) throw new ApiError(404, 'Student profile not found')
  return await applicationRepo.findByStudent(student._id)
}

export const getInternshipApplications = async (userId, internshipId) => {
  const company = await companyRepo.findByUserId(userId)
  const internship = await internshipRepo.findById(internshipId)
  
  if (!internship) throw new ApiError(404, 'Internship not found')
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'Unauthorized access to internship applications')
  }

  return await applicationRepo.findByInternship(internshipId)
}

export const updateApplicationStatus = async (userId, applicationId, newStatus) => {
  const company = await companyRepo.findByUserId(userId)
  const application = await applicationRepo.findById(applicationId)
  
  if (!application) throw new ApiError(404, 'Application not found')

  // Check internship ownership
  const internship = await internshipRepo.findById(application.internshipId._id)
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'Unauthorized access to update application')
  }

  const currentStatus = application.status
  const allowedTransitions = {
    'Applied': ['Under Review'],
    'Under Review': ['Shortlisted', 'Rejected'],
    'Shortlisted': ['Interview Scheduled', 'Rejected'],
    'Interview Scheduled': ['Selected', 'Rejected'],
    'Rejected': [],
    'Selected': []
  }

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new ApiError(400, \`Invalid status transition from \${currentStatus} to \${newStatus}\`)
  }

  return await applicationRepo.updateById(applicationId, { status: newStatus })
}

export const withdrawApplication = async (userId, applicationId) => {
  const student = await studentRepo.findByUserId(userId)
  const application = await applicationRepo.findById(applicationId)
  
  if (!application) throw new ApiError(404, 'Application not found')
  if (application.studentId._id.toString() !== student._id.toString()) {
    throw new ApiError(403, 'Unauthorized')
  }

  if (application.status !== 'Applied') {
    throw new ApiError(400, 'Can only withdraw applications in Applied status')
  }

  await applicationRepo.deleteById(applicationId)
  await internshipRepo.updateById(application.internshipId._id, { $inc: { applicantCount: -1 } })
}
`);

write('src/modules/application/application.controller.js', `
import * as applicationService from './application.service.js'

export const apply = async (req, res, next) => {
  try {
    const data = await applicationService.applyToInternship(req.user.id, req.body.internshipId, req.body.coverNote)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getMyApplications = async (req, res, next) => {
  try {
    const data = await applicationService.getStudentApplications(req.user.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getApplicants = async (req, res, next) => {
  try {
    const data = await applicationService.getInternshipApplications(req.user.id, req.params.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const updateStatus = async (req, res, next) => {
  try {
    const data = await applicationService.updateApplicationStatus(req.user.id, req.params.id, req.body.status)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const withdraw = async (req, res, next) => {
  try {
    await applicationService.withdrawApplication(req.user.id, req.params.id)
    res.status(200).json({ success: true, message: 'Application withdrawn successfully' })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/application/application.validation.js', `
import Joi from 'joi'

export const applySchema = Joi.object({
  internshipId: Joi.string().required(),
  coverNote: Joi.string().allow('').optional()
})

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected').required()
})
`);

write('src/modules/application/application.routes.js', `
import express from 'express'
import * as applicationController from './application.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import { applySchema, updateStatusSchema } from './application.validation.js'

const router = express.Router()

router.post('/', protect, authorize('student'), validate(applySchema), applicationController.apply)
router.get('/me', protect, authorize('student'), applicationController.getMyApplications)
router.delete('/:id', protect, authorize('student'), applicationController.withdraw)

router.get('/internship/:id', protect, authorize('company'), applicationController.getApplicants)
router.put('/:id/status', protect, authorize('company'), validate(updateStatusSchema), applicationController.updateStatus)

export default router
`);
