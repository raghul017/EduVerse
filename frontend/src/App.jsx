import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Feed from "./pages/Feed.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Upload from "./pages/Upload.jsx";
import Communities from "./pages/Communities.jsx";
import CommunityDetail from "./pages/CommunityDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import MyVideos from "./pages/MyVideos.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AiCourse from "./pages/AiCourse.jsx";
import AiTutor from "./pages/AiTutor.jsx";
import AiRoadmap from "./pages/AiRoadmap.jsx";
import RoadmapGenerator from "./pages/RoadmapGenerator.jsx";
import GuideGenerator from "./pages/GuideGenerator.jsx";
import CourseGenerator from "./pages/CourseGenerator.jsx";
import Videos from "./pages/Videos.jsx";

function App() {
  return (
        <Routes>
      <Route
        element={<MainLayout />}
      >
        <Route path="/" element={<Home />} />
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-course"
            element={
              <ProtectedRoute>
                <AiCourse />
              </ProtectedRoute>
            }
          />
        <Route
          path="/ai-tutor"
          element={
            <ProtectedRoute>
              <AiTutor />
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
        <Route
          path="/roadmap-generator"
          element={
            <ProtectedRoute>
              <RoadmapGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide-generator"
          element={
            <ProtectedRoute>
              <GuideGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-generator"
          element={
            <ProtectedRoute>
              <CourseGenerator />
            </ProtectedRoute>
          }
        />
          <Route
            path="/my-videos"
            element={
              <ProtectedRoute>
                <MyVideos />
              </ProtectedRoute>
            }
          />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
        </Routes>
  );
}

export default App;

