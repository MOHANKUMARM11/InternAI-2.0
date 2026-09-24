import * as resumeService from './resume.service.js'

export const analyzeResume = async (req, res, next) => {
  try {
    const result = await resumeService.analyzeResume(req.user.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
