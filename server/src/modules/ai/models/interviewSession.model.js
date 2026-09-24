import mongoose from 'mongoose'

const interviewSessionSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  domain:     String,
  level:      String,
  questions:  [{ id: Number, question: String, type: { type: String } }],
  answers:    [{ questionId: Number, answer: String, score: Number, feedback: Object }],
  avgScore:   Number,
  completedAt:Date
})

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema)
