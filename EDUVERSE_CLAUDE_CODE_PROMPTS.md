# EduVerse Frontend: Claude Code Prompt Pack

Run these **in order**. Each phase assumes the previous one is committed.
Copy one prompt at a time into Claude Code. Do not paste the whole file.

**Decisions already made** (baked into the prompts below):
- **Light theme only.** Tokens stay structured so dark can be re-added later without rework.
- **Visual direction:** Linear's structural discipline (tight spacing scale, 1px hairline borders, restrained motion) with slightly warmer, larger type because the audience is students.
- **Accent change is mandatory, not cosmetic.** `#A1FF62` on white is ~1.3:1 contrast. It fails WCAG for any text or icon use. Lime survives only as a chip/badge background with near-black text.

**Scale of the job**, measured on your actual code:

| Literal | Count |
|---|---|
| `#A1FF62` | 331 |
| `#1a1a1a` | 74 |
| `#666` | 63 |
| `#2a2a2a` | 42 |
| `#0a0a0a` | 38 |
| everything else | ~250 |

---

## Phase 0: Ground rules

Run this once. It gives Claude Code persistent context for every later prompt.

```
Create a CLAUDE.md file at frontend/CLAUDE.md documenting the conventions for this
React + Vite + Tailwind codebase. Read the existing code first to get it accurate,
then write down:

- Stack: Vite 5, React 18.3, React Router 6.28, Zustand 5, Tailwind 3.4, Axios
- Folder layout under src/ and what belongs in each folder
- The design token system: src/styles/design-system.css defines CSS custom
  properties, tailwind.config.js maps them to semantic class names
- The rule that will govern all future work: NEVER write a raw hex colour in JSX.
  Always use the semantic Tailwind class backed by a token.
- Store patterns: how the 4 Zustand stores are shaped, and the optimistic-update
  with-rollback pattern used in postStore.js
- API layer: src/utils/api.js axios instance, baseURL construction, interceptors

Keep it under 150 lines. Be factual, describe what IS there, not what should be.
```

---

## Phase 1: Fix what is actively broken

These are live production bugs. Do these before anything visual.

### 1.1 The crash

```
frontend/src/pages/PostDetail.jsx renders <AIFlashcards postId={post.id}
transcriptReady={transcriptReady} /> on line 212, but never imports AIFlashcards.
The component exists at frontend/src/components/ai/AIFlashcards.jsx.

This throws "ReferenceError: AIFlashcards is not defined" on every video detail
page. Vite's build does not catch it.

Fix the import. Then audit EVERY file in src/pages/ and src/components/ for the
same class of bug: any JSX identifier used in a render that has no matching import
or local definition in that file. Report anything else you find before fixing it.
```

### 1.2 Dead module reference

```
frontend/src/components/layout/Sidebar.jsx line 3 imports { useAuthStore } from
"../../state/store". There is no src/state/ directory. The correct path is
"../../store/authStore".

First check whether Sidebar.jsx is imported anywhere in the codebase.
- If nothing imports it: delete the file and tell me what it contained.
- If something does import it: fix the path.

Do the same check for these files, which I believe are also unreferenced:
MegaMenu.jsx, CommunityChat.jsx, Skeleton.jsx, ThemeToggle.jsx.
Report which are truly dead before deleting anything.
```

### 1.3 Duplicate cold-start banners

```
There are two ColdStartBanner components:
- frontend/src/components/common/ColdStartBanner.jsx  (calls /health)
- frontend/src/components/auth/ColdStartBanner.jsx    (calls /health/status)

The common/ one is mounted globally in App.jsx. The auth/ one is mounted on both
Login and Signup. Users on the login page currently see two different banners with
two different designs firing two different requests.

Consolidate into ONE component at src/components/common/ColdStartBanner.jsx.
Keep the better-looking of the two designs (show me both before deciding).
Mount it globally only. Remove it from Login.jsx and Signup.jsx.
Delete src/components/auth/ColdStartBanner.jsx.
```

### 1.4 Dead route

