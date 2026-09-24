import api from './axiosInstance'

export const progressApi = {
  getMyProgress: () => api.get('/progress/student'),
  getCompanyProgress: () => api.get('/progress/company'),
  submitUpdate: (progressId, data) => api.post(`/progress/${progressId}/submit`, data)
}
