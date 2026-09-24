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
