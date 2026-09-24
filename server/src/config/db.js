import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 50 })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('DB connection error:', err)
    process.exit(1)
  }
}
