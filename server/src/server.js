import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'
import { startMarketSync } from './jobs/marketDataSync.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    startMarketSync()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}

startServer()
