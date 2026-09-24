import mongoose from 'mongoose'

const marketDataSchema = new mongoose.Schema({
  domain:        String,
  location:      String,
  skills:        [{ skill: String, count: Number, change: Number }],
  totalJobs:     Number,
  avgStipend:    Number,
  fetchedAt:     { type: Date, default: Date.now, expires: '7d' } // Data older than 7 days cleaned up automatically (TTL index)
})

export const MarketData = mongoose.model('MarketData', marketDataSchema)
