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
