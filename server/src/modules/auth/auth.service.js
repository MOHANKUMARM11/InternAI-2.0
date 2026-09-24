import { authRepo } from './auth.repository.js'
import { studentRepo } from '../student/student.repository.js'
import { companyRepo } from '../company/company.repository.js'
import { ApiError } from '../../utils/ApiError.js'
import { generateToken } from '../../utils/jwt.js'

export const signup = async ({ name, email, password, role }) => {
  const exists = await authRepo.findByEmail(email)
  if (exists) throw new ApiError(409, 'Email already registered')

  const user = await authRepo.create({ name, email, passwordHash: password, role })

  if (role === 'student') await studentRepo.create({ userId: user._id })
  if (role === 'company') await companyRepo.create({ userId: user._id, companyName: name })

  const token = generateToken(user)
  return { token, user: { id: user._id, name, email, role } }
}

export const login = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email)
  if (!user) throw new ApiError(401, 'Invalid credentials')

  const match = await user.comparePassword(password)
  if (!match) throw new ApiError(401, 'Invalid credentials')

  const token = generateToken(user)
  return { token, user: { id: user._id, name: user.name, email, role: user.role } }
}