```
frontend/src/components/paths/PathCard.jsx links to /paths/${path.id}, but
frontend/src/App.jsx registers no /paths/:id route. The catch-all
<Route path="*" element={<Navigate to="/" replace />} /> silently sends users
back to the homepage when they click any learning path card.

The backend endpoint GET /paths/:id exists and works.

Add a PathDetail page at src/pages/PathDetail.jsx and register the /paths/:id
route inside MainLayout. Follow the data-fetching and loading/error pattern
already used in src/pages/CommunityDetail.jsx so it is consistent.

Also: in App.jsx the path="*" catch-all is declared on line 118, before the
/communities routes on 121 and 129. React Router v6 ranks by specificity so it
happens to work, but move the catch-all to be the last route declared.
```

### 1.5 Auth session handling

```
frontend/src/utils/api.js has a 401 response interceptor that clears
localStorage but never updates the Zustand auth store and never redirects.
Result: a user with an expired token sits on a protected page that renders,
fires requests, gets 401s, and shows no feedback. The store and localStorage
drift out of sync.

Also: authStore.js hydrates user from localStorage synchronously, and fetchMe()
is defined but never called anywhere, so a revoked token still renders as
logged in.

Fix all three:
1. On 401, the interceptor must clear the auth store state, not just localStorage.
   Avoid a circular import by having the store subscribe or by dispatching a
   custom window event the store listens for. Pick the cleaner option and explain
   why.
2. Call fetchMe() once on app mount to revalidate the session, with a loading
   state so protected routes do not flash before the check completes.
3. ProtectedRoute should redirect to /login with the attempted path preserved in
   location state, so users return where they were after signing in.

Do not change any backend contract or endpoint.
```

### 1.6 Verify Phase 1

```
Run npm run build. Then start the dev server and manually verify:
- a video detail page renders without console errors
- clicking a learning path card opens a detail page, not the homepage
- the login page shows exactly one cold-start banner
- with a manually corrupted token in localStorage, the app redirects to /login
  instead of hanging on a broken page

Report anything still failing. Do not move to Phase 2 until all four pass.
```

---

## Phase 2: Cleanup

Cheap wins. Do these before the design migration so you are restyling less code.

### 2.1 Strip debug output

```
There are 40+ console.log calls in frontend/src, including tagged traces like
[Progress], [Chat], [Upload], [Frontend API] that log full API response bodies.
These ship to production.

1. Add esbuild: { drop: ['console', 'debugger'] } to the production config in
   frontend/vite.config.js so this can never regress.
2. Then delete the genuinely useless logs from source anyway. Keep console.error
   in actual catch blocks where a developer would need the signal.

Show me the list of what you are removing before removing it.
```

### 2.2 Dependency diet

```
frontend/package.json has dependencies I believe are unused. For EACH of these,
grep the entire src/ tree and tell me the import count before touching anything:

  chart.js, react-chartjs-2, reactflow, classnames, clsx, tailwind-merge,
  date-fns, dayjs

Then:
- Remove every one with zero imports (reactflow is the big win, it is heavy)
- Where two libraries do the same job and both are used, consolidate to one:
  keep clsx over classnames, keep date-fns over dayjs, and migrate the callers
- framer-motion and motion are THE SAME LIBRARY under two package names.
  MultiStepLoader.jsx imports from "motion/react" while everything else imports
  from "framer-motion". This likely double-bundles it. Standardise every import
  on "framer-motion" and remove the "motion" package.

Run npm run build before and after. Report the vendor chunk size change.
```

### 2.3 Memory leaks

```
Two real leaks:

1. frontend/src/components/common/SmoothScroll.jsx around lines 38-41: the
   cleanup calls gsap.ticker.remove() with a NEW arrow function rather than the
   reference that was added, so the ticker callback is never removed. Every
   navigation to or from /ai-tutor leaks one. Hoist the callback to a named
   reference and remove that exact reference.

2. frontend/src/components/ui/Magnetic.jsx around lines 35-38: cleanup reads
   ref.current at unmount time when it may already be null, and captures a stale
   ref. Copy ref.current into a local variable inside the effect and use that
   local in the cleanup.

Also review src/pages/CommunityDetail.jsx line ~44: a 15-second polling interval.
The cleanup is correct so leave it working, but add a code comment noting it
should become SSE or websockets later.
```

