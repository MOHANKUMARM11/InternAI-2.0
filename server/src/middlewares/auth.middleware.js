import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return next(new ApiError(401, 'No token provided'))

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'))
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new ApiError(403, 'Access denied'))
  next()
}
