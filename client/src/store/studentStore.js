import { create } from 'zustand'
import { studentApi } from '../api/studentApi'

export const useStudentStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await studentApi.getProfile()
      set({ profile: data.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await studentApi.updateProfile(profileData)
      set({ profile: data.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  uploadResume: async (file) => {
    set({ loading: true, error: null })
    try {
      const { data } = await studentApi.uploadResume(file)
      set({ profile: data.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  }
}))
