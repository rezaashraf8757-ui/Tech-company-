# Smart Interview AI

An AI-powered voice interview system that asks questions via text-to-speech, listens to answers via speech-to-text, analyzes responses using OpenAI, and provides real-time adaptive scoring and feedback.

---

## Architecture

```
smart-interview/
  backend/          # Node.js + Express + MongoDB
    middleware/     # JWT auth middleware
    models/         # Mongoose schemas (User, Interview)
    routes/         # API routes (auth, interview, resume, dashboard)
    server.js       # Entry point
    .env.example    # Environment variables template
  frontend/         # React + Vite + Tailwind CSS
    src/
      components/   # Reusable UI (Navbar)
      pages/        # Route-level pages (Dashboard, InterviewRoom, etc.)
      api.js        # Axios config with auth interceptor
      App.jsx       # Router setup
      index.css     # Tailwind + custom styles
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide React |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| APIs | OpenAI GPT-3.5, Web Speech API (TTS + STT) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Storage | MongoDB Atlas or local MongoDB |

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional, fallback questions work without it)
- Chrome / Edge browser for best Web Speech API support

---

## Setup Instructions

### 1. Clone / Extract

```bash
cd "smart interview"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart_interview
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

Start backend:

```bash
npm run dev
# or
node server.js
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies `/api` to backend.

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Voice Interview** | AI speaks questions using Web Speech API TTS. User answers via microphone STT. |
| **Smart Analysis** | OpenAI evaluates technical correctness, grammar, communication, and confidence. |
| **Adaptive Questions** | Difficulty auto-adjusts based on performance. High scores = harder questions. |
| **Resume-Based** | Upload a PDF resume. Skills are extracted and questions are personalized. |
| **Role Modes** | Software Developer, HR Round, Managerial Round with tailored question banks. |
| **Dashboard** | Performance charts, recent scores, and interview history. |
| **Auth System** | JWT-based login/signup with protected routes. |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Sign up |
| POST | `/api/auth/login` | Sign in |
| GET  | `/api/auth/me` | Current user |
| POST | `/api/interview/start` | Begin session |
| POST | `/api/interview/answer` | Submit answer |
| POST | `/api/interview/finish` | End session |
| GET  | `/api/interview/session/:id` | Session details |
| POST | `/api/resume/upload` | Upload PDF |
| GET  | `/api/resume/skills` | Get skills |
| GET  | `/api/dashboard/history` | Interview history |
| GET  | `/api/dashboard/stats` | Dashboard stats |

---

## Limitations

- Cannot fully judge real human emotions or body language.
- Speech recognition accuracy decreases in noisy environments.
- Requires a stable internet connection.
- OpenAI API key needed for best analysis quality; fallback scoring works without it.
- Web Speech API works best in Chrome / Edge.

---

## Deployment

### Backend (Render / Railway / VPS)

1. Set environment variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`).
2. Build command: `npm install && npm start`.
3. Ensure CORS allows your frontend domain.

### Frontend (Vercel / Netlify)

1. Update `vite.config.js` proxy target to your deployed backend URL.
2. Or better: use environment variable `VITE_API_URL` and set it in `api.js`.
3. Build: `npm run build`.
4. Deploy the `dist/` folder.

---

## Future Improvements

- AI Avatar with video lip-sync
- Video interview with webcam analysis
- Emotion detection via facial expressions
- Multi-language interview support
- ElevenLabs for ultra-realistic voice
- PDF report generation with charts
- Leaderboard and peer comparison

---

## License

MIT License — Diploma / Academic Project.
