import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // loading state for initial check

  // Check localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const fName = localStorage.getItem("fName") || "";
    const lName = localStorage.getItem("lName") || "";
    if (token && role && userId) {
      setAuth({ token, role, userId, fName, lName });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false); // done checking
  }, []);

  function login({ token, role, userId, fName, lName }) {
    setAuth({ token, role, userId, fName, lName });

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("fName", fName);
    localStorage.setItem("lName", lName);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fName");
    localStorage.removeItem("lName");
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}
