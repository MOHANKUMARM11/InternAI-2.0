import * as companyService from './company.service.js'

export const getMe = async (req, res, next) => {
  try {
    const profile = await companyService.getProfile(req.user.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const profile = await companyService.updateProfile(req.user.id, req.body)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const uploadLogo = async (req, res, next) => {
  try {
    const profile = await companyService.uploadLogo(req.user.id, req.file)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export const getCompany = async (req, res, next) => {
  try {
    const profile = await companyService.getProfileById(req.params.id)
    res.status(200).json({ success: true, data: profile })
  } catch (error) {
    next(error)
  }
}
