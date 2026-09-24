import * as peerService from './peer.service.js'
import { Student } from '../student/student.model.js'

export const bookSession = async (req, res, next) => {
  try {
    const { domain, scheduledAt } = req.body
    
    // Find student
    const student = await Student.findOne({ userId: req.user.id })
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })

    const session = await peerService.bookSession(student._id, domain, scheduledAt)
    res.status(200).json({ success: true, data: session })
  } catch (err) {
    next(err)
  }
}

export const getSessions = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })

    const sessions = await peerService.getSessions(student._id)
    res.status(200).json({ success: true, data: sessions })
  } catch (err) {
    next(err)
  }
}

export const evaluateSession = async (req, res, next) => {
  try {
    const { transcript } = req.body
    const { sessionId } = req.params
    
    const student = await Student.findOne({ userId: req.user.id })
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })

    const session = await peerService.evaluateSession(sessionId, transcript, student._id)
    res.status(200).json({ success: true, data: session })
  } catch (err) {
    next(err)
  }
}

export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await peerService.getLeaderboard()
    res.status(200).json({ success: true, data: leaderboard })
  } catch (err) {
    next(err)
  }
}
