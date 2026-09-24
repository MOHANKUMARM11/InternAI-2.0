import express from 'express'
import * as blockchainController from './blockchain.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/my-credentials', protect, authorize('student'), blockchainController.getMyCredentials)
router.post('/mint', protect, authorize('company'), blockchainController.mintCredential)

export default router
