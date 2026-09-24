import api from './axiosInstance'

export const internshipApi = {
  searchInternships: (params) => api.get('/internships', { params }),
  getInternshipById: (id) => api.get(`/internships/${id}`),
  getCompanyInternships: () => api.get('/internships/company/mine'),
  createInternship: (data) => api.post('/internships', data),
  updateInternship: (id, data) => api.put(`/internships/${id}`, data),
  deleteInternship: (id) => api.delete(`/internships/${id}`)
}
