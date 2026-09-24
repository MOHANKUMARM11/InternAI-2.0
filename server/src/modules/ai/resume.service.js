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

  const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume text and return a JSON object ONLY (no markdown, no explanation outside JSON).

Resume:
"""
${student.resumeText}
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
`

  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key_for_testing') {
      // Mock response for testing without API key
      const mockResult = {
        overallScore: 85,
        atsScore: 90,
        extractedSkills: ["React", "Node.js", "MongoDB", "Express"],
        strengths: ["Strong technical skills", "Clear formatting", "Good experience section"],
        improvements: [
          { issue: "Missing quantitative metrics", suggestion: "Add numbers to your achievements (e.g., 'improved performance by 20%')", priority: "high" },
          { issue: "Objective too generic", suggestion: "Tailor objective to specific role", priority: "medium" }
        ],
        missingKeywords: ["TypeScript", "Docker"],
        formattingIssues: [],
        summary: "[MOCK DATA] A strong full-stack developer profile. Needs more quantifiable achievements."
      }
      student.resumeScore = mockResult.overallScore
      student.skills = [...new Set([...student.skills, ...(mockResult.extractedSkills || [])])]
      student.resumeAnalysis = mockResult
      await student.save()
      return mockResult
    }

    const response = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const raw = response.content[0].text
    
    // Attempt to extract JSON if Claude added markdown
    const jsonMatch = raw.match(/\{.*\}/s)
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
