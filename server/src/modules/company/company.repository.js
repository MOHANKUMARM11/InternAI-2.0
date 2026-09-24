import { Company } from './company.model.js'

export const companyRepo = {
  create: async (data) => await Company.create(data)
}
