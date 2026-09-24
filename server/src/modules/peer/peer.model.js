import mongoose from 'mongoose'

const peerSessionSchema = new mongoose.Schema({
  studentA:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentB:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  domain:      String,
  status:      { type: String, enum: ['waiting', 'matched', 'active', 'completed', 'cancelled'], default: 'waiting' },
  scheduledAt: Date,
  roomId:      String,        // Socket.IO room ID
  questions:   [{ id: Number, question: String }],
  transcript:  [{ speaker: String, text: String, timestamp: Date }],
  evaluation: {
    interviewerScore: Number,
    intervieweeScore: Number,
    interviewerFeedback: String,
    intervieweeFeedback: String
  },
  xpAwarded:   Boolean,
  createdAt:   { type: Date, default: Date.now }
})

export const PeerSession = mongoose.model('PeerSession', peerSessionSchema)
