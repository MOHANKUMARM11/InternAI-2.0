import { internshipRepo } from './internship.repository.js'
import { companyRepo } from '../company/company.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const createInternship = async (userId, data) => {
  const company = await companyRepo.findByUserId(userId)
  if (!company) throw new ApiError(404, 'Company profile not found')
  if (!company.cultureValues || company.cultureValues.length < 3) {
    throw new ApiError(400, 'Company must have at least 3 culture values to post an internship')
  }

  return await internshipRepo.create({ ...data, companyId: company._id })
}

export const getInternship = async (id) => {
  const internship = await internshipRepo.findById(id)
  if (!internship) throw new ApiError(404, 'Internship not found')
  return internship
}

export const updateInternship = async (userId, id, update) => {
  const company = await companyRepo.findByUserId(userId)
  const internship = await internshipRepo.findById(id)
  
  if (!internship) throw new ApiError(404, 'Internship not found')
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'You can only edit your own internships')
  }

  return await internshipRepo.updateById(id, update)
}

export const deleteInternship = async (userId, id) => {
  const company = await companyRepo.findByUserId(userId)
  const internship = await internshipRepo.findById(id)
  
  if (!internship) throw new ApiError(404, 'Internship not found')
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'You can only delete your own internships')
  }

  await internshipRepo.deleteById(id)
}

export const getCompanyInternships = async (userId) => {
  const company = await companyRepo.findByUserId(userId)
  if (!company) throw new ApiError(404, 'Company profile not found')
  
  return await internshipRepo.findByCompanyId(company._id)
}

export const searchInternships = async (query) => {
  const { page, limit, ...filters } = query
  return await internshipRepo.searchInternships(filters, page, limit)
}
