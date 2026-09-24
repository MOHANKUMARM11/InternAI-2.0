import api from './axiosInstance'

export const peerApi = {
  bookSession: (data) => api.post('/peer/book', data),
  getSessions: () => api.get('/peer/sessions'),
  evaluateSession: (sessionId, transcript) => api.post(`/peer/evaluate/${sessionId}`, { transcript }),
  getLeaderboard: () => api.get('/peer/leaderboard')
}
