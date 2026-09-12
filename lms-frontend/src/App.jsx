import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/student/Dashboard";
import CourseList from "./pages/student/CourseList";
import CourseDetail from "./pages/student/CourseDetail";
import LessonView from "./pages/student/LessonView";
import CourseCreate from "./pages/instructor/CourseCreate";
import CourseEdit from "./pages/instructor/CourseEdit";
import LessonCreate from "./pages/instructor/LessonCreate";
import MyCourses from "./pages/instructor/MyCourses";
import UserManage from "./pages/admin/UserManage";
import CategoryManage from "./pages/admin/CategoryManage";
import ProtectedRoute from "./components/ProtectedRoute";
import VideoList from "./pages/student/VideoList";
import InstructorProfile from "./pages/instructor/InstructorProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <VideoList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/create"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <CourseCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <CourseEdit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id/lessons/create"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <LessonCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lessons/:id"
        element={
          <ProtectedRoute>
            <LessonView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CategoryManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructors"
        element={
          <ProtectedRoute>
            <InstructorProfile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
