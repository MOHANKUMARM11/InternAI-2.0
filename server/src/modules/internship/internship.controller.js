import * as internshipService from './internship.service.js'

export const createInternship = async (req, res, next) => {
  try {
    const data = await internshipService.createInternship(req.user.id, req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const searchInternships = async (req, res, next) => {
  try {
    const result = await internshipService.searchInternships(req.query)
    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}

export const getInternship = async (req, res, next) => {
  try {
    const data = await internshipService.getInternship(req.params.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const updateInternship = async (req, res, next) => {
  try {
    const data = await internshipService.updateInternship(req.user.id, req.params.id, req.body)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

export const deleteInternship = async (req, res, next) => {
  try {
    await internshipService.deleteInternship(req.user.id, req.params.id)
    res.status(200).json({ success: true, message: 'Internship deleted' })
  } catch (error) {
    next(error)
  }
}

export const getMyInternships = async (req, res, next) => {
  try {
    const data = await internshipService.getCompanyInternships(req.user.id)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