### 2.4 Make the linter real

```
frontend/package.json defines a lint script but there is no eslint config file,
so npm run lint fails. The eslint deps are already installed.

Create a flat or legacy eslint config appropriate to eslint 8.57 that covers
React 18 + hooks + import resolution for .js/.jsx. Include the
react-hooks/exhaustive-deps rule as a warning, not an error.

Run it. Fix errors. Report warnings in a list without auto-fixing them, so I can
decide which matter.
```

### 2.5 Unused state and dead branches

```
Find and remove dead state across these files. Confirm each is genuinely unused
before deleting:

- Feed.jsx: a difficulty filter that is set but never applied to the filtering
- AiRoadmap.jsx: showSettings, detailLevel, topicRoadmaps, showCustomOption, and
  an unused PlaceholdersAndVanishInput import
- Paths.jsx: a handleChange for a level field that goes nowhere
- RoadmapGenerator.jsx: a memoized NodeCard component defined at lines ~40-127
  and never used, while an identical ~80-line motion.div is inlined in the render
  loop at ~862-940. Also an unused LoadingStep and unused useMemo/useCallback
  imports.

For RoadmapGenerator.jsx specifically: it is 965 lines. Use the already-defined
NodeCard instead of the inline duplicate, then split the file into the page
component plus extracted subcomponents. Target under 300 lines for the page.

Also replace the window.location.href navigation in UploadModal.jsx line ~76
with useNavigate(), it currently forces a full page reload and discards app state.
```

---

## Phase 3: Design foundation

This is where it starts looking like a product.

### 3.1 Rebuild the token layer for light

```
Rewrite frontend/src/styles/design-system.css for a LIGHT-FIRST design system.
Keep the CSS-custom-property architecture and keep tailwind.config.js mapping
tokens to semantic names, that part is already good.

Design direction: Linear's structural discipline (tight spacing scale, 1px
hairline borders, heavy restraint, almost no decoration) but with the warmth and
slightly larger type appropriate for a student learning product.

CRITICAL accessibility constraint: the current --accent is #A1FF62, which is
roughly 1.3:1 against white. It cannot be used for text, icons, borders, or as a
button background with white text. It must be demoted.

New colour roles:
  --accent            #5B3DF5   deep violet, primary actions, evolved from the
                                #694EFF already used in 20 places. Passes AA
                                with white text.
  --accent-hover      #4A2FD9
  --accent-subtle     #EEEBFF   tinted background for selected/active states
  --highlight         #A1FF62   lime, ONLY as a chip/badge background, always
                                paired with #201D1D text. Never as text itself.

Surface scale, light:
  --background        #FAFAFA   app canvas
  --surface           #FFFFFF   cards, panels
  --surface-sunken    #F4F4F5   wells, inputs, code blocks
  --surface-hover     #F4F4F5

Border scale:
  --border            #E4E4E7   default hairline
  --border-strong     #D4D4D8   emphasis, focus rings

Text scale, all verified against #FFFFFF:
  --text-primary      #18181B   ~16:1
  --text-secondary    #52525B   ~7.5:1
  --text-muted        #71717A   ~4.8:1, minimum for body text
  --text-disabled     #A1A1AA   decorative only, never body copy

Also fix these existing problems:
- --radius-md is currently 9999px (full pill) and is applied to inputs and cards,
  not just buttons. Introduce a proper radius scale: sm 6px, md 8px, lg 12px,
  xl 16px, full 9999px. Pills stay ONLY for primary CTA buttons and chips.
- Add a real spacing scale and a type scale rather than ad-hoc values.
- Keep the [data-theme='dark'] block present but unused, so dark can return later
  without re-architecting. Do not wire up a toggle.

Output the file plus a short markdown table mapping every OLD hex literal found in
the codebase to its NEW token. I need that table for the next step.
```

### 3.2 The migration

This is the big one. Do it page by page, not all at once.

