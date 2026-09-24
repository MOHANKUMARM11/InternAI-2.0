import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['student', 'company', 'admin'], required: true },
  isVerified:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
})

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  this.passwordHash = await bcrypt.hash(this.passwordHash, parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'))
  
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.index({ email: 1 })

export const User = mongoose.model('User', userSchema)
