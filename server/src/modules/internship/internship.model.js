import mongoose from 'mongoose'

const internshipSchema = new mongoose.Schema({
  companyId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  skillsRequired: [String],
  domain:        { type: String, enum: ['Frontend', 'Backend', 'Full-Stack', 'Data Science', 'ML/AI', 'DevOps', 'Design', 'Marketing', 'Finance', 'HR', 'Other'] },
  stipend:       { type: Number },
  duration:      String,             // e.g. "2 months"
  location:      String,
  isRemote:      { type: Boolean, default: false },
  openings:      { type: Number, default: 1 },
  applyDeadline: Date,
  isActive:      { type: Boolean, default: true },
  postedAt:      { type: Date, default: Date.now },
  applicantCount: { type: Number, default: 0 }
})

internshipSchema.index({ isActive: 1, domain: 1, isRemote: 1 })
internshipSchema.index({ skillsRequired: 1 })
internshipSchema.index({ stipend: 1 })

export const Internship = mongoose.model('Internship', internshipSchema)
