import mongoose from 'mongoose'

const twinConversationSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  companyId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  messages:      [{ role: { type: String, enum: ['company', 'twin'] }, content: String, timestamp: { type: Date, default: Date.now } }],
  createdAt:     { type: Date, default: Date.now }
})

export const TwinConversation = mongoose.model('TwinConversation', twinConversationSchema)
