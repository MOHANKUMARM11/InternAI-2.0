# InternAI — AI-Powered Internship Management & Career Platform

> Full-stack MERN project with AI-driven career assistance, real-time market intelligence, blockchain credentials, peer mock interviews, and an internship progress companion.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Environment Variables](#5-environment-variables)
6. [Build Order — What to Build First](#6-build-order)
7. [Module 0 — Project Setup & Configuration](#module-0--project-setup--configuration)
8. [Module 1 — Authentication & Authorization](#module-1--authentication--authorization)
9. [Module 2 — Student Profile Management](#module-2--student-profile-management)
10. [Module 3 — Company Profile Management](#module-3--company-profile-management)
11. [Module 4 — Internship Management (CRUD)](#module-4--internship-management)
12. [Module 5 — Application System](#module-5--application-system)
13. [Module 6 — Dashboards](#module-6--dashboards)
14. [Module 7 — AI Resume Analyzer](#module-7--ai-resume-analyzer)
15. [Module 8 — AI Recommendation Engine](#module-8--ai-recommendation-engine)
16. [Module 9 — AI Interview Preparation](#module-9--ai-interview-preparation)
17. [Module 10 — Career Chatbot](#module-10--career-chatbot)
18. [Module 11 — Skill Gap Analysis & Roadmap](#module-11--skill-gap-analysis--roadmap)
19. [Module 12 — AI Career Twin](#module-12--ai-career-twin)
20. [Module 13 — GitHub Activity Intelligence](#module-13--github-activity-intelligence)
21. [Module 14 — Live Market Intelligence](#module-14--live-market-intelligence)
22. [Module 15 — Peer Mock Interview Exchange](#module-15--peer-mock-interview-exchange)
23. [Module 16 — Internship Progress Companion](#module-16--internship-progress-companion)
24. [Module 17 — Blockchain Credential Passport](#module-17--blockchain-credential-passport)
25. [Module 18 — Admin Analytics & Predictive Tools](#module-18--admin-analytics--predictive-tools)
26. [Module 19 — Deployment & DevOps](#module-19--deployment--devops)
27. [Database Schema Reference](#database-schema-reference)
28. [API Reference](#api-reference)

---

## 1. Project Overview

InternAI is a full-stack MERN platform serving three user roles: **Students**, **Companies**, and **College Admins**. Beyond standard internship management, it integrates AI at every step of the career journey — from resume analysis through placement to post-internship verification.

### What makes InternAI different from other portals

| Feature | Standard Portal | InternAI |
|---|---|---|
| Internship listings & applications | ✅ | ✅ |
| Resume scoring | Basic keyword match | Semantic LLM analysis + ATS simulation |
| Recommendations | Filter-based | AI profile matching + live market demand |
| Interview prep | None | AI Q&A + peer exchange with AI moderation |
| During-internship tracking | None | Weekly AI check-ins + mentor feedback |
| Credentials | PDF certificate | Blockchain-verified, tamper-proof |
| Company screening | Manual review | AI Career Twin + culture DNA matching |
| Skill data | Static | Live job market feeds |
| Code validation | Resume claim | GitHub activity analysis |

### Three User Roles

- **Student** — register, build profile, upload resume, apply, track status, use all AI tools
- **Company** — post internships, review applicants, use AI screening, interact with Career Twin
- **Admin (College)** — oversee all students, placement analytics, credential verification, risk flags

---

## 2. Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS | Styling |
| React Hook Form | Form validation |
| React Query (TanStack) | Server state, caching |
| Recharts | Charts and analytics visuals |
| React Hot Toast | Notifications |
| Zustand | Lightweight global state |
| Socket.IO client | Real-time peer interview sessions |

### Backend
| Tool | Purpose |
|---|---|
| Node.js 20+ | Runtime |
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File upload middleware |
| Cloudinary | Resume/image storage |
| Socket.IO | Real-time websocket server |
| node-cron | Scheduled jobs (market data, weekly check-ins) |
| pdf-parse | Extract text from uploaded PDF resumes |
| Joi | Request validation schemas |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| cors | Cross-origin setup |

### AI & External Services
| Service | Purpose |
|---|---|
| Anthropic Claude API (claude-sonnet-4-20250514) | All AI features |
| JSearch API (RapidAPI) | Live job market data |
| GitHub REST API v3 | Developer activity analysis |
| Polygon RPC (Alchemy/Infura) | Blockchain credential minting |
| ethers.js | Smart contract interaction |

### Database
- **MongoDB Atlas** — primary database
- **Redis** (optional, for caching market data and sessions)

### DevOps
- **Vercel** — frontend deployment
- **Railway / Render** — backend deployment
- **GitHub Actions** — CI/CD pipeline
- **MongoDB Atlas** — managed database

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                      │
│  (Vercel CDN — React Router, Axios, Zustand)        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS REST + WebSocket
┌──────────────────────▼──────────────────────────────┐
│              Express Node.js API                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Routes  │ │ Controllers│ │ Services │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Repos    │ │Middleware │ │  Utils   │            │
│  └──────────┘ └──────────┘ └──────────┘            │
└───────┬──────────┬────────────┬────────────┬────────┘
        │          │            │            │
┌───────▼──┐ ┌─────▼────┐ ┌────▼───┐ ┌─────▼────────┐
│ MongoDB  │ │ Claude   │ │GitHub  │ │  Polygon     │
│ Atlas    │ │ AI API   │ │ API    │ │  Blockchain  │
└──────────┘ └──────────┘ └────────┘ └──────────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│  Cloudinary (files)   Redis (cache)   JSearch (jobs) │
└──────────────────────────────────────────────────────┘
```

### Backend Layered Architecture

Every module follows this pattern strictly:

```
Route → Middleware (auth, validate) → Controller → Service → Repository → Model
```

- **Route** — defines the URL and attaches middleware
- **Middleware** — verifies JWT, validates request body with Joi
- **Controller** — receives req/res, calls service, sends response (no logic here)
- **Service** — contains all business logic, calls repositories
- **Repository** — contains all Mongoose queries (no logic here)
- **Model** — Mongoose schema definition

---

## 4. Folder Structure

```
internai/
├── client/                          # React frontend
│   ├── public/
│   └── src/
│       ├── api/                     # Axios instance + API call functions
│       │   ├── axiosInstance.js
│       │   ├── authApi.js
│       │   ├── studentApi.js
│       │   ├── companyApi.js
│       │   ├── internshipApi.js
│       │   ├── applicationApi.js
│       │   ├── aiApi.js
│       │   └── adminApi.js
│       ├── components/              # Reusable UI components
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── Loader.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── student/
│       │   │   ├── ResumeUploader.jsx
│       │   │   ├── SkillTag.jsx
│       │   │   ├── ApplicationCard.jsx
│       │   │   └── ScoreRing.jsx
│       │   ├── company/
│       │   │   ├── InternshipCard.jsx
│       │   │   ├── ApplicantRow.jsx
│       │   │   └── HiringChart.jsx
│       │   └── ai/
│       │       ├── ChatBubble.jsx
│       │       ├── ResumeScoreCard.jsx
│       │       ├── RoadmapStep.jsx
│       │       └── TwinChatWindow.jsx
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   └── Register.jsx
│       │   ├── student/
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── Profile.jsx
│       │   │   ├── InternshipList.jsx
│       │   │   ├── InternshipDetail.jsx
│       │   │   ├── MyApplications.jsx
│       │   │   ├── ResumeAnalyzer.jsx
│       │   │   ├── Recommendations.jsx
│       │   │   ├── InterviewPrep.jsx
│       │   │   ├── CareerChatbot.jsx
│       │   │   ├── SkillGap.jsx
│       │   │   ├── PeerInterview.jsx
│       │   │   ├── ProgressLog.jsx
│       │   │   └── CredentialWallet.jsx
│       │   ├── company/
│       │   │   ├── CompanyDashboard.jsx
│       │   │   ├── CompanyProfile.jsx
│       │   │   ├── PostInternship.jsx
│       │   │   ├── ManageInternships.jsx
│       │   │   ├── Applicants.jsx
│       │   │   └── CareerTwinView.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── StudentList.jsx
│       │       ├── PlacementReport.jsx
│       │       └── RiskFlags.jsx
│       ├── store/                   # Zustand stores
│       │   ├── authStore.js
│       │   ├── studentStore.js
│       │   └── uiStore.js
│       ├── hooks/                   # Custom React hooks
│       │   ├── useAuth.js
│       │   ├── useProfile.js
│       │   ├── useAI.js
│       │   └── useSocket.js
│       ├── utils/
│       │   ├── formatDate.js
│       │   ├── parseJwt.js
│       │   └── constants.js
│       ├── App.jsx
│       └── main.jsx
│
└── server/                          # Express backend
    └── src/
        ├── config/
        │   ├── db.js                # MongoDB connection
        │   ├── cloudinary.js        # Cloudinary setup
        │   └── socket.js            # Socket.IO setup
        ├── modules/
        │   ├── auth/
        │   │   ├── auth.routes.js
        │   │   ├── auth.controller.js
        │   │   ├── auth.service.js
        │   │   ├── auth.repository.js
        │   │   └── auth.validation.js
        │   ├── student/
        │   │   ├── student.routes.js
        │   │   ├── student.controller.js
        │   │   ├── student.service.js
        │   │   ├── student.repository.js
        │   │   └── student.model.js
        │   ├── company/
        │   │   └── (same pattern)
        │   ├── internship/
        │   │   └── (same pattern)
        │   ├── application/
        │   │   └── (same pattern)
        │   ├── ai/
        │   │   ├── ai.routes.js
        │   │   ├── ai.controller.js
        │   │   ├── resume.service.js
        │   │   ├── recommendation.service.js
        │   │   ├── interview.service.js
        │   │   ├── chatbot.service.js
        │   │   ├── skillgap.service.js
        │   │   └── careertwin.service.js
        │   ├── github/
        │   │   └── (same pattern)
        │   ├── market/
        │   │   └── (same pattern)
        │   ├── peerinterview/
        │   │   └── (same pattern)
        │   ├── progress/
        │   │   └── (same pattern)
        │   ├── credential/
        │   │   └── (same pattern)
        │   └── admin/
        │       └── (same pattern)
        ├── middlewares/
        │   ├── auth.middleware.js    # JWT verify
        │   ├── role.middleware.js    # Role guard
        │   ├── validate.middleware.js# Joi validation runner
        │   ├── upload.middleware.js  # Multer config
        │   └── error.middleware.js   # Global error handler
        ├── utils/
        │   ├── jwt.js
        │   ├── claudeClient.js      # Anthropic SDK wrapper
        │   ├── pdfParser.js
        │   └── ApiError.js          # Custom error class
        ├── jobs/
        │   ├── marketDataSync.js    # Cron: sync job market daily
        │   └── weeklyCheckin.js     # Cron: send weekly prompts
        ├── app.js
        └── server.js
```

---

## 5. Environment Variables

Create `.env` in `server/` and `.env` in `client/`.

### server/.env

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/internai

# Auth
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Anthropic Claude
ANTHROPIC_API_KEY=

# GitHub API
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_TOKEN=

# JSearch (RapidAPI for live jobs)
JSEARCH_API_KEY=
JSEARCH_API_HOST=jsearch.p.rapidapi.com

# Blockchain (Polygon Amoy Testnet → Mainnet later)
POLYGON_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/<key>
DEPLOYER_PRIVATE_KEY=
CONTRACT_ADDRESS=

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Client URL for CORS
CLIENT_URL=http://localhost:5173
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 6. Build Order

Follow this order. Each module depends on the previous ones.

```
Module 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19
  Setup   Auth  Stu  Co  Job  App  Dash  Resume  Rec  Int  Chat  Gap  Twin  Git  Mkt  Peer  Prog  Block  Admin  Deploy
```

Modules 0–6 are the core platform. Modules 7–11 are the standard AI layer. Modules 12–17 are the differentiating innovations. Module 18 is admin intelligence. Module 19 is deployment.

**Minimum viable product (MVP) to demo:** Modules 0–6 + Module 7 (Resume Analyzer).

---

## Module 0 — Project Setup & Configuration

### Goal
Initialize both the React frontend and Express backend with all base configuration: database connection, middleware stack, error handling, and folder structure.

### Backend tasks

**1. Initialize Node project**
```bash
mkdir server && cd server
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet express-rate-limit joi multer cloudinary multer-storage-cloudinary pdf-parse socket.io @anthropic-ai/sdk
npm install -D nodemon
```

**2. `server/src/app.js`** — Mount all middleware and routes

```js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { errorMiddleware } from './middlewares/error.middleware.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 })
app.use('/api/ai/', aiLimiter)

// Routes mounted here (added as each module is built)
// app.use('/api/auth', authRoutes)
// ...

app.use(errorMiddleware)

export default app
```

**3. `server/src/config/db.js`** — MongoDB connection

```js
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 50 })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('DB connection error:', err)
    process.exit(1)
  }
}
```

**4. `server/src/utils/ApiError.js`** — Custom error class

```js
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}
```

**5. `server/src/middlewares/error.middleware.js`** — Global error handler

```js
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal server error'
  res.status(statusCode).json({ success: false, error: message })
}
```

### Frontend tasks

**1. Initialize Vite + React**
```bash
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom react-hook-form @tanstack/react-query recharts react-hot-toast zustand socket.io-client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. `client/src/api/axiosInstance.js`** — Base Axios config

```js
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

### Checklist
- [ ] Server starts on `npm run dev` without errors
- [ ] MongoDB Atlas cluster created and URI tested
- [ ] CORS allows requests from `localhost:5173`
- [ ] 404 and 500 errors return JSON (not HTML)
- [ ] React app renders at `localhost:5173`
- [ ] Axios instance reads token from localStorage

---

## Module 1 — Authentication & Authorization

### Goal
Allow Students, Companies, and Admins to register and log in. Issue JWT on login. Protect all subsequent routes with a JWT middleware that also attaches the user's role.

### Database — Users model

**`server/src/modules/auth/user.model.js`**

```js
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['student', 'company', 'admin'], required: true },
  isVerified:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
})

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, parseInt(process.env.BCRYPT_SALT_ROUNDS))
  next()
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

userSchema.index({ email: 1 })

export const User = mongoose.model('User', userSchema)
```

### API Endpoints

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password, role }` | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | Login, returns JWT |
| GET | `/api/auth/me` | — | Get current user (protected) |

### Key implementation — `auth.service.js`

```js
export const signup = async ({ name, email, password, role }) => {
  const exists = await authRepo.findByEmail(email)
  if (exists) throw new ApiError(409, 'Email already registered')

  const user = await authRepo.create({ name, email, passwordHash: password, role })

  // Create empty profile based on role
  if (role === 'student') await studentRepo.create({ userId: user._id })
  if (role === 'company') await companyRepo.create({ userId: user._id })

  const token = generateToken(user)
  return { token, user: { id: user._id, name, email, role } }
}

export const login = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email)
  if (!user) throw new ApiError(401, 'Invalid credentials')

  const match = await user.comparePassword(password)
  if (!match) throw new ApiError(401, 'Invalid credentials')

  const token = generateToken(user)
  return { token, user: { id: user._id, name: user.name, email, role: user.role } }
}
```

### JWT utility — `server/src/utils/jwt.js`

```js
import jwt from 'jsonwebtoken'

export const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET)
```

### Auth middleware — `server/src/middlewares/auth.middleware.js`

```js
import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new ApiError(401, 'No token provided')

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    throw new ApiError(401, 'Invalid or expired token')
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    throw new ApiError(403, 'Access denied')
  next()
}
```

Usage in routes: `router.get('/me', protect, authorize('student'), controller)`

### Frontend — Zustand auth store

**`client/src/store/authStore.js`**

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    setAuth: (user, token) => set({ user, token }),
    logout: () => {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  }),
  { name: 'auth-storage' }
))
```

### Frontend pages

`Login.jsx` — form with email/password, calls `/api/auth/login`, saves token, redirects by role
`Register.jsx` — role selector (Student / Company), then name, email, password

### Checklist
- [ ] Signup creates User + empty profile (Student or Company)
- [ ] Login returns `{ token, user }` with correct role
- [ ] Protected routes return 401 without token
- [ ] Role guard returns 403 for wrong role
- [ ] Frontend redirects `/dashboard/student`, `/dashboard/company`, `/dashboard/admin` by role
- [ ] `ProtectedRoute.jsx` wraps all private pages

---

## Module 2 — Student Profile Management

### Goal
Students build their career profile: education, skills, projects, portfolio links, and resume PDF. This data feeds every AI feature in the platform.

### Database — Student model

**`server/src/modules/student/student.model.js`**

```js
const studentSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college:      String,
  cgpa:         { type: Number, min: 0, max: 10 },
  skills:       [{ type: String }],
  education:    [{
    degree:     String,
    institution:String,
    year:       Number,
    percentage: Number
  }],
  projects:     [{
    title:      String,
    description:String,
    techStack:  [String],
    link:       String
  }],
  experience:   [{
    role:       String,
    company:    String,
    duration:   String,
    description:String
  }],
  portfolioLinks: {
    github:     String,
    linkedin:   String,
    website:    String
  },
  resumeUrl:    String,
  resumeText:   String,      // Extracted text from PDF (used by AI modules)
  resumeScore:  { type: Number, default: null },
  githubScore:  { type: Number, default: null },
  interviewScore: { type: Number, default: null },
  careerGoal:   String,      // e.g. "Full-Stack Developer"
  preferredDomains: [String],// e.g. ["Frontend", "Backend"]
  updatedAt:    { type: Date, default: Date.now }
})

studentSchema.index({ userId: 1 })
studentSchema.index({ skills: 1 })
```

### API Endpoints

| Method | Path | Body / Notes | Description |
|---|---|---|---|
| GET | `/api/students/me` | — | Get own profile |
| PUT | `/api/students/me` | profile fields | Update profile |
| POST | `/api/students/me/resume` | `multipart/form-data` file | Upload resume PDF |
| GET | `/api/students/:id` | — | Get any student (company/admin) |

### Resume Upload flow

When a student uploads a PDF:
1. Multer + Cloudinary middleware stores the file and returns a URL
2. `pdf-parse` extracts raw text from the buffer
3. Both `resumeUrl` and `resumeText` are saved to the Student document
4. The Module 7 (Resume Analyzer) can then work on `resumeText` immediately

**`server/src/middlewares/upload.middleware.js`**

```js
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'internai/resumes', allowed_formats: ['pdf'], resource_type: 'raw' }
})

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5 MB
})
```

**`server/src/modules/student/student.service.js`** — uploadResume method

```js
import pdfParse from 'pdf-parse'

export const uploadResume = async (userId, file) => {
  // file.path = Cloudinary URL, file.buffer = raw bytes
  const pdfData = await pdfParse(file.buffer)
  const resumeText = pdfData.text

  return studentRepo.updateByUserId(userId, {
    resumeUrl: file.path,
    resumeText,
    updatedAt: new Date()
  })
}
```

### Frontend — Profile page structure

`Profile.jsx` renders four tab sections:
1. **Basic info** — name, college, CGPA, career goal, preferred domains
2. **Education** — dynamic list (add/remove entries)
3. **Projects & Experience** — dynamic list with tech stack tags
4. **Resume & Links** — PDF uploader, GitHub/LinkedIn/website URLs

Use React Hook Form with field arrays for education and projects.

### Checklist
- [ ] Student can view and update all profile sections
- [ ] PDF upload stores file in Cloudinary and extracts text
- [ ] `resumeText` is not empty after upload (verify with `console.log`)
- [ ] Skills field is a tag-style input (comma-separated, rendered as pills)
- [ ] Profile completeness indicator shown (e.g., 70% complete) to prompt filling all fields

---

## Module 3 — Company Profile Management

### Goal
Companies build their profile (name, industry, description, logo) which is shown to students on internship listings.

### Database — Company model

```js
const companySchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName:  { type: String, required: true },
  industry:     String,
  description:  String,
  website:      String,
  logoUrl:      String,
  size:         { type: String, enum: ['1-10', '11-50', '51-200', '200+'] },
  location:     String,
  cultureValues: [String],   // Used by Culture DNA matching in Module 12
  workStyle:    { type: String, enum: ['remote', 'onsite', 'hybrid'] },
  createdAt:    { type: Date, default: Date.now }
})
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/companies/me` | Get own company profile |
| PUT | `/api/companies/me` | Update company profile |
| POST | `/api/companies/me/logo` | Upload logo |
| GET | `/api/companies/:id` | Public company profile |

### Checklist
- [ ] Company can upload logo (stored in Cloudinary under `internai/logos`)
- [ ] Company profile page visible publicly on each internship listing
- [ ] `cultureValues` field filled (min 3 values) before posting internships — enforced with validation

---

## Module 4 — Internship Management

### Goal
Companies create, edit, and delete internship postings. Students search and filter all active postings.

### Database — Internship model

```js
const internshipSchema = new mongoose.Schema({
  companyId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  skillsRequired: [String],
  domain:        { type: String, enum: ['Frontend', 'Backend', 'Full-Stack', 'Data Science', 'ML/AI', 'DevOps', 'Design', 'Marketing', 'Finance', 'HR', 'Other'] },
  stipend:       { type: Number },
  duration:      String,             // e.g. "2 months"
  location:      String,
  isRemote:      { type: Boolean, default: false },
  openings:      { type: Number, default: 1 },
  applyDeadline: Date,
  isActive:      { type: Boolean, default: true },
  postedAt:      { type: Date, default: Date.now },
  applicantCount: { type: Number, default: 0 }
})

internshipSchema.index({ isActive: 1, domain: 1, isRemote: 1 })
internshipSchema.index({ skillsRequired: 1 })
internshipSchema.index({ stipend: 1 })
```

### API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/internships` | company | Create internship |
| GET | `/api/internships` | public | List/search (with query params) |
| GET | `/api/internships/:id` | public | Single internship detail |
| PUT | `/api/internships/:id` | company (owner) | Edit internship |
| DELETE | `/api/internships/:id` | company (owner) | Delete internship |
| GET | `/api/internships/company/mine` | company | Own company's listings |

### Search & Filter query params

`GET /api/internships?domain=Frontend&isRemote=true&minStipend=5000&maxStipend=20000&duration=2+months&search=react&page=1&limit=12`

**`internship.repository.js`** — search query builder

```js
export const searchInternships = async (filters, page = 1, limit = 12) => {
  const query = { isActive: true }

  if (filters.domain)       query.domain = filters.domain
  if (filters.isRemote)     query.isRemote = filters.isRemote === 'true'
  if (filters.minStipend || filters.maxStipend)
    query.stipend = {
      ...(filters.minStipend && { $gte: Number(filters.minStipend) }),
      ...(filters.maxStipend && { $lte: Number(filters.maxStipend) })
    }
  if (filters.search)
    query.$or = [
      { title: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
      { skillsRequired: new RegExp(filters.search, 'i') }
    ]

  const total = await Internship.countDocuments(query)
  const data = await Internship.find(query)
    .populate('companyId', 'companyName logoUrl location industry')
    .sort({ postedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  return { data, total, page: Number(page), totalPages: Math.ceil(total / limit) }
}
```

### Frontend — InternshipList page

- Search bar + filter sidebar (domain, remote toggle, stipend slider, duration select)
- Card grid showing company logo, title, domain badge, stipend, remote/onsite tag, apply deadline
- Pagination at the bottom
- Clicking a card goes to `InternshipDetail.jsx` which shows full description + Apply button

### Checklist
- [ ] Company can only edit/delete their own internships (ownership check in service)
- [ ] Listing endpoint is public (no auth required)
- [ ] `applicantCount` field increments atomically when a student applies
- [ ] Inactive internships (`isActive: false`) hidden from student search
- [ ] Company can toggle a listing active/inactive without deleting

---

## Module 5 — Application System

### Goal
Students apply to internships. Applications move through a status pipeline. Both students and companies can track statuses.

### Database — Application model

```js
const applicationSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  internshipId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status:        {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  coverNote:     String,
  aiMatchScore:  Number,    // Set by Module 7 on application
  appliedAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now }
})

applicationSchema.index({ studentId: 1 })
applicationSchema.index({ internshipId: 1 })
applicationSchema.index({ status: 1 })
// Prevent duplicate applications
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true })
```

### API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/applications` | student | Apply to internship |
| GET | `/api/applications/me` | student | Student's own applications |
| GET | `/api/applications/internship/:id` | company | All applicants for an internship |
| PUT | `/api/applications/:id/status` | company | Update status |
| DELETE | `/api/applications/:id` | student | Withdraw application |

### Status update rules (enforced in service)

- `Applied` → `Under Review` (company)
- `Under Review` → `Shortlisted` or `Rejected` (company)
- `Shortlisted` → `Interview Scheduled` or `Rejected` (company)
- `Interview Scheduled` → `Selected` or `Rejected` (company)
- Student can only `DELETE` (withdraw) an application in `Applied` status

### Frontend

`MyApplications.jsx` — table with columns: Company, Role, Applied Date, Status (color-coded badge), Action
`Applicants.jsx` (company view) — table with AI match score column, filter by status, bulk shortlist

### Checklist
- [ ] Duplicate application returns `409 Conflict`
- [ ] `applicantCount` on the Internship document is decremented when a student withdraws
- [ ] Company can only update applications for their own internships
- [ ] Status transition rules enforced server-side (not just frontend)

---

## Module 6 — Dashboards

### Goal
Role-specific dashboards showing key metrics and quick-access panels.

### Student Dashboard

Widgets:
- Resume Score ring (from Module 7)
- GitHub Score bar (from Module 13)
- Applications summary (Applied / Shortlisted / Rejected counts)
- Recent application statuses (last 5)
- AI-recommended internships panel (top 3, from Module 8)
- Interview readiness score (from Module 9)
- Upcoming peer interview sessions (from Module 15)

API: `GET /api/dashboard/student`

```js
// Returns all data in one call to minimize client requests
{
  resumeScore, githubScore, interviewScore,
  applicationStats: { applied, shortlisted, rejected, selected },
  recentApplications: [...],
  recommendations: [...],    // top 3
  upcomingPeerSessions: [...]
}
```

### Company Dashboard

Widgets:
- Total active listings, total applicants, shortlisted count
- Applications-per-listing bar chart (Recharts)
- Recent applicants list with AI match scores
- Pending review count

API: `GET /api/dashboard/company`

### Admin Dashboard

Widgets:
- Total students, total companies, total internships
- Placement rate gauge
- Top 10 students by score
- Risk-flagged students count (from Module 18)
- Domain distribution pie chart
- Month-wise placement trend (Recharts line chart)

API: `GET /api/dashboard/admin`

### Checklist
- [ ] All three dashboards render with real data (no hardcoded mock values)
- [ ] Charts render correctly with empty data (no crashes when arrays are empty)
- [ ] Student dashboard refreshes scores automatically after resume/GitHub analysis

---

## Module 7 — AI Resume Analyzer

### Goal
When a student's resume is uploaded, the AI extracts skills, evaluates ATS compatibility, scores the resume, and provides specific improvement suggestions.

### How it works

1. Student goes to Resume Analyzer page
2. Frontend calls `POST /api/ai/resume-analysis`
3. Backend retrieves student's `resumeText` (from Module 2 upload)
4. Sends structured prompt to Claude API
5. Parses and returns the JSON result
6. Saves `resumeScore` back to the Student document

### API Endpoint

`POST /api/ai/resume-analysis` — body: none (uses authenticated student's own resumeText)

### Claude prompt (`server/src/modules/ai/resume.service.js`)

```js
export const analyzeResume = async (studentId) => {
  const student = await studentRepo.findById(studentId)

  if (!student.resumeText) throw new ApiError(400, 'No resume uploaded')

  const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume text and return a JSON object ONLY (no markdown, no explanation outside JSON).

Resume:
"""
${student.resumeText}
"""

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "extractedSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    { "issue": "string", "suggestion": "string", "priority": "high|medium|low" }
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "formattingIssues": ["issue1", "issue2"],
  "summary": "2 sentence summary of the candidate"
}
`

  const response = await claudeClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const raw = response.content[0].text
  const result = JSON.parse(raw)

  // Save score back to student profile
  await studentRepo.updateById(studentId, { resumeScore: result.overallScore })

  return result
}
```

### Claude client wrapper (`server/src/utils/claudeClient.js`)

```js
import Anthropic from '@anthropic-ai/sdk'

export const claudeClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
```

### Frontend — `ResumeAnalyzer.jsx`

- "Analyze My Resume" button → triggers API call → shows loading state
- Score ring showing `overallScore` and `atsScore`
- Three columns: Strengths (green), Improvements (by priority), Missing Keywords
- Each improvement item shows the issue and the suggestion below it

### Error handling

If the JSON parse fails (Claude returns unexpected format), retry once with a stricter prompt. After two failures, return `ApiError(500, 'AI analysis failed, please try again')`.

### Checklist
- [ ] `resumeText` must exist before analysis runs
- [ ] Claude response always parsed as JSON (add try-catch around JSON.parse)
- [ ] `resumeScore` updated in Student document after successful analysis
- [ ] Rate limiter: one analysis per student per hour (to manage API costs)
- [ ] Result cached in the Student document so the page loads instantly on revisit

---

## Module 8 — AI Recommendation Engine

### Goal
Recommend the top 5–10 internships most suited to the student's profile using semantic matching rather than keyword filtering.

### How it works

1. Fetch the student's skills, projects, career goal, and preferred domains
2. Fetch all active internship listings (paginated batch)
3. Send both to Claude asking for a ranked match list with scores and reasons
4. Return sorted recommendations with a `matchReason` explanation per item

### API Endpoint

`POST /api/ai/recommendations` — returns array of `{ internship, matchScore, matchReason }`

### Claude prompt

```js
const prompt = `
You are an internship matching expert.

Student Profile:
- Skills: ${student.skills.join(', ')}
- Career Goal: ${student.careerGoal}
- Preferred Domains: ${student.preferredDomains.join(', ')}
- Projects: ${student.projects.map(p => p.title + ': ' + p.techStack.join(', ')).join(' | ')}

Available Internships (JSON array):
${JSON.stringify(internships.map(i => ({
  id: i._id,
  title: i.title,
  skills: i.skillsRequired,
  domain: i.domain,
  description: i.description.slice(0, 200)
})))}

Return a JSON array of the top 5 best matches ONLY:
[
  {
    "internshipId": "string",
    "matchScore": <0-100>,
    "matchReason": "1-2 sentence explanation why this fits the student"
  }
]
`
```

### Caching

Store recommendation results in the Student document under `cachedRecommendations: []` with a `recommendedAt` timestamp. Refresh only if:
- Student updates their profile, OR
- It has been more than 24 hours since last recommendation

### Checklist
- [ ] Works even if student has minimal profile (gracefully degrades)
- [ ] Recommendations are not shown if the student already applied to that internship
- [ ] `matchReason` shown as a small tooltip or expand on hover

---

## Module 9 — AI Interview Preparation

### Goal
Students select a domain and receive AI-generated interview questions. They type answers and get AI feedback on each answer.

### API Endpoints

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/ai/interview/questions` | `{ domain, level }` | Generate question set (10 questions) |
| POST | `/api/ai/interview/evaluate` | `{ question, answer, domain }` | Evaluate a single answer |

### Question generation prompt

```js
const prompt = `
Generate exactly 10 interview questions for a ${domain} developer internship at ${level} level.
Mix 7 technical questions and 3 behavioral questions.

Return JSON ONLY:
{
  "questions": [
    {
      "id": 1,
      "type": "technical|behavioral",
      "question": "string",
      "hint": "what a good answer should cover in 1 sentence"
    }
  ]
}
`
```

### Answer evaluation prompt

```js
const prompt = `
You are a technical interviewer evaluating an internship candidate's answer.

Question: "${question}"
Domain: ${domain}
Candidate's Answer: "${answer}"

Return JSON ONLY:
{
  "score": <0-10>,
  "verdict": "Strong|Adequate|Needs Work",
  "whatWasGood": "string",
  "whatWasMissing": "string",
  "betterAnswer": "A sample strong answer in 2-3 sentences"
}
`
```

### Database — save interview sessions

```js
const interviewSessionSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  domain:     String,
  level:      String,
  questions:  [{ id: Number, question: String, type: String }],
  answers:    [{ questionId: Number, answer: String, score: Number, feedback: Object }],
  avgScore:   Number,
  completedAt:Date
})
```

Save session when student submits all answers. Use `avgScore` to update `interviewScore` on the Student document.

### Frontend — `InterviewPrep.jsx`

1. Domain selector + difficulty level (Beginner / Intermediate / Advanced)
2. "Start Practice" → loads questions one by one
3. Text area for answer, "Submit Answer" → shows AI evaluation with score ring
4. Progress bar across 10 questions
5. Final summary page with average score and weakest areas

### Checklist
- [ ] Sessions saved in DB so students can review past sessions
- [ ] `interviewScore` updated on Student document after session
- [ ] Questions don't repeat within the same session
- [ ] Time-spent per question tracked (displayed in summary)

---

## Module 10 — Career Chatbot

### Goal
An interactive AI chatbot that answers any career-related question with context from the student's own profile.

### API Endpoint

`POST /api/ai/chat` — body: `{ message, history: [] }`

The endpoint maintains conversation history in the request (stateless on the server). The client stores the array of `{ role, content }` messages and sends the full history on each turn.

### Service implementation

```js
export const chat = async (studentId, message, history) => {
  const student = await studentRepo.findById(studentId)

  const systemPrompt = `
You are a personalized AI career coach for an engineering student.

Student context:
- Name: ${student.name}
- Skills: ${student.skills.join(', ')}
- Career Goal: ${student.careerGoal || 'not set'}
- CGPA: ${student.cgpa}
- Projects: ${student.projects.map(p => p.title).join(', ')}

Answer career questions directly and specifically. Reference the student's actual skills and goals.
Keep responses concise (under 150 words) unless the student asks for a detailed explanation.
`

  const messages = [
    ...history.slice(-10),    // Last 10 turns to manage context length
    { role: 'user', content: message }
  ]

  const response = await claudeClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages
  })

  return response.content[0].text
}
```

### Frontend — `CareerChatbot.jsx`

- Chat window with message bubbles (student right, AI left)
- Quick prompt chips: "Which skills should I learn next?", "How do I improve my resume?", "What salary should I expect?"
- Clear history button
- Typing indicator while waiting for response
- Conversation history stored in component state (lost on page refresh — intentional, for privacy)

### Checklist
- [ ] System prompt always includes student's current profile
- [ ] History truncated to last 10 messages before sending (cost control)
- [ ] Empty message blocked on frontend
- [ ] Rate limit: 30 messages per hour per student

---

## Module 11 — Skill Gap Analysis & Roadmap

### Goal
The student selects a target role (e.g., Full-Stack Developer, Data Scientist). The AI compares it against their current skills and builds a structured learning roadmap.

### API Endpoints

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/ai/skillgap` | `{ targetRole }` | Analyze gap and return roadmap |
| GET | `/api/ai/skillgap` | — | Get saved roadmap |
| PUT | `/api/ai/skillgap/complete` | `{ stepId }` | Mark a roadmap step complete |

### Database — Roadmap model

```js
const roadmapSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  targetRole: String,
  gapSkills:  [String],
  steps:      [{
    id:          String,
    week:        Number,
    skill:       String,
    resource:    String,
    resourceUrl: String,
    type:        { type: String, enum: ['course', 'project', 'certification', 'practice'] },
    completed:   { type: Boolean, default: false }
  }],
  estimatedWeeks: Number,
  generatedAt: Date
})
```

### Claude prompt

```js
const prompt = `
Student current skills: ${student.skills.join(', ')}
Student's projects tech stack: ${allTechUsed.join(', ')}
Target role: ${targetRole}

Return a JSON learning roadmap ONLY:
{
  "gapSkills": ["skill1", "skill2"],
  "estimatedWeeks": <number>,
  "steps": [
    {
      "id": "step_1",
      "week": 1,
      "skill": "string",
      "resource": "Resource name (e.g., React official docs)",
      "resourceUrl": "https://...",
      "type": "course|project|certification|practice"
    }
  ]
}

Rules:
- Max 12 steps
- Order from foundations to advanced
- Prefer free resources (MDN, freeCodeCamp, official docs)
- Include at least 2 project-type steps
`
```

### Frontend — `SkillGap.jsx`

- Target role input (dropdown of common roles or free text)
- "Generate Roadmap" → API call
- Visual timeline showing weeks on x-axis, steps as cards
- Each step has a checkbox to mark as complete
- Progress bar showing % of roadmap completed
- Regenerate button if the student changes their goal

### Checklist
- [ ] Roadmap saved to DB so student doesn't regenerate on every visit
- [ ] Completed steps visually distinct (strikethrough + green tick)
- [ ] If student already knows all required skills → AI says so and suggests advanced topics
- [ ] `resourceUrl` validated before saving (must start with `https://`)

