import * as applicationService from './application.service.js'

export const apply = async (req, res, next) => {
  try {
    const data = await applicationService.applyToInternship(req.user.id, req.body.internshipId, req.body.coverNote)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getMyApplications = async (req, res, next) => {
  try {
    const data = await applicationService.getStudentApplications(req.user.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const getApplicants = async (req, res, next) => {
  try {
    const data = await applicationService.getInternshipApplications(req.user.id, req.params.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const updateStatus = async (req, res, next) => {
  try {
    const data = await applicationService.updateApplicationStatus(req.user.id, req.params.id, req.body.status)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const withdraw = async (req, res, next) => {
  try {
    await applicationService.withdrawApplication(req.user.id, req.params.id)
    res.status(200).json({ success: true, message: 'Application withdrawn successfully' })
  } catch (error) {
    next(error)
  }
}
