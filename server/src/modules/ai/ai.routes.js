import express from 'express'
import * as aiController from './ai.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, 
  message: { success: false, message: 'Too many analysis requests from this IP, please try again after an hour' }
})

const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, 
  message: { success: false, message: 'Too many chat requests, please try again after an hour' }
})

// M7
router.post('/resume-analysis', protect, authorize('student'), aiLimiter, aiController.analyzeResume)

// M8
router.post('/recommendations', protect, authorize('student'), aiController.getRecommendations)

// M9
router.post('/interview/questions', protect, authorize('student'), aiController.generateQuestions)
router.post('/interview/evaluate', protect, authorize('student'), aiController.evaluateAnswer)
router.post('/interview/session', protect, authorize('student'), aiController.saveInterviewSession)

// M10
router.post('/chat', protect, authorize('student'), chatLimiter, aiController.chatWithBot)

// M11
router.post('/skillgap', protect, authorize('student'), aiController.generateRoadmap)
router.get('/skillgap', protect, authorize('student'), aiController.getRoadmap)
router.put('/skillgap/complete', protect, authorize('student'), aiController.completeRoadmapStep)

// M12
router.post('/twin/:applicationId', protect, authorize('company'), chatLimiter, aiController.chatWithTwin)
router.get('/twin/:applicationId', protect, aiController.getTwinHistory)

export default router