---

## Module 12 — AI Career Twin

### Goal
Build an AI persona from each student's profile. Companies can have a chat conversation with this "Career Twin" before deciding to shortlist the student, reducing interview scheduling waste.

### How it works

1. When a company views an applicant, they see a "Chat with Career Twin" button
2. Frontend opens a chat modal, sends messages to `POST /api/ai/twin/:applicationId`
3. Backend loads the student's full profile and constructs a persona system prompt
4. Claude responds in first person as the student
5. Conversation log saved for the student to review

### Database — TwinConversation model

```js
const twinConversationSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  companyId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  messages:      [{ role: { type: String, enum: ['company', 'twin'] }, content: String, timestamp: Date }],
  createdAt:     { type: Date, default: Date.now }
})
```

### API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/twin/:applicationId` | company | Send message to Career Twin |
| GET | `/api/ai/twin/:applicationId` | company/student | View conversation history |

### Service — `careertwin.service.js`

```js
export const chat = async (applicationId, companyMessage, history) => {
  const application = await applicationRepo.findById(applicationId)
  const student = await studentRepo.findByUserId(application.studentId)

  const systemPrompt = `
You are an AI representation of ${student.name}, responding to a company recruiter during a pre-interview screening.

About ${student.name}:
- Skills: ${student.skills.join(', ')}
- Education: ${student.education.map(e => `${e.degree} from ${e.institution}`).join('; ')}
- Projects: ${student.projects.map(p => `${p.title} (${p.techStack.join(', ')}): ${p.description}`).join(' | ')}
- Experience: ${student.experience.map(e => `${e.role} at ${e.company}`).join('; ') || 'No prior work experience'}
- Career Goal: ${student.careerGoal}
- GitHub: ${student.portfolioLinks?.github || 'Not provided'}

