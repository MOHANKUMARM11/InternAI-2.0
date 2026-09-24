import express from 'express'
import * as githubController from './github.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/analyze', protect, authorize('student'), githubController.analyzeGithub)
router.get('/report', protect, authorize('student'), githubController.getReport)

export default router
