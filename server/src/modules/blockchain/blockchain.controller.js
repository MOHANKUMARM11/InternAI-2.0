import * as blockchainService from './blockchain.service.js'
import { Student } from '../student/student.model.js'

export const getMyCredentials = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })

    const credentials = await blockchainService.getCredentials(student._id)
    res.status(200).json({ success: true, data: credentials })
  } catch (err) {
    next(err)
  }
}

export const mintCredential = async (req, res, next) => {
  try {
    const { applicationId } = req.body
    
    // In a real app, only companies or admins should trigger this for a completed internship
    const credential = await blockchainService.mintCredential(applicationId)
    res.status(200).json({ success: true, data: credential })
  } catch (err) {
    next(err)
  }
}
