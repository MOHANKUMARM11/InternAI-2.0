import { Student } from '../../student/student.model.js'
import { Internship } from '../../internship/internship.model.js'
import { Application } from '../../application/application.model.js'
import { generateContent } from '../../../utils/geminiClient.js'
import { ApiError } from '../../../utils/ApiError.js'

export const getRecommendations = async (userId) => {
  const student = await Student.findOne({ userId })
  if (!student) throw new ApiError(404, 'Student not found')

  // Check cache (24 hours)
  if (student.cachedRecommendations && student.recommendedAt) {
    const hoursSince = (Date.now() - new Date(student.recommendedAt).getTime()) / (1000 * 60 * 60)
    if (hoursSince < 24) {
      return student.cachedRecommendations
    }
  }

  // Find all active internships user hasn't applied to
  const applications = await Application.find({ studentId: student._id })
  const appliedIds = applications.map(a => a.internshipId.toString())

  const internships = await Internship.find({ isActive: true })
  const available = internships.filter(i => !appliedIds.includes(i._id.toString()))

  if (available.length === 0) return []

  const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key_for_testing'

  if (isMock) {
    const mockRecs = available.slice(0, 3).map(i => ({
      internshipId: i._id,
      matchScore: Math.floor(Math.random() * 20) + 80, // 80-100
      matchReason: "[MOCK DATA] This internship aligns well with your reported skills."
    }))
    
    // Sort and populate
    const result = await Promise.all(mockRecs.map(async (r) => {
      const internship = await Internship.findById(r.internshipId).populate('companyId', 'companyName logoUrl location')
      return { ...r, internship }
    }))
    
    student.cachedRecommendations = result
    student.recommendedAt = new Date()
    await student.save()
    return result
  }

  const prompt = `
You are an internship matching expert.

Student Profile:
- Skills: ${student.skills.join(', ')}
- Career Goal: ${student.careerGoal || 'Not specified'}
- Preferred Domains: ${student.preferredDomains.join(', ')}
- Projects: ${student.projects.map(p => p.title + ': ' + p.techStack.join(', ')).join(' | ')}

Available Internships (JSON array):
${JSON.stringify(available.map(i => ({
  id: i._id,
  title: i.title,
  skills: i.skillsRequired,
  domain: i.domain,
  description: i.description.slice(0, 200)
})))}

Return a JSON array of the top 5 best matches ONLY:
[
  {
    "internshipId": "string",
    "matchScore": <0-100>,
    "matchReason": "1-2 sentence explanation why this fits the student"
  }
]
`
  try {
    const parsed = await generateContent(prompt, { json: true, retries: 1 })
    
    

    const populatedResult = await Promise.all(parsed.map(async (r) => {
      const internship = await Internship.findById(r.internshipId).populate('companyId', 'companyName logoUrl location')
      return { ...r, internship }
    }))

    student.cachedRecommendations = populatedResult
    student.recommendedAt = new Date()
    await student.save()

    return populatedResult
  } catch (error) {
    console.error('AI Recommendation failed:', error)
    throw new ApiError(500, 'Failed to generate recommendations')
  }
}
