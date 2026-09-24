import api from './axiosInstance'

export const applicationApi = {
  applyToInternship: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/me'),
  withdrawApplication: (id) => api.delete(`/applications/${id}`),
  getInternshipApplicants: (internshipId) => api.get(`/applications/internship/${internshipId}`),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status })
}
