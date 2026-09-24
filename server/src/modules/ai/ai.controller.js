import * as resumeService from './resume.service.js'
import * as recommendationService from './services/recommendation.service.js'
import * as interviewService from './services/interview.service.js'
import * as chatbotService from './services/chatbot.service.js'
import * as skillgapService from './services/skillgap.service.js'
import * as careertwinService from './services/careertwin.service.js'

export const analyzeResume = async (req, res, next) => {
  try {
    const result = await resumeService.analyzeResume(req.user.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getRecommendations = async (req, res, next) => {
  try {
    const result = await recommendationService.getRecommendations(req.user.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const generateQuestions = async (req, res, next) => {
  try {
    const result = await interviewService.generateQuestions(req.user.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const evaluateAnswer = async (req, res, next) => {
  try {
    const result = await interviewService.evaluateAnswer(req.user.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const saveInterviewSession = async (req, res, next) => {
  try {
    const result = await interviewService.saveSession(req.user.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const chatWithBot = async (req, res, next) => {
  try {
    const { message, history } = req.body
    const result = await chatbotService.chat(req.user.id, message, history)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const generateRoadmap = async (req, res, next) => {
  try {
    const { targetRole } = req.body
    const result = await skillgapService.generateRoadmap(req.user.id, targetRole)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getRoadmap = async (req, res, next) => {
  try {
    const result = await skillgapService.getRoadmap(req.user.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const completeRoadmapStep = async (req, res, next) => {
  try {
    const { stepId } = req.body
    const result = await skillgapService.completeStep(req.user.id, stepId)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const chatWithTwin = async (req, res, next) => {
  try {
    const { applicationId } = req.params
    const { message, history } = req.body
    const result = await careertwinService.chatWithTwin(req.user.id, applicationId, message, history)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getTwinHistory = async (req, res, next) => {
  try {
    const { applicationId } = req.params
    const result = await careertwinService.getTwinHistory(applicationId)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
