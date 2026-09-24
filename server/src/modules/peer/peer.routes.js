import express from 'express'
import * as peerController from './peer.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/book', protect, authorize('student'), peerController.bookSession)
router.get('/sessions', protect, authorize('student'), peerController.getSessions)
router.post('/evaluate/:sessionId', protect, authorize('student'), peerController.evaluateSession)
router.get('/leaderboard', protect, peerController.getLeaderboard)

export default router
