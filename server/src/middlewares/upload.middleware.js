import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'internai/resumes', allowed_formats: ['pdf'], resource_type: 'raw' }
})

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'internai/logos', allowed_formats: ['png', 'jpg', 'jpeg'] }
})

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
})
