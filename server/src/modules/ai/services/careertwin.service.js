import { TwinConversation } from '../models/twinConversation.model.js'
import { Application } from '../../application/application.model.js'
import { Student } from '../../student/student.model.js'
import { Company } from '../../company/company.model.js'
import { generateContent } from '../../../utils/geminiClient.js'
import { ApiError } from '../../../utils/ApiError.js'

export const chatWithTwin = async (companyUserId, applicationId, message, history = []) => {
  const company = await Company.findOne({ userId: companyUserId })
  if (!company) throw new ApiError(403, 'Only companies can chat with twins')

  const application = await Application.findById(applicationId)
  if (!application) throw new ApiError(404, 'Application not found')
  
  const student = await Student.findById(application.studentId)

  // Find or create conversation
  let conversation = await TwinConversation.findOne({ applicationId })
  if (!conversation) {
    conversation = await TwinConversation.create({
      applicationId,
      companyId: company._id,
      studentId: student._id,
      messages: []
    })
  }

  const systemPrompt = `
You are an AI representation of ${student.name}, responding to a company recruiter during a pre-interview screening.

About ${student.name}:
- Skills: ${student.skills.join(', ')}
- Education: ${student.education.map(e => `${e.degree} from ${e.institution}`).join('; ')}
- Projects: ${student.projects.map(p => `${p.title} (${p.techStack.join(', ')}): ${p.description}`).join(' | ')}
- Experience: ${student.experience.map(e => `${e.role} at ${e.company}`).join('; ') || 'No prior work experience'}
- Career Goal: ${student.careerGoal || 'Software Engineer'}
- GitHub: ${student.portfolioLinks?.github || 'Not provided'}

Rules:
- Respond in first person as ${student.name}
- Only share information present in the profile above — do not invent skills or experience
- Keep responses honest and concise (under 100 words)
- If asked something not in the profile, say "That's not something I can speak to in this format — you can ask me directly in the interview"
- Do not reveal that you are an AI unless directly asked
`

  const isMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key_for_testing'
  let replyText = ''

  if (isMock) {
    replyText = `[MOCK TWIN] Hello, I am the Career Twin of ${student.name}. Based on my profile, I have skills in ${student.skills.join(', ')}. You asked: "${message}".`
  } else {
    const formattedHistory = history.map(m => ({
      role: m.role === 'company' ? 'user' : 'assistant',
      content: m.content
    }))
    const messages = [...formattedHistory.slice(-8), { role: 'user', content: message }]

    try {
      const prompt = history.map(h => `${h.role}: ${h.content}`).join('\\n') + `\\nuser: ${message}`;
      replyText = await generateContent(prompt, { systemInstruction: systemPrompt, json: false });
    } catch (err) {
      throw new ApiError(500, 'Career Twin failed to respond')
    }
  }

  // Save to DB
  conversation.messages.push({ role: 'company', content: message })
  conversation.messages.push({ role: 'twin', content: replyText })
  await conversation.save()

  return replyText
}

export const getTwinHistory = async (applicationId) => {
  const conversation = await TwinConversation.findOne({ applicationId })
  return conversation ? conversation.messages : []
}