Rules:
- Respond in first person as ${student.name}
- Only share information present in the profile above — do not invent skills or experience
- Keep responses honest and concise (under 100 words)
- If asked something not in the profile, say "That's not something I can speak to in this format — you can ask me directly in the interview"
- Do not reveal that you are an AI unless directly asked
`

  const messages = [...history.slice(-8), { role: 'user', content: companyMessage }]

  const response = await claudeClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages
  })

  const twinReply = response.content[0].text

  // Save message pair to DB
  await twinConvRepo.appendMessages(applicationId, [
    { role: 'company', content: companyMessage, timestamp: new Date() },
    { role: 'twin', content: twinReply, timestamp: new Date() }
  ])

  return twinReply
}
```

### Frontend

`CareerTwinView.jsx` (company side) — chat modal that opens from the applicant row
`TwinConversations.jsx` (student side, read-only) — student can see every conversation companies have had with their twin

### Important guardrails

The AI Twin must never:
- Claim a skill the student hasn't listed
- Answer questions about salary expectations (redirect to interview)
- Share the student's contact information
- Make commitments on the student's behalf ("I can start next week")

These rules are enforced in the system prompt.

### Checklist
- [ ] Only companies who have the student's application can access the twin
- [ ] Student receives a notification (in-app) when a company interacts with their twin
- [ ] Conversation saved in full for student to review
- [ ] "Reveal AI" detection: if company asks "Are you an AI?", twin answers honestly

