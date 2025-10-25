# Recruiter Module - Full Stack

## Setup

### Backend
cd server
cp .env.example .env
# edit .env: MONGO_URI, JWT_SECRET
npm install
npm run dev

### Frontend
cd client
npm install
# optionally create a .env with VITE_API_URL=http://localhost:4000/api
npm run dev

Open the client at the Vite URL (usually http://localhost:5173)

## Features
- Signup / Login (bcrypt + JWT)
- Create job multi-step form with autosave to MongoDB
- Preview & publish
- Job list and job detail (only owner jobs)

## Notes
- Backend: Express + Mongoose. Configure `server/.env` with MONGO_URI and JWT_SECRET.
- Client: Vite + React + Tailwind. Uses `react-quill` for rich text.
- Autosave: CreateJob uses a debounced autosave to POST `/jobs/save` and keeps `_id` in state.

## Security
- Passwords hashed with bcrypt on server.
- JWT used for API authentication, stored in `localStorage` and attached as `Authorization: Bearer <token>`.

## Next steps / optional enhancements
- Add server-side validation (express-validator)
- Add pagination and search improvements
- Add unit/integration tests (Jest + supertest on server)

