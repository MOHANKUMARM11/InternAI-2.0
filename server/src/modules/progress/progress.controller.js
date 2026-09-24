import * as progressService from './progress.service.js'
import { Student } from '../student/student.model.js'
import { Company } from '../company/company.model.js'

export const getMyProgress = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })

    const progress = await progressService.getStudentProgress(student._id)
    res.status(200).json({ success: true, data: progress })
  } catch (err) {
    next(err)
  }
}

export const getCompanyProgress = async (req, res, next) => {
  try {
    const company = await Company.findOne({ userId: req.user.id })
    if (!company) return res.status(404).json({ success: false, error: 'Company not found' })

    const progress = await progressService.getCompanyProgress(company._id)
    res.status(200).json({ success: true, data: progress })
  } catch (err) {
    next(err)
  }
}

export const submitUpdate = async (req, res, next) => {
  try {
    const { progressId } = req.params
    const { updateText } = req.body
    
    const student = await Student.findOne({ userId: req.user.id })
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })

    const result = await progressService.submitUpdate(progressId, student._id, updateText)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

// Admin / Trigger endpoint for testing
export const triggerWeeklyPrompts = async (req, res, next) => {
  try {
    await progressService.generateWeeklyPrompts()
    res.status(200).json({ success: true, message: 'Prompts generated' })
  } catch (err) {
    next(err)
  }
}
