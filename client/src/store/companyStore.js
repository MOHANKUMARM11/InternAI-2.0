import { create } from 'zustand'
import { companyApi } from '../api/companyApi'

export const useCompanyStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await companyApi.getProfile()
      set({ profile: data.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await companyApi.updateProfile(profileData)
      set({ profile: data.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  uploadLogo: async (file) => {
    set({ loading: true, error: null })
    try {
      const { data } = await companyApi.uploadLogo(file)
      set({ profile: data.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  }
}))
