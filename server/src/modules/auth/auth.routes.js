import express from 'express'
import * as authController from './auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { protect } from '../../middlewares/auth.middleware.js'
import { signupSchema, loginSchema } from './auth.validation.js'

const router = express.Router()

router.post('/signup', validate(signupSchema), authController.signup)
router.post('/login', validate(loginSchema), authController.login)
router.get('/me', protect, authController.getMe)

export default router
