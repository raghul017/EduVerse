# EduVerse – Current Implementation Status (Nov 2025)

Use this file when picking up the project outside Cursor. It summarizes what was recently built, how to run it, and the remaining high‑priority work.

---

## ✅ Recently Completed

### 1. Transcription‑aware AI pipeline

- Uploaded videos are stored on Cloudinary; metadata + URLs live in Postgres via Supabase.
- A `posts.transcript` column was added (see migrations).
- AI summary/quiz/flashcards/explain endpoints now **prefer transcript** when available and fall back to description/content.
- Frontend shows “transcript/description” information so users know what AI used.

### 2. Creator controls & profile channel

- Creators can **delete** their own posts:
  - `DELETE /api/posts/:id` (owner‑only).
  - Corresponding delete button on feed cards.
- [MyVideos](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/frontend/src/pages/MyVideos.jsx:6:0-44:1) page behaves like a simple creator “channel”:
  - Uses `ProfileHeader` + `ProfilePosts` to show your own uploads.
  - Errors and loading states handled.

### 3. UI overhaul & navigation

- Global light theme with:
  - White cards, rounded 2xl/3xl corners.
  - Subtle borders/shadows, professional typography.
- Navigation:
  - Navbar with **Feed, Upload, Communities, Dashboard**.
  - Authenticated dropdown **Roadmaps ▾** with:
    - `Video paths` (`/paths`)
    - `AI roadmap` (`/ai-roadmap`)
    - `AI course` (`/ai-course`)
- Home / Dashboard:
  - Dashboard page (`/dashboard`) shows:
    - Posts watched, bookmarks, subjects explored.
    - Streak display and per‑subject progress chart.
    - Simple AI activity section derived from stats.

### 4. Communities (Discord‑style)

- Backend routes for communities:
  - `GET /api/communities` – list communities.
  - Per‑community views & basic community chat (see `community.routes.js` and related SQL migrations).
- Frontend:
  - `Communities` page that lists communities + basic metrics.
  - Per‑community view behaves like a simple channel list + feed.
  - **Community chat** implemented as a lightweight text chat inside each community.

### 5. Learning paths / roadmaps

- **Database:**

  - `learning_paths` table (id, creator_id, title, description, subject, level, created_at).
  - `learning_path_posts` table to attach posts to paths with `position` and `resources` (JSON/text with recommended materials).
  - `user_path_progress` for tracking `current_step` and `completed`.

- **Backend:**

  - Routes ([backend/src/routes/path.routes.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/routes/path.routes.js:0:0-0:0)):
    - `GET /api/paths` – list paths with lesson counts.
    - `GET /api/paths/:id` – path detail with ordered lessons and `resources`.
    - `POST /api/paths` – create new path (creator only).
    - `GET /api/paths/:id/progress` – get user progress in a path.
    - `POST /api/paths/:id/progress` – upsert user progress.
  - Controller logic in [path.controller.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:0:0-0:0):
    - [listPaths](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:3:0-25:2), [getPath](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:149:0-184:2), [createPath](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:186:0-242:2), [getPathProgress](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:244:0-259:2), [updatePathProgress](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:261:0-282:2).

- **Frontend:**
  - [Paths.jsx](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/frontend/src/pages/Paths.jsx:0:0-0:0):
    - Lists existing paths using `PathCard`.
    - Form to create a new path:
      - Title, subject, level, description.
      - “Available lessons” list from your uploaded videos.
      - Ability to add lessons as ordered steps and attach “resources” notes/links.
    - Shows a “Path outline” with steps and their resources.
  - [PathDetail.jsx](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/frontend/src/pages/PathDetail.jsx:0:0-0:0):
    - Displays selected path with:
      - Title, subject, level, description, step count.
      - Steps list on the left (Step 1..N).
      - Detail panel on the right for the selected step:
        - Video title, subject, description.
        - Button to open the video detail page.
        - “Recommendations” section showing `resources` for that step.

### 6. AI‑powered roadmap (role‑based)

