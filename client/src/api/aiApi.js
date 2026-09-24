import api from './axiosInstance'

export const aiApi = {
  analyzeResume: () => api.post('/ai/resume-analysis')
}
