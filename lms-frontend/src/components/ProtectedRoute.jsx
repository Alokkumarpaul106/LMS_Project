import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

/**
 * allowedRoles na dile — sudhu login thakleই jothesto
 * allowedRoles dile — login + role match dutoi lagbe
 *
 * usage:
 * <ProtectedRoute><Dashboard /></ProtectedRoute>
 * <ProtectedRoute allowedRoles={['admin']}><UserManage /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