---

## Module 13 — GitHub Activity Intelligence

### Goal
Analyze a student's real GitHub activity to generate an objective developer score independent of what the resume claims.

### How it works

1. Student adds their GitHub username to their profile
2. Student clicks "Analyze GitHub" (or it runs automatically on profile save)
3. Backend calls GitHub API to fetch repos, commits, languages, and contributions
4. Claude analyzes the data and returns a score with insights
5. `githubScore` saved to Student document

### API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/github/analyze` | Analyze student's GitHub profile |
| GET | `/api/github/report` | Get last GitHub analysis report |

### GitHub data fetched

```js
const fetchGithubData = async (username) => {
  const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  const base = `https://api.github.com/users/${username}`

  const [userRes, reposRes] = await Promise.all([
    axios.get(base, { headers }),
    axios.get(`${base}/repos?sort=pushed&per_page=20`, { headers })
  ])

  const repos = reposRes.data

  const languageMap = {}
  for (const repo of repos.slice(0, 10)) {
    const langRes = await axios.get(repo.languages_url, { headers })
    Object.entries(langRes.data).forEach(([lang, bytes]) => {
      languageMap[lang] = (languageMap[lang] || 0) + bytes
    })
  }

  return {
    publicRepos:     userRes.data.public_repos,
    followers:       userRes.data.followers,
    accountAge:      Math.floor((Date.now() - new Date(userRes.data.created_at)) / (1000 * 60 * 60 * 24 * 365)),
    recentRepos:     repos.map(r => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.pushed_at,
      hasReadme: r.has_wiki
    })),
    topLanguages:    Object.entries(languageMap).sort((a,b) => b[1]-a[1]).slice(0,5).map(e => e[0])
  }
}
```

### Claude analysis prompt

```js
const prompt = `
Analyze this GitHub developer profile and score it for a student internship candidate.

Data:
${JSON.stringify(githubData)}

Return JSON ONLY:
{
  "overallScore": <0-100>,
  "activityScore": <0-100>,
  "diversityScore": <0-100>,
  "qualityScore": <0-100>,
  "topLanguages": ["lang1", "lang2"],
  "insights": ["insight1", "insight2", "insight3"],
  "redFlags": ["flag1"],
  "recommendation": "1 sentence summary for a recruiter"
}

Scoring criteria:
- Activity: recent commits, consistency, account age
- Diversity: variety of languages and project types
- Quality: stars, forks, readme presence, project descriptions
`
```

### Checklist
- [ ] GitHub API calls cached (don't re-fetch if analyzed within 24 hours)
- [ ] Handle private-only GitHub accounts gracefully (show "Limited public data" message)
- [ ] `githubScore` shown on Student Dashboard
- [ ] Companies can see the GitHub score on the applicant list

---

## Module 14 — Live Market Intelligence

### Goal
Track real-time skill demand from live job postings so students see what the market actually needs right now. Displayed as a "Skill Pulse" feed.

### How it works

A cron job runs every 24 hours, fetches job data from JSearch API for top domains, extracts skill frequency, and stores results in a `MarketData` collection. Students and admins see this as a dashboard widget.

### Database — MarketData model

```js
const marketDataSchema = new mongoose.Schema({
  domain:        String,
  location:      String,
  skills:        [{ skill: String, count: Number, change: Number }],  // change = % vs last week
  totalJobs:     Number,
  avgStipend:    Number,
  fetchedAt:     { type: Date, default: Date.now }
})
```

### Cron job — `server/src/jobs/marketDataSync.js`

```js
import cron from 'node-cron'
import axios from 'axios'

