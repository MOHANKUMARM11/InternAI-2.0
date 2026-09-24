import { InterviewSession } from '../models/interviewSession.model.js'
import { Student } from '../../student/student.model.js'
import { generateContent } from '../../../utils/geminiClient.js'
import { ApiError } from '../../../utils/ApiError.js'

export const generateQuestions = async (userId, { domain, level }) => {
  const student = await Student.findOne({ userId })
  if (!student) throw new ApiError(404, 'Student not found')

  const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key_for_testing'
  if (isMock) {
    const mockQuestions = Array(10).fill(0).map((_, i) => ({
      id: i + 1,
      type: i < 7 ? "technical" : "behavioral",
      question: `[MOCK DATA] Sample ${domain} question ${i + 1}`,
      hint: "Sample hint for testing"
    }))
    return { questions: mockQuestions }
  }

  const prompt = `
Generate exactly 10 interview questions for a ${domain} developer internship at ${level} level.
Mix 7 technical questions and 3 behavioral questions.

Return JSON ONLY:
{
  "questions": [
    {
      "id": 1,
      "type": "technical|behavioral",
      "question": "string",
      "hint": "what a good answer should cover in 1 sentence"
    }
  ]
}
`

  try {
    const parsed = await generateContent(prompt, { json: true, retries: 1 })

    const raw = response.content[0].text
    const jsonMatch = raw.match(/\{.*\}/s)
    const result = JSON.parse(jsonMatch[0])
    return result
  } catch (error) {
    throw new ApiError(500, 'Failed to generate questions')
  }
}

export const evaluateAnswer = async (userId, { question, answer, domain }) => {
  const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key_for_testing'
  if (isMock) {
    return {
      score: 8,
      verdict: "Strong",
      whatWasGood: "[MOCK DATA] Good effort.",
      whatWasMissing: "Could be more detailed.",
      betterAnswer: "This is a placeholder for a better answer."
    }
  }

  const prompt = `
You are a technical interviewer evaluating an internship candidate's answer.

Question: "${question}"
Domain: ${domain}
Candidate's Answer: "${answer}"

Return JSON ONLY:
{
  "score": <0-10>,
  "verdict": "Strong|Adequate|Needs Work",
  "whatWasGood": "string",
  "whatWasMissing": "string",
  "betterAnswer": "A sample strong answer in 2-3 sentences"
}
`
  try {
    const parsed = await generateContent(prompt, { json: true, retries: 1 })
    const raw = response.content[0].text
    const jsonMatch = raw.match(/\{.*\}/s)
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    throw new ApiError(500, 'Evaluation failed')
  }
}

export const saveSession = async (userId, sessionData) => {
  const student = await Student.findOne({ userId })
  
  const sumScores = sessionData.answers.reduce((acc, a) => acc + (a.score || 0), 0)
  const avgScore = sumScores / (sessionData.answers.length || 1)
  
  const session = await InterviewSession.create({
    studentId: student._id,
    ...sessionData,
    avgScore,
    completedAt: new Date()
  })

  // Update overall interview score (simple average of all sessions)
  const allSessions = await InterviewSession.find({ studentId: student._id })
  const totalSessionScores = allSessions.reduce((acc, s) => acc + s.avgScore, 0)
  student.interviewScore = (totalSessionScores / allSessions.length) * 10 // scale to 100
  await student.save()

  return session
}
