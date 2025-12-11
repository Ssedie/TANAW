import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/constants"; // make sure this points to your backend

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const fName = localStorage.getItem("fName") || "";
    const lName = localStorage.getItem("lName") || "";
    const profileImage = localStorage.getItem("profileImage") || null;

    if (token && role && userId) {
      setAuth({ token, role, userId, fName, lName, profileImage });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  /**
   * Login function
   * @param token - JWT token
   * @param role - User role
   * @param userId - User ID
   * @param fName - First name
   * @param lName - Last name
   * @param picturePath - Backend picture path (e.g., "users/abc.png")
   */
  function login({ token, role, userId, fName, lName, picturePath }) {
    // Construct full profile image URL if picturePath exists
    const profileImage = picturePath
      ? `${API_URL}/uploads/${picturePath}?t=${Date.now()}`
      : null;

    // Update auth state
    setAuth({ token, role, userId, fName, lName, profileImage });

    // Persist to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("fName", fName);
    localStorage.setItem("lName", lName);
    if (profileImage) localStorage.setItem("profileImage", profileImage);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fName");
    localStorage.removeItem("lName");
    localStorage.removeItem("profileImage");
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
