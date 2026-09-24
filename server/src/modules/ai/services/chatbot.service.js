import { Student } from '../../student/student.model.js'
import { generateContent } from '../../../utils/geminiClient.js'
import { ApiError } from '../../../utils/ApiError.js'

export const chat = async (userId, message, history = []) => {
  const student = await Student.findOne({ userId })
  if (!student) throw new ApiError(404, 'Student not found')

  const systemPrompt = `
You are a personalized AI career coach for an engineering student.

Student context:
- Name: ${student.name}
- Skills: ${student.skills.join(', ')}
- Career Goal: ${student.careerGoal || 'not set'}
- CGPA: ${student.cgpa || 'N/A'}
- Projects: ${student.projects.map(p => p.title).join(', ')}

Answer career questions directly and specifically. Reference the student's actual skills and goals.
Keep responses concise (under 150 words) unless the student asks for a detailed explanation.
`

  const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key_for_testing'
  if (isMock) {
    return `[MOCK DATA] Hello ${student.name}, as your AI career coach I see you are interested in ${student.careerGoal || 'technology'}. Your message was: "${message}". How can I further assist you?`
  }

  const messages = [
    ...history.slice(-10),    // Last 10 turns
    { role: 'user', content: message }
  ]

  try {
    // We format history and current message into one string for gemini
    const prompt = history.map(h => `${h.role}: ${h.content}`).join('\\n') + `\\nuser: ${message}`;
    
    const result = await generateContent(prompt, {
      systemInstruction: systemPrompt,
      json: false
    });
    return result;
  } catch (error) {
    throw new ApiError(500, 'Chatbot failed to respond')
  }
}
