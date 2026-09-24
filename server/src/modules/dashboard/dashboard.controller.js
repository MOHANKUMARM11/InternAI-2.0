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
