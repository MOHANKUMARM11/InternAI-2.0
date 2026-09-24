import mongoose from 'mongoose'

const roadmapSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  targetRole: String,
  gapSkills:  [String],
  steps:      [{
    id:          String,
    week:        Number,
    skill:       String,
    resource:    String,
    resourceUrl: String,
    type:        { type: String, enum: ['course', 'project', 'certification', 'practice'] },
    completed:   { type: Boolean, default: false }
  }],
  estimatedWeeks: Number,
  generatedAt: { type: Date, default: Date.now }
})

export const Roadmap = mongoose.model('Roadmap', roadmapSchema)
