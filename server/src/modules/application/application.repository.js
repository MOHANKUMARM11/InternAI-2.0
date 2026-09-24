import { Application } from './application.model.js'

export const applicationRepo = {
  create: async (data) => await Application.create(data),
  
  findById: async (id) => await Application.findById(id).populate('internshipId').populate('studentId'),
  
  findByStudentAndInternship: async (studentId, internshipId) => 
    await Application.findOne({ studentId, internshipId }),
  
  findByStudent: async (studentId) => 
    await Application.find({ studentId })
      .populate({
        path: 'internshipId',
        populate: { path: 'companyId', select: 'companyName logoUrl' }
      })
      .sort({ appliedAt: -1 }),
      
  findByInternship: async (internshipId) => 
    await Application.find({ internshipId })
      .populate('studentId', 'userId skills education resumeUrl name')
      .sort({ appliedAt: -1 }),

  updateById: async (id, update) => 
    await Application.findByIdAndUpdate(id, update, { new: true }),
    
  deleteById: async (id) => await Application.findByIdAndDelete(id)
}
