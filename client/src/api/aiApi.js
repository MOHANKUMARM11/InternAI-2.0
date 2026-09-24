import api from './axiosInstance'

export const aiApi = {
  analyzeResume: () => api.post('/ai/resume-analysis'),
  
  // M8: AI Recommendations
  getRecommendations: () => api.post('/ai/recommendations'),

  // M9: Interview Prep
  generateInterviewQuestions: (data) => api.post('/ai/interview/questions', data),
  evaluateInterviewAnswer: (data) => api.post('/ai/interview/evaluate', data),
  saveInterviewSession: (data) => api.post('/ai/interview/session', data),

  // M10: Career Chatbot
  chatBot: (data) => api.post('/ai/chat', data),

  // M11: Skill Gap
  generateSkillGap: (data) => api.post('/ai/skillgap', data),
  getSkillGap: () => api.get('/ai/skillgap'),
  completeSkillGapStep: (data) => api.put('/ai/skillgap/complete', data),

  // M12: Career Twin
  chatTwin: (applicationId, data) => api.post(`/ai/twin/${applicationId}`, data),
  getTwinHistory: (applicationId) => api.get(`/ai/twin/${applicationId}`)
}
