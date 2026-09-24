import * as authService from './auth.service.js'
import { ApiError } from '../../utils/ApiError.js'

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { user: req.user } })
  } catch (error) {
    next(error)
  }
}
