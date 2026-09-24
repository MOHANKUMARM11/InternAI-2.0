import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuthStore } from './store/useAuthStore'
import StudentDashboard from './pages/student/StudentDashboard'
import Profile from './pages/student/Profile'
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyProfile from './pages/company/CompanyProfile'
import PostInternship from './pages/company/PostInternship'
import ManageInternships from './pages/company/ManageInternships'
import InternshipList from './pages/student/InternshipList'
import InternshipDetail from './pages/student/InternshipDetail'
import MyApplications from './pages/student/MyApplications'
import Applicants from './pages/company/Applicants'

const Dashboard = () => {
  const { user, logout } = useAuthStore()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  )
}

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/internships" element={<InternshipList />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/internships" element={<ManageInternships />} />
          <Route path="/company/internships/new" element={<PostInternship />} />
          <Route path="/company/internships/:id/applicants" element={<Applicants />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