const domains = ['Frontend Developer', 'Backend Developer', 'Data Science', 'Machine Learning', 'DevOps']

export const startMarketSync = () => {
  cron.schedule('0 2 * * *', async () => {   // Runs at 2am daily
    console.log('Market data sync started')

    for (const domain of domains) {
      try {
        const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
          params: { query: `${domain} internship India`, num_pages: 1 },
          headers: {
            'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
            'X-RapidAPI-Host': process.env.JSEARCH_API_HOST
          }
        })

        const jobs = data.data || []
        const skillFreq = {}

        jobs.forEach(job => {
          const desc = (job.job_description || '').toLowerCase()
          COMMON_SKILLS.forEach(skill => {
            if (desc.includes(skill.toLowerCase())) {
              skillFreq[skill] = (skillFreq[skill] || 0) + 1
            }
          })
        })

        const skills = Object.entries(skillFreq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([skill, count]) => ({ skill, count, change: 0 }))

        await MarketData.create({ domain, location: 'India', skills, totalJobs: jobs.length, fetchedAt: new Date() })

      } catch (err) {
        console.error(`Market sync failed for ${domain}:`, err.message)
      }
    }
  })
}
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/market/pulse` | Get latest skill demand data |
| GET | `/api/market/trending` | Top 10 rising skills across all domains |

### Frontend widget — used in Student Dashboard and Admin Dashboard

- Bar chart (Recharts) showing top skills per domain
- "Trending up" and "Trending down" badges on skills with significant change
- Domain tabs: Frontend / Backend / Data Science / ML / DevOps
- Last updated timestamp

### Checklist
- [ ] Cron job starts when server starts (`startMarketSync()` called in `server.js`)
- [ ] Graceful failure: if API call fails, old data is retained (not deleted)
- [ ] Data older than 7 days cleaned up automatically (TTL index on `fetchedAt`)
- [ ] Admins see this data broken down by what their students are learning vs. what the market needs

---

## Module 15 — Peer Mock Interview Exchange

### Goal
Students pair up for live 30-minute mock interview sessions. The AI generates the question set, one student acts as interviewer, the other answers. After the session, AI scores both roles.

### How it works

1. Student books a session → picks domain and time slot → enters a waiting pool
2. Another student with the same domain is matched → both get a notification
3. They join a real-time session (WebSocket room via Socket.IO)
4. AI sends interviewer the question set; interviewer reads and asks
5. After session ends, both submit the transcript → AI evaluates and gives scores
6. XP points awarded to both

### Database models

```js
// Session booking
const peerSessionSchema = new mongoose.Schema({
  studentA:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentB:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  domain:      String,
  status:      { type: String, enum: ['waiting', 'matched', 'active', 'completed', 'cancelled'], default: 'waiting' },
  scheduledAt: Date,
  roomId:      String,        // Socket.IO room ID
  questions:   [{ id: Number, question: String }],
  transcript:  [{ speaker: String, text: String, timestamp: Date }],
  evaluation: {
    interviewerScore: Number,
    intervieweeScore: Number,
    interviewerFeedback: String,
    intervieweeFeedback: String
  },
  xpAwarded:   Boolean,
  createdAt:   { type: Date, default: Date.now }
})
```

### Socket.IO events (`server/src/config/socket.js`)

```
Client emits:   join_session      { sessionId, studentId }
Server emits:   session_ready     { roomId, partnerName, role }
Client emits:   send_message      { roomId, text, speaker }
Server emits:   receive_message   { text, speaker, timestamp }
Client emits:   end_session       { roomId }
Server emits:   session_ended     triggers evaluation
```

### XP and gamification

Students earn XP for:
- Completing a session as interviewee: 50 XP
- Completing a session as interviewer: 30 XP
- Scoring 8+/10 as interviewee: bonus 20 XP
- Being rated "Excellent Interviewer" by partner: bonus 15 XP

XP stored on Student document. Every 500 XP → a badge (e.g., "Mock Master"). Badges shown on student profile visible to companies.

### API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/peer/book` | Book a session slot |
| GET | `/api/peer/sessions` | Own session history |
| POST | `/api/peer/evaluate/:sessionId` | Submit transcript for AI evaluation |
| GET | `/api/peer/leaderboard` | Top students by XP (scoped to same college) |

