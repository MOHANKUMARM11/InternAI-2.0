import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college:      String,
  cgpa:         { type: Number, min: 0, max: 10 },
  skills:       [{ type: String }],
  education:    [{
    degree:     String,
    institution:String,
    year:       Number,
    percentage: Number
  }],
  projects:     [{
    title:      String,
    description:String,
    techStack:  [String],
    link:       String
  }],
  experience:   [{
    role:       String,
    company:    String,
    duration:   String,
    description:String
  }],
  portfolioLinks: {
    github:     String,
    linkedin:   String,
    website:    String
  },
  resumeUrl:    String,
  resumeText:   String,
  resumeScore:  { type: Number, default: null },
  resumeAnalysis: { type: Object, default: null },
  githubScore:  { type: Number, default: null },
  interviewScore: { type: Number, default: null },
  careerGoal:   String,
  preferredDomains: [String],
  updatedAt:    { type: Date, default: Date.now }
})

studentSchema.index({ userId: 1 })
studentSchema.index({ skills: 1 })

export const Student = mongoose.model('Student', studentSchema)
