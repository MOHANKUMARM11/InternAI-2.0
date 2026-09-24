import { applicationRepo } from './application.repository.js'
import { studentRepo } from '../student/student.repository.js'
import { companyRepo } from '../company/company.repository.js'
import { internshipRepo } from '../internship/internship.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const applyToInternship = async (userId, internshipId, coverNote) => {
  const student = await studentRepo.findByUserId(userId)
  if (!student) throw new ApiError(404, 'Student profile not found')

  const internship = await internshipRepo.findById(internshipId)
  if (!internship || !internship.isActive) throw new ApiError(404, 'Internship not found or inactive')

  const existing = await applicationRepo.findByStudentAndInternship(student._id, internshipId)
  if (existing) throw new ApiError(409, 'You have already applied to this internship')

  const application = await applicationRepo.create({
    studentId: student._id,
    internshipId,
    coverNote
  })

  await internshipRepo.updateById(internshipId, { $inc: { applicantCount: 1 } })

  return application
}

export const getStudentApplications = async (userId) => {
  const student = await studentRepo.findByUserId(userId)
  if (!student) throw new ApiError(404, 'Student profile not found')
  return await applicationRepo.findByStudent(student._id)
}

export const getInternshipApplications = async (userId, internshipId) => {
  const company = await companyRepo.findByUserId(userId)
  const internship = await internshipRepo.findById(internshipId)
  
  if (!internship) throw new ApiError(404, 'Internship not found')
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'Unauthorized access to internship applications')
  }

  return await applicationRepo.findByInternship(internshipId)
}

export const updateApplicationStatus = async (userId, applicationId, newStatus) => {
  const company = await companyRepo.findByUserId(userId)
  const application = await applicationRepo.findById(applicationId)
  
  if (!application) throw new ApiError(404, 'Application not found')

  // Check internship ownership
  const internship = await internshipRepo.findById(application.internshipId._id)
  if (internship.companyId._id.toString() !== company._id.toString()) {
    throw new ApiError(403, 'Unauthorized access to update application')
  }

  const currentStatus = application.status
  const allowedTransitions = {
    'Applied': ['Under Review'],
    'Under Review': ['Shortlisted', 'Rejected'],
    'Shortlisted': ['Interview Scheduled', 'Rejected'],
    'Interview Scheduled': ['Selected', 'Rejected'],
    'Rejected': [],
    'Selected': []
  }

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new ApiError(400, `Invalid status transition from ${currentStatus} to ${newStatus}`)
  }

  return await applicationRepo.updateById(applicationId, { status: newStatus })
}

export const withdrawApplication = async (userId, applicationId) => {
  const student = await studentRepo.findByUserId(userId)
  const application = await applicationRepo.findById(applicationId)
  
  if (!application) throw new ApiError(404, 'Application not found')
  if (application.studentId._id.toString() !== student._id.toString()) {
    throw new ApiError(403, 'Unauthorized')
  }

  if (application.status !== 'Applied') {
    throw new ApiError(400, 'Can only withdraw applications in Applied status')
  }

  await applicationRepo.deleteById(applicationId)
  await internshipRepo.updateById(application.internshipId._id, { $inc: { applicantCount: -1 } })
}
