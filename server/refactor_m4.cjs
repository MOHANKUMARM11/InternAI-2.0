const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/modules/internship/internship.model.js', `
import mongoose from 'mongoose'

const internshipSchema = new mongoose.Schema({
  companyId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  skillsRequired: [String],
  domain:        { type: String, enum: ['Frontend', 'Backend', 'Full-Stack', 'Data Science', 'ML/AI', 'DevOps', 'Design', 'Marketing', 'Finance', 'HR', 'Other'] },
  stipend:       { type: Number },
  duration:      String,             // e.g. "2 months"
  location:      String,
  isRemote:      { type: Boolean, default: false },
  openings:      { type: Number, default: 1 },
  applyDeadline: Date,
  isActive:      { type: Boolean, default: true },
  postedAt:      { type: Date, default: Date.now },
  applicantCount: { type: Number, default: 0 }
})

internshipSchema.index({ isActive: 1, domain: 1, isRemote: 1 })
internshipSchema.index({ skillsRequired: 1 })
internshipSchema.index({ stipend: 1 })

export const Internship = mongoose.model('Internship', internshipSchema)
`);

write('src/modules/internship/internship.repository.js', `
import { Internship } from './internship.model.js'

export const internshipRepo = {
  create: async (data) => await Internship.create(data),
  
  findById: async (id) => await Internship.findById(id).populate('companyId', 'companyName logoUrl location industry'),
  
  updateById: async (id, update) => await Internship.findByIdAndUpdate(id, update, { new: true }),
  
  deleteById: async (id) => await Internship.findByIdAndDelete(id),
  
  findByCompanyId: async (companyId) => await Internship.find({ companyId }).sort({ postedAt: -1 }),

  searchInternships: async (filters, page = 1, limit = 12) => {
    const query = { isActive: true }

    if (filters.domain) query.domain = filters.domain
    if (filters.isRemote !== undefined) query.isRemote = filters.isRemote === 'true' || filters.isRemote === true
    if (filters.minStipend || filters.maxStipend) {
      query.stipend = {}
      if (filters.minStipend) query.stipend.$gte = Number(filters.minStipend)
      if (filters.maxStipend) query.stipend.$lte = Number(filters.maxStipend)
    }
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i')
      query.$or = [
        { title: regex },
        { description: regex },
        { skillsRequired: regex }
      ]
    }

    const total = await Internship.countDocuments(query)
    const data = await Internship.find(query)
      .populate('companyId', 'companyName logoUrl location industry')
      .sort({ postedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return { data, total, page: Number(page), totalPages: Math.ceil(total / limit) }
  }
}
`);

write('src/modules/internship/internship.service.js', `
import { internshipRepo } from './internship.repository.js'
import { companyRepo } from '../company/company.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const createInternship = async (userId, data) => {
  const company = await companyRepo.findByUserId(userId)
  if (!company) throw new ApiError(404, 'Company profile not found')
  if (!company.cultureValues || company.cultureValues.length < 3) {
    throw new ApiError(400, 'Company must have at least 3 culture values to post an internship')
  }

  return await internshipRepo.create({ ...data, companyId: company._id })
}

export const getInternship = async (id) => {
  const internship = await internshipRepo.findById(id)
  if (!internship) throw new ApiError(404, 'Internship not found')
  return internship
}

export const updateInternship = async (userId, id, update) => {
  const company = await companyRepo.findByUserId(userId)
  const internship = await internshipRepo.findById(id)
  
  if (!internship) throw new ApiError(404, 'Internship not found')
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'You can only edit your own internships')
  }

  return await internshipRepo.updateById(id, update)
}

export const deleteInternship = async (userId, id) => {
  const company = await companyRepo.findByUserId(userId)
  const internship = await internshipRepo.findById(id)
  
  if (!internship) throw new ApiError(404, 'Internship not found')
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'You can only delete your own internships')
  }

  await internshipRepo.deleteById(id)
}

export const getCompanyInternships = async (userId) => {
  const company = await companyRepo.findByUserId(userId)
  if (!company) throw new ApiError(404, 'Company profile not found')
  
  return await internshipRepo.findByCompanyId(company._id)
}

export const searchInternships = async (query) => {
  const { page, limit, ...filters } = query
  return await internshipRepo.searchInternships(filters, page, limit)
}
`);

write('src/modules/internship/internship.controller.js', `
import * as internshipService from './internship.service.js'

export const createInternship = async (req, res, next) => {
  try {
    const data = await internshipService.createInternship(req.user.id, req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const searchInternships = async (req, res, next) => {
  try {
    const result = await internshipService.searchInternships(req.query)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}

export const getInternship = async (req, res, next) => {
  try {
    const data = await internshipService.getInternship(req.params.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const updateInternship = async (req, res, next) => {
  try {
    const data = await internshipService.updateInternship(req.user.id, req.params.id, req.body)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const deleteInternship = async (req, res, next) => {
  try {
    await internshipService.deleteInternship(req.user.id, req.params.id)
    res.status(200).json({ success: true, message: 'Internship deleted' })
  } catch (error) {
    next(error)
  }
}

export const getMyInternships = async (req, res, next) => {
  try {
    const data = await internshipService.getCompanyInternships(req.user.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/internship/internship.validation.js', `
import Joi from 'joi'

export const createInternshipSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  skillsRequired: Joi.array().items(Joi.string()).required(),
  domain: Joi.string().valid('Frontend', 'Backend', 'Full-Stack', 'Data Science', 'ML/AI', 'DevOps', 'Design', 'Marketing', 'Finance', 'HR', 'Other').required(),
  stipend: Joi.number().allow(null),
  duration: Joi.string().allow(''),
  location: Joi.string().allow(''),
  isRemote: Joi.boolean().default(false),
  openings: Joi.number().default(1),
  applyDeadline: Joi.date().allow(null),
  isActive: Joi.boolean().default(true)
})

export const updateInternshipSchema = createInternshipSchema.fork(
  ['title', 'description', 'skillsRequired', 'domain'],
  (schema) => schema.optional()
)
`);

write('src/modules/internship/internship.routes.js', `
import express from 'express'
import * as internshipController from './internship.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import { createInternshipSchema, updateInternshipSchema } from './internship.validation.js'

const router = express.Router()

router.get('/', internshipController.searchInternships)
router.get('/company/mine', protect, authorize('company'), internshipController.getMyInternships)
router.get('/:id', internshipController.getInternship)

router.post('/', protect, authorize('company'), validate(createInternshipSchema), internshipController.createInternship)
router.put('/:id', protect, authorize('company'), validate(updateInternshipSchema), internshipController.updateInternship)
router.delete('/:id', protect, authorize('company'), internshipController.deleteInternship)

export default router
`);
