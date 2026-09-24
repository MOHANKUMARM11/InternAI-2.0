const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/modules/dashboard/dashboard.service.js', `
import { Student } from '../student/student.model.js'
import { Company } from '../company/company.model.js'
import { Internship } from '../internship/internship.model.js'
import { Application } from '../application/application.model.js'
import { User } from '../auth/auth.model.js'
import { ApiError } from '../../utils/ApiError.js'

export const getStudentDashboard = async (userId) => {
  const student = await Student.findOne({ userId })
  if (!student) throw new ApiError(404, 'Student profile not found')

  const applications = await Application.find({ studentId: student._id }).populate({
    path: 'internshipId',
    populate: { path: 'companyId', select: 'companyName logoUrl' }
  }).sort({ appliedAt: -1 })

  const stats = {
    applied: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
    selected: applications.filter(a => a.status === 'Selected').length
  }

  // AI-recommended internships (Top 3 simple matching for now based on skills)
  const recommendations = await Internship.find({
    isActive: true,
    skillsRequired: { $in: student.skills }
  }).populate('companyId', 'companyName logoUrl location').limit(3).sort({ postedAt: -1 })

  return {
    resumeScore: student.resumeScore || 0,
    githubScore: student.githubScore || 0,
    interviewScore: student.interviewScore || 0,
    applicationStats: stats,
    recentApplications: applications.slice(0, 5),
    recommendations,
    upcomingPeerSessions: [] // Module 15
  }
}

export const getCompanyDashboard = async (userId) => {
  const company = await Company.findOne({ userId })
  if (!company) throw new ApiError(404, 'Company profile not found')

  const internships = await Internship.find({ companyId: company._id })
  const internshipIds = internships.map(i => i._id)

  const applications = await Application.find({ internshipId: { $in: internshipIds } })
    .populate('studentId', 'userId name resumeUrl')
    .sort({ appliedAt: -1 })

  const stats = {
    totalListings: internships.filter(i => i.isActive).length,
    totalApplicants: applications.length,
    shortlistedCount: applications.filter(a => a.status === 'Shortlisted').length,
    pendingReview: applications.filter(a => a.status === 'Applied').length
  }

  const applicationsPerListing = internships.map(i => ({
    name: i.title,
    applicants: i.applicantCount || 0
  }))

  return {
    stats,
    applicationsPerListing,
    recentApplicants: applications.slice(0, 5)
  }
}

export const getAdminDashboard = async () => {
  const [
    totalStudents,
    totalCompanies,
    totalInternships,
    totalApplications,
    selectedApplications
  ] = await Promise.all([
    Student.countDocuments(),
    Company.countDocuments(),
    Internship.countDocuments(),
    Application.countDocuments(),
    Application.countDocuments({ status: 'Selected' })
  ])

  const placementRate = totalApplications > 0 ? Math.round((selectedApplications / totalApplications) * 100) : 0

  const topStudents = await Student.find()
    .sort({ resumeScore: -1 })
    .limit(10)
    .select('name resumeScore githubScore interviewScore')

  const domainDistribution = await Internship.aggregate([
    { $group: { _id: '$domain', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } }
  ])

  return {
    stats: {
      totalStudents,
      totalCompanies,
      totalInternships,
      placementRate,
      riskFlagged: 0 // Module 18
    },
    topStudents,
    domainDistribution,
    monthWisePlacement: [] // Placeholder
  }
}
`);

write('src/modules/dashboard/dashboard.controller.js', `
import * as dashboardService from './dashboard.service.js'

export const getStudentDash = async (req, res, next) => {
  try {
    const data = await dashboardService.getStudentDashboard(req.user.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getCompanyDash = async (req, res, next) => {
  try {
    const data = await dashboardService.getCompanyDashboard(req.user.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getAdminDash = async (req, res, next) => {
  try {
    const data = await dashboardService.getAdminDashboard()
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/dashboard/dashboard.routes.js', `
import express from 'express'
import * as dashboardController from './dashboard.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/student', protect, authorize('student'), dashboardController.getStudentDash)
router.get('/company', protect, authorize('company'), dashboardController.getCompanyDash)
router.get('/admin', protect, authorize('admin'), dashboardController.getAdminDash)

export default router
`);
