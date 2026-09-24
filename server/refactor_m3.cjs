const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/modules/company/company.repository.js', `
import { Company } from './company.model.js'

export const companyRepo = {
  create: async (data) => await Company.create(data),
  findByUserId: async (userId) => await Company.findOne({ userId }),
  updateByUserId: async (userId, update) => await Company.findOneAndUpdate({ userId }, update, { new: true }),
  findById: async (id) => await Company.findById(id)
}
`);

write('src/modules/company/company.service.js', `
import { companyRepo } from './company.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const getProfile = async (userId) => {
  const profile = await companyRepo.findByUserId(userId)
  if (!profile) throw new ApiError(404, 'Company profile not found')
  return profile
}

export const getProfileById = async (companyId) => {
  const profile = await companyRepo.findById(companyId)
  if (!profile) throw new ApiError(404, 'Company profile not found')
  return profile
}

export const updateProfile = async (userId, data) => {
  if (data.cultureValues && data.cultureValues.length < 3) {
    throw new ApiError(400, 'Minimum 3 culture values are required')
  }
  return await companyRepo.updateByUserId(userId, data)
}

export const uploadLogo = async (userId, file) => {
  return await companyRepo.updateByUserId(userId, { logoUrl: file.path })
}
`);

write('src/modules/company/company.controller.js', `
import * as companyService from './company.service.js'

export const getMe = async (req, res, next) => {
  try {
    const profile = await companyService.getProfile(req.user.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const profile = await companyService.updateProfile(req.user.id, req.body)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const uploadLogo = async (req, res, next) => {
  try {
    const profile = await companyService.uploadLogo(req.user.id, req.file)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const getCompany = async (req, res, next) => {
  try {
    const profile = await companyService.getProfileById(req.params.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/company/company.validation.js', `
import Joi from 'joi'

export const updateCompanySchema = Joi.object({
  companyName: Joi.string().allow(''),
  industry: Joi.string().allow(''),
  description: Joi.string().allow(''),
  website: Joi.string().uri().allow(''),
  size: Joi.string().valid('1-10', '11-50', '51-200', '200+').allow(''),
  location: Joi.string().allow(''),
  cultureValues: Joi.array().items(Joi.string()).min(3).message('Minimum 3 culture values are required').allow(null),
  workStyle: Joi.string().valid('remote', 'onsite', 'hybrid').allow('')
})
`);

write('src/modules/company/company.routes.js', `
import express from 'express'
import * as companyController from './company.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import { updateCompanySchema } from './company.validation.js'
import { uploadLogo } from '../../middlewares/upload.middleware.js'

const router = express.Router()

router.get('/me', protect, authorize('company'), companyController.getMe)
router.put('/me', protect, authorize('company'), validate(updateCompanySchema), companyController.updateMe)
router.post('/me/logo', protect, authorize('company'), uploadLogo.single('logo'), companyController.uploadLogo)
router.get('/:id', companyController.getCompany) // Public route for anyone to view company profile

export default router
`);
