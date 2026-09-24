import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName:  { type: String, required: true },
  industry:     String,
  description:  String,
  website:      String,
  logoUrl:      String,
  size:         { type: String, enum: ['1-10', '11-50', '51-200', '200+'] },
  location:     String,
  cultureValues: [String],
  workStyle:    { type: String, enum: ['remote', 'onsite', 'hybrid'] },
  createdAt:    { type: Date, default: Date.now }
})

export const Company = mongoose.model('Company', companySchema)
