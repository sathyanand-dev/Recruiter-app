# Recruiter Module — Simple README

Small full-stack recruiter module (Express + Mongo backend, React + Vite frontend) that lets a user sign up, log in, create job drafts with autosave, preview, publish, list, view and delete their jobs.

Quick start (Windows PowerShell)

1) Backend

```powershell
cd "D:\Recruiter app\recruiter-module\server"
copy .env.example .env
# Edit server/.env and set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Default server: http://localhost:4000 (adjustable via PORT in .env)

2) Frontend

```powershell
cd "D:\Recruiter app\recruiter-module\client"
npm install
# Optional: create client/.env with VITE_API_URL=http://localhost:4000/api
npm run dev
```

Open the Vite URL shown by the dev server (commonly http://localhost:5173).

Environment variables
- server/.env (at minimum):
	- MONGO_URI=your_mongodb_connection_string
	- JWT_SECRET=some_secret
	- PORT=4000 (optional)
- client/.env (optional):
	- VITE_API_URL=http://localhost:4000/api

Main features
- User signup & login (bcrypt + JWT)
- Multi-field Create Job form with debounced autosave
- Rich text job description (react-quill)
- Preview, Publish, List, Detail and Delete for owner-only jobs

Important files
- server/: Express API and Mongoose models
	- routes: `server/routes/auth.js`, `server/routes/jobs.js`
	- models: `server/models/User.js`, `server/models/Job.js`
- client/: React app (Vite + Tailwind)
	- pages: `client/src/pages/CreateJob.jsx`, `JobList.jsx`, `JobDetail.jsx`, `PreviewPost.jsx`, `Signup.jsx`, `Login.jsx`
	- api helper: `client/src/api/api.js`

Thank you 

