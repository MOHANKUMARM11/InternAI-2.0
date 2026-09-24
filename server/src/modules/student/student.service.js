import { studentRepo } from './student.repository.js'
import { createRequire } from 'module'; const require = createRequire(import.meta.url); const pdfParse = require('pdf-parse');
import { ApiError } from '../../utils/ApiError.js'

export const getProfile = async (userId) => {
  const profile = await studentRepo.findByUserId(userId)
  if (!profile) throw new ApiError(404, 'Student profile not found')
  return profile
}

export const getProfileById = async (studentId) => {
  // Using findById via repo isn't strictly there, let's implement it
  const profile = await studentRepo.findById(studentId)
  if (!profile) throw new ApiError(404, 'Student profile not found')
  return profile
}

export const updateProfile = async (userId, data) => {
  data.updatedAt = new Date()
  return await studentRepo.updateByUserId(userId, data)
}

export const uploadResume = async (userId, file) => {
  // Cloudinary returns the file URL in file.path
  let resumeText = ''
  try {
    const response = await fetch(file.path)
    const buffer = await response.arrayBuffer()
    const pdfData = await pdfParse(Buffer.from(buffer))
    resumeText = pdfData.text
  } catch (err) {
    console.error('Failed to parse PDF', err)
  }

  return await studentRepo.updateByUserId(userId, {
    resumeUrl: file.path,
    resumeText,
    updatedAt: new Date()
  })
}
