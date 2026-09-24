import express from 'express'
import * as marketController from './market.controller.js'
import { protect } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/pulse', protect, marketController.getPulse)
router.get('/trending', protect, marketController.getTrending)

export default router