### Checklist
- [ ] Socket rooms destroyed after session ends (memory cleanup)
- [ ] Session auto-ends after 45 minutes even if participants are still connected
- [ ] Student cannot be matched with the same partner twice in 48 hours
- [ ] Evaluation only runs when both students submit the session end event

---

## Module 16 — Internship Progress Companion

### Goal
Once a student is marked "Selected" in an internship, activate weekly AI check-ins during the active internship. This is the layer that runs during the internship — not just around it.

### How it works

1. When application status changes to `Selected`, a Progress record is created
2. Every Monday at 9am, a cron job sends in-app prompts to all active interns
3. Student logs weekly reflections (what they worked on, what was hard, what they learned)
4. AI summarizes each week and generates a `Completion Report` when the internship ends
5. The report auto-drafts a "Work Experience" section the student can add to their resume

### Database models

```js
const progressRecordSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  companyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  startDate:    Date,
  endDate:      Date,
  status:       { type: String, enum: ['active', 'completed'], default: 'active' },
  weeklyLogs:   [{
    week:          Number,
    promptedAt:    Date,
    submittedAt:   Date,
    studentEntry:  String,
    aiSummary:     String,
    mentorRating:  { type: Number, min: 1, max: 5 }
  }],
  completionReport: {
    summary:         String,
    skillsGained:    [String],
    resumeSnippet:   String,    // AI-drafted work experience bullet points
    generatedAt:     Date
  }
})
```

