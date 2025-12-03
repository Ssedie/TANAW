import {useAuth} from "../context/AuthProvider";
import {Navigate} from "react-router-dom";
import AdminDashboardContent from "../components/AdminDashboardContent"

function AdminDashboard() {

  const { auth } = useAuth();

  if (!auth?.token) return <Navigate to="/login" />;
  if (auth.role !== "ADMIN") return <Navigate to="/unauthorized" />;

  return <AdminDashboardContent />;

  
}

export default AdminDashboard