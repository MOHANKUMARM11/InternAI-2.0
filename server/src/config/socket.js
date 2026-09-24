import { Server } from 'socket.io'
import { PeerSession } from '../modules/peer/peer.model.js'

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.on('join_session', async ({ sessionId, studentId }) => {
      const session = await PeerSession.findById(sessionId)
      if (!session) return

      socket.join(session.roomId)
      
      const role = session.studentA.toString() === studentId ? 'interviewer' : 'interviewee'
      const partnerName = role === 'interviewer' ? 'Partner' : 'Partner' // You could fetch real name

      socket.emit('session_ready', { roomId: session.roomId, partnerName, role })
    })

    socket.on('send_message', async ({ roomId, text, speaker }) => {
      // Broadcast to others in room
      io.to(roomId).emit('receive_message', { text, speaker, timestamp: new Date() })
    })

    socket.on('end_session', async ({ roomId }) => {
      // You could update status here if needed
      io.to(roomId).emit('session_ended')
      // clean up rooms after a delay
      setTimeout(() => {
        io.socketsLeave(roomId)
      }, 5000)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)
    })
  })

  return io
}