### Cron job — `server/src/jobs/weeklyCheckin.js`

```js
cron.schedule('0 9 * * 1', async () => {   // Every Monday at 9am
  const activeRecords = await progressRepo.findAllActive()

  for (const record of activeRecords) {
    const weekNumber = Math.floor((Date.now() - record.startDate) / (7 * 24 * 60 * 60 * 1000)) + 1

    await notificationRepo.create({
      userId: record.studentId,
      type: 'weekly_checkin',
      message: `Week ${weekNumber} check-in: How did your internship go this week?`,
      link: `/progress/${record._id}`
    })

    await progressRepo.addWeekEntry(record._id, { week: weekNumber, promptedAt: new Date() })
  }
})
```

### Completion report generation

When company marks internship complete (or end date is reached), Claude generates the report:

```js
const prompt = `
Based on these weekly internship logs, generate a professional completion report.

Company: ${internship.company}, Role: ${internship.title}
Duration: ${record.startDate} to ${record.endDate}
Weekly logs: ${record.weeklyLogs.map(l => `Week ${l.week}: ${l.studentEntry}`).join('\n')}

Return JSON ONLY:
{
  "summary": "3-4 sentence overview of what the intern accomplished",
  "skillsGained": ["skill1", "skill2"],
  "resumeSnippet": "2-3 bullet points in past-tense action-verb format, ready to paste into a resume"
}
`
```

### Frontend — `ProgressLog.jsx`

- Week-by-week timeline view
- Each week has: prompt, student entry (text area), AI summary, mentor rating (stars, optional)
- Locked weeks (past) shown read-only
- "Generate Final Report" button appears when internship end date approaches
- Final report page with resume snippet in a copy-to-clipboard box

### Checklist
- [ ] Progress record auto-created when application status changes to `Selected`
- [ ] Weekly prompts only sent during the active window (between startDate and endDate)
- [ ] Mentor can rate each week (company dashboard shows rating interface)
- [ ] Resume snippet available for student to add to their profile directly

---

## Module 17 — Blockchain Credential Passport

### Goal
Issue tamper-proof, verifiable internship completion certificates on the Polygon blockchain. Each certificate can be verified by anyone with the certificate ID — without contacting the college or company.

### Smart contract overview

The smart contract is a simple ERC-721-like NFT contract. Each token represents one internship completion. Tokens are non-transferable (soulbound).

**`contracts/InternAICredential.sol`** (simplified)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InternAICredential {
    struct Credential {
        address student;
        string studentName;
        string companyName;
        string role;
        string duration;
        uint256 issuedAt;
        bool valid;
    }

    mapping(uint256 => Credential) public credentials;
    uint256 public nextTokenId;
    address public owner;

    event CredentialIssued(uint256 indexed tokenId, address indexed student, string companyName);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor() { owner = msg.sender; }

    modifier onlyOwner() { require(msg.sender == owner, "Not authorized"); _; }

    function issueCredential(
        address student, string memory studentName,
        string memory companyName, string memory role, string memory duration
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        credentials[tokenId] = Credential(student, studentName, companyName, role, duration, block.timestamp, true);
        emit CredentialIssued(tokenId, student, companyName);
        return tokenId;
    }

    function revokeCredential(uint256 tokenId) external onlyOwner {
        credentials[tokenId].valid = false;
        emit CredentialRevoked(tokenId);
    }

    function verify(uint256 tokenId) external view returns (Credential memory) {
        require(credentials[tokenId].issuedAt > 0, "Credential not found");
        return credentials[tokenId];
    }
}
```

### Backend — credential service

```js
import { ethers } from 'ethers'
import abi from '../contracts/InternAICredential.json' assert { type: 'json' }

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL)
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider)
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet)

