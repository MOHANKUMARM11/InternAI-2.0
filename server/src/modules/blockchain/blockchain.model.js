import mongoose from 'mongoose'

const credentialSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  transactionHash: String,
  tokenId:     String,
  metadataUrl: String,
  status:      { type: String, enum: ['pending', 'minted', 'failed'], default: 'pending' },
  issuedAt:    { type: Date, default: Date.now }
})

export const Credential = mongoose.model('Credential', credentialSchema)
