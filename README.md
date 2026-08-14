# VirtualCourses — AI-Powered Learning Management System
Live Link: https://ai-powered-learning-management-syst-ten.vercel.app/ 

An AI-powered Learning Management System (LMS) where educators can create and sell video courses, and students can learn, practice, and prep for jobs with AI-assisted tools — lecture transcripts, auto-generated quizzes, mock interviews, and resume review — on top of a traditional course platform (payments, progress tracking, certificates, reviews, and gamified streaks/XP).

## Features

**For Students**
- Browse and enroll in courses, track learning progress per lecture
- Watch course videos with AI-generated transcripts
- Auto-generated quizzes per lecture and per full course (from lecture content)
- AI Mock Interview — role-based interview simulation with a final AI-generated feedback report (score, strengths, improvements)
- AI Resume Review — ATS-style scoring, missing keywords, formatting issues, and actionable suggestions
- AI coding/practice problems with attempt tracking
- Certificates of completion, with public certificate verification
- Course reviews/ratings
- Gamification: daily streaks and XP for platform activity
- Google OAuth and email/password authentication (with forgot-password flow)

**For Educators**
- Educator dashboard
- Create, edit, and manage courses
- Upload and manage lectures per course (via Cloudinary)
- 
## Tech Stack

**Frontend** (`VirtualCourses/frontend`)
- React 19 + Vite
- Redux Toolkit / React Redux (state management)
- React Router v7
- Tailwind CSS v4
- Axios, Chart.js, React Toastify, React Icons, React Spinners

**Backend** (`VirtualCourses/backend`)
- Node.js + Express 5 (ESM)
- MongoDB + Mongoose
- Passport.js (Google OAuth 2.0) + JWT + express-session
- Cloudinary (media storage) + Multer (uploads)
- Razorpay (payments)
- Nodemailer (emails)
- bcryptjs (password hashing), validator

**AI**
- [Groq API](https://groq.com/) (`GROQ_API_KEY`)
  - `whisper-large-v3-turbo` for lecture audio transcription
  - `openai/gpt-oss-20b` for quiz generation, mock interview dialogue/feedback, resume review, and practice problems

**Deployment**
- `VirtualCourses/api/index.js` — serverless-style Express app export (e.g., for Vercel), with `vercel.json` at the project root and `connect-mongo` for session persistence in production

## Project Structure

```
AI-powered-Learning-Management-System-main/
└── VirtualCourses/
    ├── api/
    │   └── index.js           # Serverless entrypoint (e.g. Vercel)
    ├── backend/
    │   ├── config/             # DB, Cloudinary, Passport, JWT config
    │   ├── controller/         # Route handlers (auth, courses, AI, payments, etc.)
    │   ├── middleware/         # Auth guard, Multer, rate limiter, validation
    │   ├── model/               # Mongoose schemas
    │   ├── route/                # Express routers
    │   ├── utils/                # Gamification (streaks/XP) helpers
    │   └── index.js            # Standalone Express server entrypoint
    ├── frontend/
    │   └── src/
    │       ├── component/      # Reusable UI components
    │       ├── pages/           # Route-level pages (incl. Educator/ subpages)
    │       ├── redux/            # Redux slices/store
    │       └── customHooks/     # Custom React hooks
    ├── package.json            # Root/serverless dependencies
    └── vercel.json
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A MongoDB database (local or Atlas)
- Accounts/API keys for: Groq, Cloudinary, Razorpay, Google OAuth, and an SMTP-capable email account

### 1. Clone and install

```bash
git clone <https://github.com/Adityaftftfhvg/AI-powered-Learning-Management-System.git>
cd AI-powered-Learning-Management-System-main/VirtualCourses

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `VirtualCourses/backend/` (also used by `api/index.js`) with the following:

```env
# Server
PORT=8000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

# Database
MONGODB_URL=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Media storage
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (password reset, notifications)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

# AI
GROQ_API_KEY=your_groq_api_key
```

### 3. Run in development

```bash
# Backend (from VirtualCourses/backend)
npm run dev        # nodemon index.js — runs on PORT

# Frontend (from VirtualCourses/frontend, in a separate terminal)
npm run dev         # Vite dev server, default http://localhost:5173
```

The frontend expects the backend API at `BACKEND_URL`/`FRONTEND_URL` as configured above (adjust API base URLs in the frontend if needed).

### 4. Build for production

```bash
cd frontend
npm run build
```

For serverless deployment (e.g. Vercel), the app is exposed via `VirtualCourses/api/index.js` and configured through `VirtualCourses/vercel.json`.

## API Overview

All routes are mounted under `/api`:

| Route prefix | Purpose |
|---|---|
| `/api/auth` | Signup, login, Google OAuth, forgot/reset password |
| `/api/user` | User profile management |
| `/api/course` | Course CRUD, browsing |
| `/api/lecture` | Lecture upload/management |
| `/api/review` | Course reviews and ratings |
| `/api/progress` | Lecture/course completion tracking |
| `/api/certificate` | Certificate issuance and verification |
| `/api/practice` | AI-generated coding/practice problems |
| `/api/resume` | AI resume review |
| `/api/ai` | Transcript generation, quiz generation, mock interview |

## License

No license file was found in this repository — add one (e.g. MIT) if you intend to open-source this project.