export const issueCredential = async (progressRecordId) => {
  const record = await progressRepo.findById(progressRecordId)
  const student = await studentRepo.findById(record.studentId)
  const internship = await internshipRepo.findById(record.internshipId)
  const company = await companyRepo.findById(record.companyId)

  const tx = await contract.issueCredential(
    student.walletAddress || ethers.ZeroAddress,
    student.name,
    company.companyName,
    internship.title,
    internship.duration
  )

  const receipt = await tx.wait()

  const event = receipt.logs.find(l => l.fragment?.name === 'CredentialIssued')
  const tokenId = event.args[0].toString()

  // Save credential reference
  await credentialRepo.create({
    studentId: student._id,
    progressRecordId,
    tokenId,
    txHash: receipt.hash,
    verifyUrl: `${process.env.CLIENT_URL}/verify/${tokenId}`,
    issuedAt: new Date()
  })

  return { tokenId, txHash: receipt.hash }
}
```

### Public verification page

`/verify/:tokenId` — no login required.

Fetches the credential from the blockchain directly (read-only call, no gas fee):

```js
const verifyCredential = async (tokenId) => {
  const readProvider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL)
  const readContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, readProvider)
  return readContract.verify(tokenId)
}
```

Displays: student name, company, role, duration, issue date, "Valid ✓" or "Revoked ✗" badge.

### Database — Credential model

```js
const credentialSchema = new mongoose.Schema({
  studentId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  progressRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProgressRecord' },
  tokenId:          { type: String, unique: true },
  txHash:           String,
  verifyUrl:        String,
  issuedAt:         Date
})
```

### Frontend — `CredentialWallet.jsx`

- Lists all earned credentials as cards
- Each card shows: company logo, role, duration, issue date, "Verify" link
- Share button generates a shareable link for LinkedIn/resume
- QR code generated from `verifyUrl` (using `qrcode` npm package)

### Checklist
- [ ] Contract deployed to Polygon Amoy Testnet first (for testing)
- [ ] `issueCredential()` called only after both student and company confirm completion
- [ ] Verification page works without any login or API key
- [ ] `walletAddress` field added to Student model (optional, for future wallet-to-wallet transfer)

---

## Module 18 — Admin Analytics & Predictive Tools

### Goal
Give college admins actionable insights: placement rates, at-risk students, domain distribution, and predictive flags.

### API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | All dashboard stats |
| GET | `/api/admin/students` | Full student list with scores |
| GET | `/api/admin/risk-flags` | Students at risk of not being placed |
| GET | `/api/admin/report` | Generate downloadable placement report |

### Predictive risk model

The risk flag is calculated by a weighted scoring function (no external ML needed):

```js
const calcRiskScore = (student, applications) => {
  let risk = 0

  // Resume score below 50 → high risk
  if (!student.resumeScore || student.resumeScore < 50)    risk += 30
  // No applications in last 30 days
  const recent = applications.filter(a => isWithin30Days(a.appliedAt))
  if (recent.length === 0)                                 risk += 25
  // All applications rejected
  const allRejected = applications.every(a => a.status === 'Rejected')
  if (applications.length > 0 && allRejected)             risk += 25
  // Profile less than 50% complete
  if (profileCompleteness(student) < 50)                  risk += 20

  return Math.min(risk, 100)   // Cap at 100
}
```

Students with `riskScore >= 60` appear in the admin's risk flags list.

### Admin dashboard data

```js
{
  totalStudents, totalCompanies, totalInternships,
  placed: <students with at least one Selected application>,
  placementRate: <placed / totalStudents * 100>,
  domainBreakdown: [{ domain, count }],
  monthlyPlacements: [{ month, count }],
  topStudents: [{ name, resumeScore, githubScore, college }],
  atRiskStudents: [{ name, college, riskScore, reason }],
  credentialsIssued: <count>
}
```

### Frontend — Admin pages

`AdminDashboard.jsx` — metric cards + charts (Recharts PieChart, LineChart)
`StudentList.jsx` — sortable table with score columns, filter by college/domain
`RiskFlags.jsx` — list of at-risk students with intervention suggestions from AI

### Checklist
- [ ] Admin cannot view or edit individual student data beyond what's needed for placement oversight
- [ ] Placement rate recalculated on each dashboard load (not cached)
- [ ] Risk flags refreshed weekly (cron job or on-demand)

---

## Module 19 — Deployment & DevOps

### Goal
Deploy the full application to production with CI/CD, monitoring, and environment-based configuration.

### Frontend — Vercel

```bash
cd client
vercel deploy --prod
```

Set environment variables in Vercel dashboard:
- `VITE_API_URL` → your Railway/Render backend URL
- `VITE_SOCKET_URL` → same URL

### Backend — Railway (recommended for Socket.IO support)

1. Connect GitHub repo to Railway
2. Set root directory to `server/`
3. Add all environment variables from `server/.env`
4. Railway auto-detects Node.js and starts with `npm start`

`server/package.json` start script:
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### GitHub Actions CI/CD — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd server && npm ci
      - run: cd server && npm test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd client && npm ci
      - run: cd client && npm run build
```

### MongoDB Atlas setup

1. Create cluster (M0 free tier is fine for development)
2. Add IP: `0.0.0.0/0` for Railway (or use Railway's static IP)
3. Create database user with `readWrite` on `internai` database only
4. Enable Atlas Search index on `Internship.title` and `Internship.description`

### Production checklist

- [ ] `NODE_ENV=production` in backend env
- [ ] HTTPS enforced (Vercel and Railway do this automatically)
- [ ] All `.env` values in platform dashboards (never in git)
- [ ] `npm audit` passes with no high severity issues
- [ ] Error middleware returns `"Internal server error"` in production (no stack traces)
- [ ] MongoDB Atlas connection uses IP allowlist
- [ ] Cloudinary API key has upload preset limited to `internai/` folder
- [ ] Rate limits active on all AI endpoints
- [ ] Socket.IO CORS restricted to production frontend URL only

---

## Database Schema Reference

### Collections summary

| Collection | Key fields | Indexes |
|---|---|---|
| `users` | email, role, passwordHash | email (unique) |
| `students` | userId, skills, resumeText, resumeScore | userId (unique), skills |
| `companies` | userId, companyName, industry | userId (unique) |
| `internships` | companyId, title, domain, skillsRequired, isActive | isActive+domain+isRemote, skills |
| `applications` | studentId, internshipId, status | studentId, internshipId, status; studentId+internshipId (unique) |
| `roadmaps` | studentId, targetRole, steps | studentId |
| `interviewsessions` | studentId, domain, avgScore | studentId |
| `peersessions` | studentA, studentB, domain, status | studentA, studentB |
| `progressrecords` | studentId, internshipId, status | studentId, status |
| `credentials` | studentId, tokenId, txHash | tokenId (unique), studentId |
| `twinconversations` | applicationId, companyId, studentId | applicationId |
| `marketdata` | domain, skills, fetchedAt | domain, fetchedAt (TTL 7 days) |
| `notifications` | userId, type, read | userId, read |

---

## API Reference

### Base URL

Development: `http://localhost:5000/api`
Production: `https://your-app.railway.app/api`

### Authentication

All protected routes require: `Authorization: Bearer <jwt_token>`

### Complete endpoint list

```
AUTH
  POST   /auth/signup
  POST   /auth/login
  GET    /auth/me

STUDENT
  GET    /students/me
  PUT    /students/me
  POST   /students/me/resume
  GET    /students/:id

COMPANY
  GET    /companies/me
  PUT    /companies/me
  POST   /companies/me/logo
  GET    /companies/:id

INTERNSHIP
  POST   /internships
  GET    /internships              ?domain&isRemote&minStipend&maxStipend&search&page&limit
  GET    /internships/:id
  PUT    /internships/:id
  DELETE /internships/:id
  GET    /internships/company/mine

APPLICATION
  POST   /applications
  GET    /applications/me
  GET    /applications/internship/:internshipId
  PUT    /applications/:id/status
  DELETE /applications/:id

DASHBOARD
  GET    /dashboard/student
  GET    /dashboard/company
  GET    /dashboard/admin

AI
  POST   /ai/resume-analysis
  POST   /ai/recommendations
  POST   /ai/interview/questions
  POST   /ai/interview/evaluate
  POST   /ai/chat
  POST   /ai/skillgap
  GET    /ai/skillgap
  PUT    /ai/skillgap/complete
  POST   /ai/twin/:applicationId
  GET    /ai/twin/:applicationId

GITHUB
  POST   /github/analyze
  GET    /github/report

MARKET
  GET    /market/pulse
  GET    /market/trending

PEER INTERVIEW
  POST   /peer/book
  GET    /peer/sessions
  POST   /peer/evaluate/:sessionId
  GET    /peer/leaderboard

PROGRESS
  GET    /progress
  GET    /progress/:recordId
  POST   /progress/:recordId/log
  POST   /progress/:recordId/complete

CREDENTIALS
  GET    /credentials
  POST   /credentials/issue/:progressRecordId
  GET    /credentials/verify/:tokenId       (public)

ADMIN
  GET    /admin/dashboard
  GET    /admin/students
  GET    /admin/risk-flags
  GET    /admin/report
```

---

*This README covers every module from initial setup to production deployment. Follow the build order in Section 6. Each module is self-contained and builds on top of the previous one. Start with Module 0–6 for the working MVP, then layer in AI features and innovations.*
