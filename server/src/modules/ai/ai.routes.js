import express from 'express'
import * as aiController from './ai.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: { success: false, message: 'Too many analysis requests from this IP, please try again after an hour' }
})

router.post('/resume-analysis', protect, authorize('student'), aiLimiter, aiController.analyzeResume)

export default router
