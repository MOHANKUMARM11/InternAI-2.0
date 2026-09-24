import api from './axiosInstance'

export const studentApi = {
  getProfile: () => api.get('/students/me'),
  updateProfile: (data) => api.put('/students/me', data),
  uploadResume: (file) => {
    const formData = new FormData()
    formData.append('resume', file)
    return api.post('/students/me/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
