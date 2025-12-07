import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/Home";

import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Officials from "./pages/Officials";
import Settings from "./pages/Settings";
import Budget from "./pages/Budget";
import Projects from "./pages/Projects";
import Documents from "./pages/Documents";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes */}

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout
              sidebarToggle={sidebarToggle}
              toggleSidebar={toggleSidebar}
            />
          </ProtectedRoute>
        }
      >
        
        <Route path="/home" element={<Home />} /> {/* Default Home page */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/officials" element={<Officials />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default App;
