import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useAuth();

  // Show loading spinner or blank screen while checking auth
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  // If user not authenticated, redirect to login
  if (!auth) return <Navigate to="/login" replace />;

  // User is authenticated, render children
  return children;
}


