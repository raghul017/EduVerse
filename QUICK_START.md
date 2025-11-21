# EduVerse - Quick Start Guide

## 🎯 What You Need to Do RIGHT NOW

### 1. Backend Environment Setup (5 min)

```bash
cd backend
cp env.example .env
```

Edit `backend/.env` and fill in:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require

# JWT (generate a random 32+ char string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-here
JWT_EXPIRE=7d

# AI APIs
GROQ_API_KEY=gsk_your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here  # Optional

# Cloudinary (for video storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Supabase (optional, for storage alternative)
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_KEY=your_supabase_key
```

### 2. Get API Keys (10 min)

#### Groq API Key (REQUIRED)
1. Go to https://console.groq.com
2. Sign up/login
3. Click "API Keys" → "Create API Key"
4. Copy key (starts with `gsk_`)

#### Cloudinary (REQUIRED)
1. Go to https://cloudinary.com
2. Sign up for free account
3. Dashboard → Settings → "API Keys"
4. Copy: Cloud Name, API Key, API Secret

#### Gemini API Key (OPTIONAL - backup)
1. Go to https://aistudio.google.com
2. Sign in → "Get API Key"
3. Copy key

### 3. Database Setup (15 min)

#### Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose:
   - Organization (or create one)
   - Name: `eduverse` (or your choice)
   - Database Password: **SAVE THIS** (you'll need it)
   - Region: Choose closest to you
4. Wait 2-3 minutes for provisioning

#### Get Connection String
1. In Supabase dashboard → Settings → Database
2. Under "Connection string" → "URI"
3. Copy the string (looks like: `postgresql://postgres:[PASSWORD]@db.[hash].supabase.co:5432/postgres`)
4. Add `?sslmode=require` at the end
5. Replace `[PASSWORD]` with your database password
6. Paste into `backend/.env` as `DATABASE_URL`

#### Run Migrations
1. In Supabase dashboard → SQL Editor
2. Open each migration file in order:
   - `supabase/migrations/001_init.sql` → Run
   - `supabase/migrations/002_add_post_transcript.sql` → Run
   - `supabase/migrations/003_learning_paths.sql` → Run
   - `supabase/migrations/004_learning_path_resources.sql` → Run
   - `supabase/migrations/005_community_chat.sql` → Run
3. Verify: Go to "Table Editor" → Should see all tables

### 4. Install Dependencies & Start

```bash
# Backend
cd backend
npm install
npm run dev
# Should see: "EduVerse API running on port 5000"

# Frontend (new terminal)
cd frontend
npm install
npm run dev
# Should open http://localhost:5173
```

### 5. Test It Works

1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Login
5. Try uploading a video (if you have one)
6. Check the feed

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can sign up a new user
- [ ] Can login
- [ ] Can see the feed (even if empty)
- [ ] Database connection works (check backend console)
- [ ] No CORS errors in browser console

---

## 🐛 Common Issues

### "Missing required env vars"
- Check `backend/.env` exists
- Verify all required variables are set (especially `DATABASE_URL`, `JWT_SECRET`)

### "Connection refused" or database errors
- Check `DATABASE_URL` is correct
- Verify Supabase project is active
- Check password in connection string matches your database password
- Ensure `?sslmode=require` is at the end of `DATABASE_URL`

### "CORS error" in browser
- Check `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default should be `http://localhost:5173`

### "Cloudinary is not configured"
- Check all three Cloudinary variables in `.env`
- Verify credentials are correct

### "No AI providers configured"
- At minimum, set `GROQ_API_KEY`
- Verify the key is correct (starts with `gsk_`)

### Frontend can't connect to backend
- Check backend is running on port 5000
- Check `VITE_API_URL` in frontend (should be `http://localhost:5000` or leave empty to use proxy)
- Check browser console for errors

---

## 📝 Next Steps After Setup

Once everything is running:

1. **Test Video Upload**
   - Upload a short test video
   - Check if it appears in Cloudinary
   - Verify transcript is generated (check database)

2. **Test AI Features**
   - View a post with transcript
   - Click "AI Summary"
   - Click "AI Quiz"
   - Click "AI Flashcards"

3. **Explore Features**
   - Create a learning path
   - Join a community
   - Check dashboard stats

4. **Read Full Documentation**
   - `STATUS_ANALYSIS.md` - What's implemented
   - `PROGRESS.md` - Recent changes
   - `IMPLEMENTATION_GUIDE.md` - Build guide
   - `idea.md` - Full specification

---

## 🆘 Still Having Issues?

1. Check backend console for error messages
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all migrations ran successfully
5. Check Supabase dashboard → Database → Tables (should see all tables)

---

**Time to complete:** ~30-45 minutes (mostly waiting for Supabase provisioning)

