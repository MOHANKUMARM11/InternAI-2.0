import express from 'express'
import * as dashboardController from './dashboard.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/student', protect, authorize('student'), dashboardController.getStudentDash)
router.get('/company', protect, authorize('company'), dashboardController.getCompanyDash)
router.get('/admin', protect, authorize('admin'), dashboardController.getAdminDash)

export default router
