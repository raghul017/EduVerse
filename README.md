# EduVerse

AI-powered social learning platform that turns scrolling time into meaningful study sessions. This repository contains both the frontend (React + Vite + Tailwind) and backend (Node.js + Express + PostgreSQL) necessary to ship the MVP described in `idea.md`.

## Project layout

```
frontend/  # React app (Vite, TailwindCSS, Zustand, React Router)
backend/   # Express API (JWT auth, PostgreSQL, AI integrations)
idea.md    # Full product specification
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 9+
- PostgreSQL 15+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Documentation

- `IMPLEMENTATION_GUIDE.md` explains the recommended build order, env vars, and deployment notes.
- `idea.md` captures the original MVP scope.

### New migrations

Whenever you pull new changes, check the `supabase/migrations` folder. For video transcription support, run:

```sql
-- supabase/migrations/002_add_post_transcript.sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS transcript TEXT;
```

Apply it via the Supabase SQL editor or `psql` CLI before restarting the backend.

## Status

This codebase is scaffolded to mirror the spec and ready for iterative implementation. Track progress via the TODO list (managed in-session).
