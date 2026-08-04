import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layout/MainLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Loader from "./components/common/Loader.jsx";

// Lazy load pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Feed = lazy(() => import("./pages/Feed.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Upload = lazy(() => import("./pages/Upload.jsx"));
const Communities = lazy(() => import("./pages/Communities.jsx"));
const CommunityDetail = lazy(() => import("./pages/CommunityDetail.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const PostDetail = lazy(() => import("./pages/PostDetail.jsx"));

const AiCourse = lazy(() => import("./pages/AiCourse.jsx"));
const AiTutor = lazy(() => import("./pages/AiTutor.jsx"));
// const AiTutor = lazy(() => import("./pages/AiTutorNew.jsx")); // Using rebuilt version
const AiRoadmap = lazy(() => import("./pages/AiRoadmap.jsx"));
const RoadmapGenerator = lazy(() => import("./pages/RoadmapGenerator.jsx"));
const Videos = lazy(() => import("./pages/Videos.jsx"));
const Paths = lazy(() => import("./pages/Paths.jsx"));


import { ThemeProvider } from "./context/ThemeContext";
import ColdStartBanner from "./components/common/ColdStartBanner.jsx";

function App() {
  return (
    <ThemeProvider>
      <ColdStartBanner />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/ai-tutor"
            element={
              <ProtectedRoute>
                <AiTutor />
              </ProtectedRoute>
            }
          />
          {/* Roadmap Generator - Full screen without navbar */}
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapGenerator />
              </ProtectedRoute>
            }
          />
          
          {/* AI Course - Full screen without navbar */}
          <Route
            path="/ai-course"
            element={
              <ProtectedRoute>
                <AiCourse />
              </ProtectedRoute>
            }
          />
          {/* Landing page. OUTSIDE MainLayout: it carries its own nav (and,
              from batch C, its own footer). Inside MainLayout the app Navbar
              would stack above LandingNav and the container padding would
              break the full-bleed hero. */}
          <Route path="/" element={<Home />} />

          <Route element={<MainLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

          


          <Route
            path="/ai-roadmap"
              element={
                <ProtectedRoute>
                  <AiRoadmap />
                </ProtectedRoute>
              }
            />


            {/* Redirect /my-videos to dashboard */}
            <Route path="/my-videos" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/paths"
              element={
                <ProtectedRoute>
                  <Paths />
                </ProtectedRoute>
              }
            />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <Communities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:id"
              element={
                <ProtectedRoute>
                  <CommunityDetail />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all, declared LAST. React Router v6 ranks by specificity
              rather than source order, so this worked mid-list by luck, but
              declaring it last is what the ordering actually communicates.
              Outside MainLayout so an unmatched URL redirects to the landing
              page without briefly mounting the app chrome. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
