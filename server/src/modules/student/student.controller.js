import * as studentService from './student.service.js'

export const getMe = async (req, res, next) => {
  try {
    const profile = await studentService.getProfile(req.user.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const profile = await studentService.updateProfile(req.user.id, req.body)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const uploadResume = async (req, res, next) => {
  try {
    const profile = await studentService.uploadResume(req.user.id, req.file)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const getStudent = async (req, res, next) => {
  try {
    const profile = await studentService.getProfileById(req.params.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}
