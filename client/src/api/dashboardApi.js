import api from './axiosInstance'

export const dashboardApi = {
  getStudentDashboard: () => api.get('/dashboard/student'),
  getCompanyDashboard: () => api.get('/dashboard/company'),
  getAdminDashboard: () => api.get('/dashboard/admin')
}
