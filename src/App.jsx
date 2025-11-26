import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Officials from "./pages/Officials";
import Settings from "./pages/Settings";
import Budget from "./pages/Budget";
import Projects from "./pages/Projects";
import Documents from "./pages/Documents";
import Login from "./pages/Login";

const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar
                isOpen={sidebarToggle}
                onClose={() => setSidebarToggle(false)}
              />
              <div className="flex-1 flex flex-col">
                <Header
                  onSidebarToggle={toggleSidebar}
                  isSidebarOpen={sidebarToggle}
                />
                <main className="flex-1 bg-slate-200">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/officials" element={<Officials />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/budget" element={<Budget />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/projects" element={<Projects />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