```
Using the hex-to-token mapping table from the previous step, migrate ONE file at
a time from hardcoded hex values to semantic Tailwind token classes.

Order, least to most risky:
  1. src/components/ui/*
  2. src/components/common/*
  3. src/components/layout/*
  4. src/pages/Dashboard.jsx, Communities.jsx   (already partly token-based)
  5. src/pages/Feed.jsx, Videos.jsx, PostDetail.jsx, Profile.jsx,
     CommunityDetail.jsx                        (heavily hardcoded)
  6. src/pages/Login.jsx, Signup.jsx, AiRoadmap.jsx  (inline style objects)
  7. src/pages/AiTutor.jsx, AiCourse.jsx, RoadmapGenerator.jsx

For each file:
- Replace every bg-[#xxxxxx], text-[#xxxxxx], border-[#xxxxxx] with the semantic
  class
- Replace inline style={{ backgroundColor: '...' }} objects the same way
- Where a lime #A1FF62 was used as TEXT or an icon colour, it becomes
  text-accent (violet). Where it was a background behind dark text, it becomes
  bg-highlight. Judge each case, do not blanket-replace.
- Do not restructure layout or change component logic in this pass. Colour,
  radius, spacing tokens only.

After each file, run npm run build and show me a screenshot-level description of
what changed. Stop and ask if a replacement is ambiguous.

Do not proceed to the next file until I confirm.
```

### 3.3 Contrast bugs

```
There are white-on-light-background bugs where the theme migration was previously
half-done:

- src/pages/Dashboard.jsx line ~59 sets backgroundColor: 'var(--page-bg-light)'
  (#F4F4F4) while child text uses text-white. Invisible text.
- src/pages/AiRoadmap.jsx line ~577 has a text-black heading adjacent to
  text-white cards on a light background.
- text-[#444] and text-[#555] on light backgrounds appear throughout Videos.jsx,
  ProfilePosts.jsx and Feed.jsx at roughly 2.5:1, below the 4.5:1 WCAG AA floor.

Sweep the whole src/ tree for text colour on background colour combinations that
fall below 4.5:1 for body text or 3:1 for large text. Produce a list with file,
line, the pair, and the computed ratio. Fix them using the text scale tokens.
Report the list before fixing.
```

### 3.4 Component primitives

```
Build a small primitive set so pages stop hand-rolling UI. Put these in
src/components/ui/ and follow the token system strictly.

- Button: variants primary (violet, pill), secondary (surface + border),
  ghost, danger. Sizes sm/md/lg. Loading and disabled states. Note that
  src/components/common/Button.jsx is currently just a re-export of
  ui/Button.jsx, collapse that duplication.
  Also: ui/Button.jsx hardcodes #BDFF6B while tokens say #A1FF62, a different
  lime. That discrepancy disappears with the violet primary.
- Card: surface, border hairline, radius lg, optional header/footer slots
- Input, Textarea, Select: shared focus ring using --border-strong, error state,
  label and helper text
- Badge / Chip: this is where bg-highlight lime lives, always with dark text
- Skeleton: there is an existing unused Skeleton.jsx, revive or rewrite it
- EmptyState: icon, headline, body, optional action. Used wherever a list is empty
- Modal: see the accessibility prompt below, build it properly the first time

Refactor at least Feed.jsx and Communities.jsx to consume these primitives so I
can see the pattern before you touch the rest.
```

### 3.5 The SaaS shell

```
Make the app frame read as a product rather than a collection of pages.

- MainLayout: consistent max-width content container, consistent vertical rhythm,
  a single source of truth for page padding. Every page currently sets its own.
- Add a PageHeader component: title, optional description, optional right-aligned
  actions, optional breadcrumb. Apply it to Dashboard, Feed, Videos, Communities,
  Paths, Profile.
- Navbar: it is already the most accessible component in the codebase, keep the
  ARIA work. Restyle to the new tokens. Fix the count inconsistency, Navbar says
  "1700 Members" while MegaMenu says "2,400+ Builders". Pick one source.
- Loading: replace ad-hoc spinners with skeleton screens matching each page's
  actual layout. Route-level Suspense fallbacks should be skeletons, not spinners.
- Every list view needs a real EmptyState. Check Feed, Videos, Communities,
  Paths, and the profile tabs.
```

