import express from 'express'
import * as progressController from './progress.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/student', protect, authorize('student'), progressController.getMyProgress)
router.get('/company', protect, authorize('company'), progressController.getCompanyProgress)
router.post('/:progressId/submit', protect, authorize('student'), progressController.submitUpdate)
router.post('/trigger', protect, progressController.triggerWeeklyPrompts) // Could restrict to admin

export default router
