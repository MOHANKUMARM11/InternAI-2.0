import { Company } from './company.model.js'

export const companyRepo = {
  create: async (data) => await Company.create(data),
  findByUserId: async (userId) => await Company.findOne({ userId }),
  updateByUserId: async (userId, update) => await Company.findOneAndUpdate({ userId }, update, { new: true }),
  findById: async (id) => await Company.findById(id)
}
