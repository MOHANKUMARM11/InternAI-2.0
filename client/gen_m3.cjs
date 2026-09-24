const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

write('src/api/companyApi.js', `
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
  getCompanyById: (id) => api.get(\`/companies/\${id}\`)
}
`);

write('src/store/companyStore.js', `
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
`);

write('src/pages/company/CompanyDashboard.jsx', `
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

const CompanyDashboard = () => {
  const { user } = useAuthStore()
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Company Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.name}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/company/profile" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Company Profile</h2>
          <p className="text-gray-500">Update company details and logo.</p>
        </Link>
      </div>
    </div>
  )
}

export default CompanyDashboard
`);

write('src/pages/company/CompanyProfile.jsx', `
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCompanyStore } from '../../store/companyStore'
import { Upload, X } from 'lucide-react'

const CompanyProfile = () => {
  const { profile, loading, fetchProfile, updateProfile, uploadLogo } = useCompanyStore()
  const [logoFile, setLogoFile] = useState(null)

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      companyName: '',
      industry: '',
      description: '',
      website: '',
      size: '',
      location: '',
      cultureValues: [],
      workStyle: ''
    }
  })

  const cultureValsArr = watch('cultureValues') || []

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      reset({
        companyName: profile.companyName || '',
        industry: profile.industry || '',
        description: profile.description || '',
        website: profile.website || '',
        size: profile.size || '',
        location: profile.location || '',
        cultureValues: profile.cultureValues || [],
        workStyle: profile.workStyle || ''
      })
    }
  }, [profile, reset])

  const onSubmit = async (data) => {
    if (data.cultureValues.length < 3) {
      return alert('Minimum 3 culture values are required')
    }
    try {
      await updateProfile(data)
      alert('Profile updated!')
    } catch (err) {
      alert('Error updating profile: ' + err.message)
    }
  }

  const handleLogoUpload = async (e) => {
    e.preventDefault()
    if (!logoFile) return
    await uploadLogo(logoFile)
    alert('Logo uploaded successfully!')
    setLogoFile(null)
  }

  const handleAddCulture = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (val && !cultureValsArr.includes(val)) {
        setValue('cultureValues', [...cultureValsArr, val])
        e.target.value = ''
      }
    }
  }

  const removeCulture = (sk) => {
    setValue('cultureValues', cultureValsArr.filter(s => s !== sk))
  }

  if (loading && !profile) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Company Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="font-semibold text-gray-700 mb-4">Company Logo</h3>
        <div className="flex items-center space-x-6">
          {profile?.logoUrl && (
            <img src={profile.logoUrl} alt="Logo" className="w-24 h-24 object-contain rounded border bg-gray-50" />
          )}
          <div className="flex items-center space-x-3 w-full">
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png" 
              onChange={(e) => setLogoFile(e.target.files[0])} 
              className="border p-2 rounded text-sm w-full max-w-sm"
            />
            <button 
              type="button" 
              onClick={handleLogoUpload}
              disabled={!logoFile || loading}
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
            >
              <Upload size={16} className="mr-2"/> Upload Logo
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input {...register('companyName')} className="w-full border p-2 rounded" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input {...register('industry')} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input {...register('website')} type="url" className="w-full border p-2 rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} className="w-full border p-2 rounded" rows="3" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <select {...register('size')} className="w-full border p-2 rounded">
              <option value="">Select Size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Work Style</label>
            <select {...register('workStyle')} className="w-full border p-2 rounded">
              <option value="">Select Work Style</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input {...register('location')} className="w-full border p-2 rounded" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Culture Values (Press Enter, Min 3 required)</label>
          <input type="text" onKeyDown={handleAddCulture} className="w-full border p-2 rounded" placeholder="e.g. Innovation, Teamwork" />
          <div className="flex flex-wrap gap-2 mt-2">
            {cultureValsArr.map((cv, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                {cv}
                <button type="button" onClick={() => removeCulture(cv)} className="ml-1 text-blue-500 hover:text-blue-700">
                  <X size={14}/>
                </button>
              </span>
            ))}
          </div>
          {cultureValsArr.length < 3 && <p className="text-red-500 text-xs mt-1">Please add at least 3 culture values.</p>}
        </div>

        <div className="mt-8 pt-4 border-t flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CompanyProfile
`);
console.log('M3 frontend files generated');
