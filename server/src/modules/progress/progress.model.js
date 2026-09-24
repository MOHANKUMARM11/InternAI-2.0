import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  weekNumber:  { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'submitted'], default: 'pending' },
  updateText:  String,
  sentimentScore: Number,       // AI analyzed score (e.g., 0-100)
  atRisk:      { type: Boolean, default: false },
  aiFeedback:  String,
  dueDate:     Date,
  submittedAt: Date,
  createdAt:   { type: Date, default: Date.now }
})

export const Progress = mongoose.model('Progress', progressSchema)
