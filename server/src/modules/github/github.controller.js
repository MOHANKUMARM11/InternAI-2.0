import * as githubService from './github.service.js'

export const analyzeGithub = async (req, res, next) => {
  try {
    const report = await githubService.analyzeGithubProfile(req.user.id)
    res.status(200).json({ success: true, data: report })
  } catch (error) {
    next(error)
  }
}

export const getReport = async (req, res, next) => {
  try {
    const report = await githubService.getLatestReport(req.user.id)
    res.status(200).json({ success: true, data: report })
  } catch (error) {
    next(error)
  }
}
