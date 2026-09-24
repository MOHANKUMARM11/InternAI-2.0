const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/utils/claudeClient.js', `
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

export const claudeClient = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_testing' 
})
`);

write('src/modules/ai/resume.service.js', `
import { Student } from '../student/student.model.js'
import { ApiError } from '../../utils/ApiError.js'
import { claudeClient } from '../../utils/claudeClient.js'

export const analyzeResume = async (userId) => {
  const student = await Student.findOne({ userId })
  if (!student) throw new ApiError(404, 'Student not found')
  if (!student.resumeText) throw new ApiError(400, 'No resume text available for analysis. Please update your profile with a resume.')

  // Check if recently analyzed to cache
  if (student.resumeScore && student.resumeAnalysis) {
    return student.resumeAnalysis
  }

  const prompt = \`
You are an expert ATS resume analyzer and career coach.

Analyze the following resume text and return a JSON object ONLY (no markdown, no explanation outside JSON).

Resume:
"""
\${student.resumeText}
"""

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "extractedSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    { "issue": "string", "suggestion": "string", "priority": "high|medium|low" }
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "formattingIssues": ["issue1", "issue2"],
  "summary": "2 sentence summary of the candidate"
}
\`

  try {
    const response = await claudeClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const raw = response.content[0].text
    
    // Attempt to extract JSON if Claude added markdown
    const jsonMatch = raw.match(/\\{.*\\}/s)
    if (!jsonMatch) throw new Error('No JSON found in response')
    
    const result = JSON.parse(jsonMatch[0])

    student.resumeScore = result.overallScore
    student.skills = [...new Set([...student.skills, ...(result.extractedSkills || [])])]
    student.resumeAnalysis = result
    await student.save()

    return result
  } catch (error) {
    console.error('AI Analysis failed:', error)
    throw new ApiError(500, 'AI analysis failed, please try again')
  }
}
`);

write('src/modules/ai/ai.controller.js', `
import * as resumeService from './resume.service.js'

export const analyzeResume = async (req, res, next) => {
  try {
    const result = await resumeService.analyzeResume(req.user.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
`);

write('src/modules/ai/ai.routes.js', `
import express from 'express'
import * as aiController from './ai.controller.js'
import { protect, authorize } from '../../middlewares/auth.middleware.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: { success: false, message: 'Too many analysis requests from this IP, please try again after an hour' }
})

router.post('/resume-analysis', protect, authorize('student'), aiLimiter, aiController.analyzeResume)

export default router
`);
