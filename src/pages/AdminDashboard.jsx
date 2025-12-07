import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import AdminDashboardContent from "../components/AdminDashboardContent";

function AdminDashboard() {
  const { auth, loading } = useAuth();

  // 1️⃣ Show nothing (or a spinner) while auth is loading from localStorage
  if (loading) return <div>Loading...</div>;

  // 2️⃣ Redirect to login if no token
  if (!auth?.token) return <Navigate to="/login" />;

  // 3️⃣ Only allow ADMIN or SUPER_ADMIN
  if (auth.role !== "ADMIN") {
    return <Navigate to="/unauthorized" />;
  }

  // 4️⃣ For debugging, check what auth state actually contains
  console.log("Auth state in AdminDashboard:", auth);

  return <AdminDashboardContent />;
}

export default AdminDashboard;
