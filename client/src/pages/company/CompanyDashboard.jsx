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
