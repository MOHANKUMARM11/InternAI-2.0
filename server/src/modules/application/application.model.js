import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  internshipId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status:        {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  coverNote:     String,
  aiMatchScore:  Number,
  appliedAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now }
})

applicationSchema.index({ studentId: 1 })
applicationSchema.index({ internshipId: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true })

export const Application = mongoose.model('Application', applicationSchema)