- **Backend** – [backend/src/services/ai.service.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:0:0-0:0):

  - [generateRoadmap(role)](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:145:2-208:3):

    - Uses Groq via [callAI](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:73:2-85:3) with **model `llama-3.1-8b-instant`** (priority `"fast"`).
    - Prompt enforces **strict JSON** structure:

      ```jsonc
      {
        "title": "string",
        "description": "short overview of the role roadmap",
        "stages": [
          {
            "id": "string",
            "label": "string",
            "summary": "short description",
            "nodes": [
              {
                "id": "string",
                "label": "string",
                "details": "short single-line description (no line breaks, no bullet points)",
                "dependsOn": ["id", "id"]
              }
            ]
          }
        ]
      }
      ```

    - Adds logging:
      - `"AI roadmap raw response (trimmed) ..."`
      - `"AI roadmap JSON string to parse (trimmed) ..."`
    - Cleans response (removes ```json fences), extracts the main `{ ... }`block by regex, then`JSON.parse`.
    - Caches per role in an in‑memory NodeCache for 24h.

  - Hard failure modes:
    - If Groq fails or JSON parse fails → logs `AI roadmap JSON parse failed ...` and returns `null`.

- **Controller** – [aiRoadmap](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:27:0-86:2) in [backend/src/controllers/path.controller.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:0:0-0:0):

  - `POST /api/paths/ai-roadmap` (auth required):

    - Body: `{ "role": "Frontend Developer" }`.
    - Calls [aiService.generateRoadmap(role)](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:145:2-208:3).
    - If AI returns `null`, responds with a **static fallback roadmap**:

      ```jsonc
      {
        "title": "<role> roadmap",
        "description": "AI provider is currently unavailable. This is a simple fallback outline.",
        "stages": [
          {
            "id": "basics",
            "label": "Foundations",
            "nodes": [...]
          },
          {
            "id": "projects",
            "label": "Projects",
            "nodes": [...]
          }
        ]
      }
      ```

- **Frontend** – [frontend/src/pages/AiRoadmap.jsx](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/frontend/src/pages/AiRoadmap.jsx:0:0-0:0):
  - Preset role chips (Frontend/Backend/Fullstack/Data Scientist/ML Engineer).
  - Free‑form role input and “Generate roadmap” button.
  - Calls `/paths/ai-roadmap`, logs `AI roadmap response`, and renders:
    - Title + description.
    - Horizontal scroll of **stages** as columns.
    - Each stage shows **nodes** in stacked cards, including `details` and `dependsOn`.

### 7. AI‑powered course generator (roadmap.sh/ai/course‑style)

- **Backend** – [backend/src/services/ai.service.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:0:0-0:0):

  - [generateCourse(topic)](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:210:2-279:3):

    - Uses Groq via [callAI](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:73:2-85:3) with model `llama-3.1-8b-instant`.
    - Prompt enforces a course JSON structure:

      ```jsonc
      {
        "title": "string",
        "description": "short overview of the course",
        "modules": [
          {
            "id": "string",
            "title": "string",
            "summary": "short description",
            "lessons": [
              {
                "id": "string",
                "title": "string",
                "objective": "short single-line objective (no line breaks)",
                "suggestedResources": [
                  {
                    "type": "video | article | docs | exercise",
                    "title": "string",
                    "url": "string URL or empty string"
                  }
                ]
              }
            ]
          }
        ]
      }
      ```

    - Same cleaning and parsing pattern as roadmap:
      - Remove fences, extract `{ ... }` block, log trimmed raw + JSON string, `JSON.parse`.
    - Cached per topic in NodeCache.

- **Controller** – [aiCourse](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:88:0-147:2) in [backend/src/controllers/path.controller.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/controllers/path.controller.js:0:0-0:0):

  - `POST /api/paths/ai-course` (auth required):
    - Body: `{ "topic": "Frontend Development" }`.
    - Calls [aiService.generateCourse(topic)](cci:1://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/services/ai.service.js:210:2-279:3).
    - On failure returns a **fallback course**:
      - Foundations + Projects modules.
      - Few simple lessons; empty `suggestedResources`.

- **Route** – [backend/src/routes/path.routes.js](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/src/routes/path.routes.js:0:0-0:0):

  - `router.post("/ai-course", authenticate, aiCourse);`

- **Frontend** – [frontend/src/pages/AiCourse.jsx](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/frontend/src/pages/AiCourse.jsx:0:0-0:0):
  - UX modeled on `https://roadmap.sh/ai/course`:
    - Preset topic chips.
    - Free‑form topic input.
    - “Generate course” button.
  - On submit:
    - `POST /paths/ai-course` with `{ topic }`.
    - Logs `AI course response` and stores `course`.
  - Renders:
    - Course title + description.
    - For each module:
      - Module title + summary.
      - Lessons as cards with:
        - Lesson title.
        - Objective text.
        - Optional list of `suggestedResources` with `type`, title, and “Open” link.

---

## 📦 Environment & Setup Notes

- **Backend env – [backend/.env](cci:7://file:///Users/raghular/Documents/Projects/EduVerse/backend/.env:0:0-0:0):**

  ```env
  NODE_ENV=development
  PORT=5051
  FRONTEND_URL=http://localhost:5175
  DATABASE_URL=postgresql://...supabase.co:5432/postgres?sslmode=require
  JWT_SECRET=...
  JWT_EXPIRE=7d
  GROQ_API_KEY=<valid Groq key, e.g. gsk_...>
  GEMINI_API_KEY=<valid Gemini key or leave unset>
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  SUPABASE_URL=https://<project>.supabase.co
  SUPABASE_KEY=<service role or anon key>
  FRONTEND_URL=http://localhost:5173
  ```
