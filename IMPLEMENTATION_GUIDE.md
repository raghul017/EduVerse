# EduVerse Implementation Guide

This document translates the `idea.md` spec into practical build steps for the combined frontend + backend codebase.

## Phase 1 – Week 1-2

1. **Auth foundation**
   - Implement PostgreSQL schema (`supabase/migrations/001_init.sql`).
   - Configure `backend/src/config/database.js` to read `DATABASE_URL`.
   - Build auth routes/controllers (signup, login, forgot/reset password).
2. **Educational feed**
   - Create `post.routes.js` + controller for CRUD, likes, bookmarks.
   - Implement `frontend/src/pages/Home.jsx` with `FeedContainer`, `PostCard`.
3. **Content upload**
   - Enable Multer + Cloudinary integration.
   - Build `UploadModal` + API call to `/api/posts`.
4. **Profiles & social graph**
   - Routes for follow/unfollow.
   - Profile pages with `ProfileHeader`, `ProfilePosts`.

## Phase 2 – Week 3-4

1. **AI features**
   - Finish `ai.service.js` with Groq primary, Gemini fallback.
   - Wire AI summary/quiz/explain endpoints in `post.controller.js`.
2. **Communities**
   - Expose `/api/communities` endpoints.
   - Frontend pages for browsing/joining communities.
3. **Learning dashboard**
   - `dashboard.routes.js` for stats, streaks, bookmarks.
   - Frontend dashboard page with `StatsCard`, `StreakDisplay`, `ProgressChart`.

## Environment variables (`backend/.env.example`)

```
DATABASE_URL=postgresql://user:password@host:5432/eduverse
JWT_SECRET=change-me-32-chars
JWT_EXPIRE=7d
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SUPABASE_URL=xxx
SUPABASE_KEY=xxx
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Supabase setup (PostgreSQL + storage)

1. **Create project**

   - Go to https://app.supabase.com → `New Project`.
   - Choose a secure password (this becomes the default Postgres password).
   - Select the free tier region closest to your users.

2. **Database config**

   - Once provisioned, open Project Settings → `Database`.
   - Copy the `Connection string` (URI). It will look like:
     ```
     postgresql://postgres:[password]@db.[hash].supabase.co:5432/postgres
     ```
   - Replace `DATABASE_URL` inside your backend `.env` with this URI (add `?sslmode=require` if connecting from hosted backend).

3. **Run migrations**

   - In Supabase dashboard, open SQL Editor.
   - Paste the contents of `supabase/migrations/001_init.sql`.
   - Run the query; verify tables appear under the `Table Editor`.

4. **Storage (optional)**

   - If you prefer Supabase Storage instead of Cloudinary:
     - Go to `Storage` → `Create bucket` (e.g., `eduverse-videos`).
     - Set public access to false (you will sign URLs).
     - Save the bucket name and service role key.
     - Update backend config to upload videos with Supabase client (future enhancement; current code uses Cloudinary).

5. **Client keys**

   - Go to Project Settings → `API`.
   - Copy the `anon/public` key (useful for frontend if you integrate Supabase auth later).
   - Copy the `service_role` key if backend needs admin access (keep it server-side only).

6. **Local connectivity**

   - Install the Supabase CLI (`npm i -g supabase`) if you want to run `supabase start` locally.
   - Otherwise, connect directly with `psql`:
     ```
     psql "postgresql://postgres:[password]@db.[hash].supabase.co:5432/postgres?sslmode=require"
     ```

7. **Seeding data**
   - Use the SQL editor or `psql` to insert starter users, posts, and communities.
   - Example:
     ```sql
     INSERT INTO communities (name, subject, description)
     VALUES ('Math Circle', 'Math', 'Daily math challenges');
     ```

Keep the Supabase project password safe; it cannot be recovered. Rotate credentials regularly.

## Groq-powered transcription

- Set `GROQ_API_KEY` in `backend/.env`. The backend uses Groq Whisper (`whisper-large-v3`) to transcribe uploaded videos.
- Ensure `supabase/migrations/002_add_post_transcript.sql` has been executed so the `posts` table includes a `transcript` column.
- During upload, the backend uploads to Cloudinary and sends the raw buffer to Groq. If Groq fails, the app falls back to the post description for AI summaries/quizzes and the UI will show a warning.

## Scripts

| Location | Script          | Description                |
| -------- | --------------- | -------------------------- |
| frontend | `npm run dev`   | Start Vite dev server      |
| frontend | `npm run build` | Production build + preview |
| backend  | `npm run dev`   | Nodemon-based API server   |
| backend  | `npm run start` | Production Express server  |

## Testing checklist

- Auth flow (signup/login/logout, JWT storage)
- Feed pagination, likes, bookmarks
- Upload validation & storage
- Profile follow/unfollow
- AI summary/quiz/explain caching
- Communities join/leave
- Dashboard stats & streak logic

## Deployment pointers

- Deploy frontend to Vercel/Netlify.
- Deploy backend to Railway/Render with `PORT` + `FRONTEND_URL`.
- Use Supabase for Postgres + storage, or Cloudinary for videos.

Ship fast, iterate relentlessly. 🚀
