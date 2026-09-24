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
