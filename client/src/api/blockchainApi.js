import api from './axiosInstance'

export const blockchainApi = {
  getMyCredentials: () => api.get('/blockchain/my-credentials'),
  mintCredential: (applicationId) => api.post('/blockchain/mint', { applicationId }) // Used by company/admin
}
