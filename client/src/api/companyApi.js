import api from './axiosInstance'

export const companyApi = {
  getProfile: () => api.get('/companies/me'),
  updateProfile: (data) => api.put('/companies/me', data),
  uploadLogo: (file) => {
    const formData = new FormData()
    formData.append('logo', file)
    return api.post('/companies/me/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getCompanyById: (id) => api.get(`/companies/${id}`)
}
