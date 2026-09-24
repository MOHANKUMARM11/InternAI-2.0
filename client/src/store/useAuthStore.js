import { create } from 'zustand'
import api from '../api/axiosInstance'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.data.user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.data.token)
    set({ user: data.data.user, isAuthenticated: true })
  },

  signup: async (credentials) => {
    const { data } = await api.post('/auth/signup', credentials)
    localStorage.setItem('token', data.data.token)
    set({ user: data.data.user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
  }
}))
