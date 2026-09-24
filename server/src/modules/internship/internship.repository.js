import { Internship } from './internship.model.js'

export const internshipRepo = {
  create: async (data) => await Internship.create(data),
  
  findById: async (id) => await Internship.findById(id).populate('companyId', 'companyName logoUrl location industry'),
  
  updateById: async (id, update) => await Internship.findByIdAndUpdate(id, update, { new: true }),
  
  deleteById: async (id) => await Internship.findByIdAndDelete(id),
  
  findByCompanyId: async (companyId) => await Internship.find({ companyId }).sort({ postedAt: -1 }),

  searchInternships: async (filters, page = 1, limit = 12) => {
    const query = { isActive: true }

    if (filters.domain) query.domain = filters.domain
    if (filters.isRemote !== undefined) query.isRemote = filters.isRemote === 'true' || filters.isRemote === true
    if (filters.minStipend || filters.maxStipend) {
      query.stipend = {}
      if (filters.minStipend) query.stipend.$gte = Number(filters.minStipend)
      if (filters.maxStipend) query.stipend.$lte = Number(filters.maxStipend)
    }
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i')
      query.$or = [
        { title: regex },
        { description: regex },
        { skillsRequired: regex }
      ]
    }

    const total = await Internship.countDocuments(query)
    const data = await Internship.find(query)
      .populate('companyId', 'companyName logoUrl location industry')
      .sort({ postedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return { data, total, page: Number(page), totalPages: Math.ceil(total / limit) }
  }
}
