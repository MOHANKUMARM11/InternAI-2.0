import { companyRepo } from './company.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const getProfile = async (userId) => {
  const profile = await companyRepo.findByUserId(userId)
  if (!profile) throw new ApiError(404, 'Company profile not found')
  return profile
}

export const getProfileById = async (companyId) => {
  const profile = await companyRepo.findById(companyId)
  if (!profile) throw new ApiError(404, 'Company profile not found')
  return profile
}

export const updateProfile = async (userId, data) => {
  if (data.cultureValues && data.cultureValues.length < 3) {
    throw new ApiError(400, 'Minimum 3 culture values are required')
  }
  return await companyRepo.updateByUserId(userId, data)
}

export const uploadLogo = async (userId, file) => {
  return await companyRepo.updateByUserId(userId, { logoUrl: file.path })
}
