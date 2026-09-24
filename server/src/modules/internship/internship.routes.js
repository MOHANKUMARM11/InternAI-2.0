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
