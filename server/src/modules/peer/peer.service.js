import { PeerSession } from './peer.model.js'
import { Student } from '../student/student.model.js'
import { v4 as uuidv4 } from 'uuid'
import { generateContent } from '../../utils/geminiClient.js'
import { ApiError } from '../../utils/ApiError.js'

export const bookSession = async (studentId, domain, scheduledAt) => {
  // Check if there's a waiting session for this domain
  let session = await PeerSession.findOne({ status: 'waiting', domain, studentA: { $ne: studentId } })

  if (session) {
    session.studentB = studentId
    session.status = 'matched'
    session.roomId = uuidv4()
    // Generate questions
    try {
       const prompt = `Generate 5 technical interview questions for a ${domain} internship interview.
Return JSON ONLY in this exact format:
{
  "questions": [
    { "id": 1, "question": "Question 1" }
  ]
}
`
       const response = await generateContent(prompt, { json: true, retries: 1 })
       session.questions = response.questions || [
         { id: 1, question: "What is your favorite programming language and why?" },
         { id: 2, question: `Describe a challenging project you've worked on in ${domain}.` }
       ]
    } catch(err) {
       console.error("Failed to generate questions, using fallback", err)
       session.questions = [
         { id: 1, question: "What is your favorite programming language and why?" },
         { id: 2, question: `Describe a challenging project you've worked on in ${domain}.` }
       ]
    }
    
    await session.save()
    return session
  } else {
    // Create new waiting session
    session = await PeerSession.create({
      studentA: studentId,
      domain,
      scheduledAt,
      status: 'waiting'
    })
    return session
  }
}

export const getSessions = async (studentId) => {
  return await PeerSession.find({
    $or: [{ studentA: studentId }, { studentB: studentId }]
  }).sort({ createdAt: -1 })
}

export const evaluateSession = async (sessionId, transcript, studentId) => {
  const session = await PeerSession.findById(sessionId)
  if (!session) throw new ApiError(404, 'Session not found')
  
  if (session.status === 'completed') return session
  
  session.transcript = transcript
  session.status = 'completed'

  // Mock evaluation for speed and budget, or call AI
  let evaluation = {
    interviewerScore: 85,
    intervieweeScore: 80,
    interviewerFeedback: "Good structure in asking questions.",
    intervieweeFeedback: "Clear answers, but could elaborate more."
  }
  
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_key_for_testing') {
     try {
         const prompt = `Evaluate this mock interview transcript.
Transcript:
${JSON.stringify(transcript)}

Return JSON ONLY:
{
  "interviewerScore": <0-100>,
  "intervieweeScore": <0-100>,
  "interviewerFeedback": "Brief feedback",
  "intervieweeFeedback": "Brief feedback"
}
`
         const response = await generateContent(prompt, { json: true, retries: 1 })
         evaluation = response
     } catch (err) {
         console.error('Peer evaluation failed', err)
     }
  }

  session.evaluation = evaluation
  session.xpAwarded = true
  await session.save()

  // Award XP
  if (session.studentA) {
      await Student.findByIdAndUpdate(session.studentA, { $inc: { peerXp: 40 } })
  }
  if (session.studentB) {
      await Student.findByIdAndUpdate(session.studentB, { $inc: { peerXp: 40 } })
  }

  return session
}

export const getLeaderboard = async () => {
   // Assuming students have a peerXp field
   // For now just sort by existing students and return
   return await Student.find({}, 'name college peerXp').sort({ peerXp: -1 }).limit(10)
}
