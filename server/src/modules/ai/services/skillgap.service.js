import { Roadmap } from '../models/roadmap.model.js'
import { Student } from '../../student/student.model.js'
import { claudeClient } from '../../../utils/claudeClient.js'
import { ApiError } from '../../../utils/ApiError.js'

export const generateRoadmap = async (userId, targetRole) => {
  const student = await Student.findOne({ userId })
  if (!student) throw new ApiError(404, 'Student not found')

  const allTechUsed = student.projects.flatMap(p => p.techStack)

  const isMock = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key_for_testing'
  if (isMock) {
    const mockRoadmap = {
      gapSkills: ["[MOCK DATA] Advanced React", "GraphQL"],
      estimatedWeeks: 4,
      steps: [
        { id: "step_1", week: 1, skill: "Advanced React", resource: "React Docs", resourceUrl: "https://react.dev", type: "course" },
        { id: "step_2", week: 2, skill: "GraphQL", resource: "Apollo Server Tutorial", resourceUrl: "https://apollographql.com", type: "practice" }
      ]
    }
    const roadmap = await Roadmap.create({
      studentId: student._id,
      targetRole,
      ...mockRoadmap
    })
    return roadmap
  }

  const prompt = `
Student current skills: ${student.skills.join(', ')}
Student's projects tech stack: ${allTechUsed.join(', ')}
Target role: ${targetRole}

Return a JSON learning roadmap ONLY:
{
  "gapSkills": ["skill1", "skill2"],
  "estimatedWeeks": <number>,
  "steps": [
    {
      "id": "step_1",
      "week": 1,
      "skill": "string",
      "resource": "Resource name (e.g., React official docs)",
      "resourceUrl": "https://...",
      "type": "course|project|certification|practice"
    }
  ]
}

Rules:
- Max 12 steps
- Order from foundations to advanced
- Prefer free resources (MDN, freeCodeCamp, official docs)
- Include at least 2 project-type steps
`

  try {
    const response = await claudeClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })

    const raw = response.content[0].text
    const jsonMatch = raw.match(/\{.*\}/s)
    const result = JSON.parse(jsonMatch[0])

    const roadmap = await Roadmap.create({
      studentId: student._id,
      targetRole,
      ...result
    })

    return roadmap
  } catch (error) {
    throw new ApiError(500, 'Failed to generate roadmap')
  }
}

export const getRoadmap = async (userId) => {
  const student = await Student.findOne({ userId })
  return await Roadmap.findOne({ studentId: student._id }).sort({ generatedAt: -1 })
}

export const completeStep = async (userId, stepId) => {
  const student = await Student.findOne({ userId })
  const roadmap = await Roadmap.findOne({ studentId: student._id }).sort({ generatedAt: -1 })
  if (!roadmap) throw new ApiError(404, 'Roadmap not found')
  
  const step = roadmap.steps.find(s => s.id === stepId)
  if (step) {
    step.completed = true
    await roadmap.save()
  }
  return roadmap
}
