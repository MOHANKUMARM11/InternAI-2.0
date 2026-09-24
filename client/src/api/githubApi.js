import api from './axiosInstance'

export const githubApi = {
  analyze: () => api.post('/github/analyze'),
  getReport: () => api.get('/github/report')
}
