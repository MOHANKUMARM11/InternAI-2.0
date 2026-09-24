import { Progress } from './progress.model.js'
import { generateContent } from '../../utils/geminiClient.js'
import { ApiError } from '../../utils/ApiError.js'
import { Application } from '../application/application.model.js'

export const getStudentProgress = async (studentId) => {
  return await Progress.find({ student: studentId }).populate('company', 'name').sort({ weekNumber: -1 })
}

export const getCompanyProgress = async (companyId) => {
  return await Progress.find({ company: companyId }).populate('student', 'name').sort({ submittedAt: -1 })
}

export const submitUpdate = async (progressId, studentId, updateText) => {
  const progress = await Progress.findOne({ _id: progressId, student: studentId })
  if (!progress) throw new ApiError(404, 'Progress entry not found')

  if (progress.status === 'submitted') throw new ApiError(400, 'Already submitted for this week')

  // Analyze sentiment and flag if at-risk using Gemini
  let sentimentScore = 80 // Default mock positive score
  let atRisk = false
  let aiFeedback = "Keep up the good work!"

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_key_for_testing') {
     try {
         const prompt = `Analyze this internship weekly update text: "${updateText}"
Return JSON ONLY:
{
  "sentimentScore": <0-100, where 0 is very negative and 100 is very positive>,
  "atRisk": <true/false based on sentiment being below 40 or mentions of severe blocking issues>,
  "feedback": "Short constructive feedback for the student"
}`
         const res = await generateContent(prompt, { json: true, retries: 1 })
         sentimentScore = res.sentimentScore || sentimentScore
         atRisk = res.atRisk || false
         aiFeedback = res.feedback || aiFeedback
     } catch (err) {
         console.error('Sentiment analysis failed', err)
     }
  }

  progress.updateText = updateText
  progress.status = 'submitted'
  progress.submittedAt = new Date()
  progress.sentimentScore = sentimentScore
  progress.atRisk = atRisk
  progress.aiFeedback = aiFeedback

  await progress.save()
  return progress
}

export const generateWeeklyPrompts = async () => {
  // Find all active applications (status = 'accepted' assuming this means active internship)
  const activeApps = await Application.find({ status: 'accepted' })
  
  for (const app of activeApps) {
     // Check if there's already a pending progress for this week
     const existing = await Progress.findOne({ application: app._id }).sort({ weekNumber: -1 })
     
     const nextWeek = existing ? existing.weekNumber + 1 : 1
     
     // Only create if last one was submitted or it's the first one
     if (!existing || existing.status === 'submitted') {
        await Progress.create({
           application: app._id,
           student: app.student,
           company: app.company,
           weekNumber: nextWeek,
           dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
     }
  }
}

export const getProgressReport = async (applicationId) => {
   return await Progress.find({ application: applicationId }).sort({ weekNumber: 1 })
}
