import api from './axiosInstance'

export const marketApi = {
  getPulse: () => api.get('/market/pulse'),
  getTrending: () => api.get('/market/trending')
}
