import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'
import { startMarketSync } from './jobs/marketDataSync.js'
import { startProgressSync } from './jobs/progressSync.js'
import { initSocket } from './config/socket.js'
import http from 'http'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    startMarketSync()
    startProgressSync()
    
    const server = http.createServer(app)
    initSocket(server)

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}

startServer()