---

## Phase 4: Accessibility

### 4.1 Keyboard and semantics

```
Fix keyboard accessibility across the app.

Clickable divs with no keyboard access, add role="button", tabIndex={0} and an
onKeyDown handling Enter and Space, or better, change them to real <button>:
- src/pages/AiRoadmap.jsx line ~515, the role selection cards
- src/pages/AiRoadmap.jsx line ~581, the generated roadmap cards
- src/pages/RoadmapGenerator.jsx, the node cards

Other fixes:
- MegaMenu.jsx line ~485 uses a generic alt="User" on an avatar. Use the actual
  user name, or alt="" if the image is decorative next to a visible name.
- Sweep all <img> for missing or unhelpful alt text.
- Add a visible focus ring to every interactive element using --border-strong.
  Never remove outlines without a replacement.
```

### 4.2 Modals and feedback

```
Two things:

1. The create-community modal at src/pages/Communities.jsx line ~196 has no
   role="dialog", no aria-modal, no Escape handler and no focus management.
   Build a proper Modal primitive in src/components/ui/Modal.jsx with:
   role="dialog", aria-modal="true", aria-labelledby pointing at the title,
   focus trap, focus restore to the trigger on close, Escape to close, and a
   scroll lock on body. Then use it everywhere a modal exists.

2. Native alert() and confirm() are used for user feedback in 6+ places across
   PostDetail, RoadmapGenerator, CommunityDetail and VideoUploader. Replace with:
   - a toast system for success and error messages
   - a ConfirmDialog built on the new Modal for destructive actions
   Find every alert/confirm call and convert it.
```

### 4.3 Motion

```
frontend/src/styles/animations.css correctly respects prefers-reduced-motion, but
GSAP, Framer Motion and Lenis all animate in JavaScript and bypass that CSS block
entirely.

Create a useReducedMotion hook that reads the media query, and:
- gate Lenis smooth scroll initialisation on it
- pass reduced variants or skip GSAP timelines when it is set
- Framer Motion has built-in support, make sure MotionConfig is configured

Verify by enabling Reduce Motion in macOS System Settings and confirming the app
is still fully usable with no scroll hijacking.
```

---

## Phase 5: Final verification

```
Full audit pass. Report, do not fix, so I can triage:

1. npm run build, report bundle sizes per chunk and flag anything over 200kB
2. npm run lint, report remaining warnings
3. grep src/ for any remaining raw hex literal in JSX, there should be zero
4. List every route in App.jsx and confirm each has a reachable link somewhere
5. List every file over 400 lines as refactor candidates
6. Confirm no console.log survives in the production build output
7. Check that .env is gitignored, it currently contains
   VITE_API_URL=http://localhost:5051 and appears to be tracked
8. index.html loads a third-party script from cdn.unicorn.studio with no SRI
   hash. Since the JWT lives in localStorage, a CDN compromise means session
   theft. Add integrity and crossorigin attributes, or self-host the script,
   or document the accepted risk.
```

---

## Notes worth knowing

**On the token migration.** 800+ hex literals is a lot. Doing it file by file with a confirmation gate is slower but it is the only way to catch the cases where lime was used as text (becomes violet) versus as a background (becomes a chip). A blanket find-and-replace will produce a broken-looking app.

**On localStorage and JWT.** Phase 5 item 8 is the real security issue. Storing the token in localStorage is XSS-exposed by design, and you load an unpinned third-party script. Moving to httpOnly cookies is a backend change, out of scope here, but worth planning.

**On the 15-second polling** in CommunityDetail. It works and the cleanup is correct. Leave it until the rest is stable, then move to SSE.

**What was already good** and should not be touched: route-level code splitting, the optimistic-update-with-rollback pattern in the stores, upload progress tracking with the 5-minute timeout, the SEO and PWA setup in index.html, and the deferred service worker registration.
