import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Budget from "./pages/Budget";
import Projects from "./pages/Projects";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Unauthorized from "./pages/Unauthorized";


const App = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const location = useLocation();

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }

  const pageTransition = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
              <Landing />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <Signup />
            </motion.div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <ForgotPassword />
            </motion.div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <ResetPassword />
            </motion.div>
          }
        />
        <Route
          path="/privacy"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <PrivacyPolicy />
              <Footer />
            </motion.div>
          }
        />
        <Route
          path="/terms"
          element={
            <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <TermsOfService />
              <Footer />
            </motion.div>
          }
        />
        <Route
  path="/unauthorized"
  element={
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <Unauthorized />
    </motion.div>
  }
/>


        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
            </ProtectedRoute>
          }
        >
          <Route
            path="/home"
            element={
              <>
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <Settings />
                <Footer />
              </>
            }
          />
          <Route
            path="/budget"
            element={
              <>
                <Budget />
                <Footer />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <Projects />
                <Footer />
              </>
            }
          />
          <Route
            path="/documents"
            element={
              <>
                <Documents />
                <Footer />
              </>
            }
          />
<Route
  path="/adminDashboard"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <>
        <AdminDashboard />
        <Footer />
      </>
    </ProtectedRoute>
  }
/>

          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;