import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config/constants";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      setAuth(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Persist auth to localStorage whenever it changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // LOGIN
  const login = async ({ userId, password }) => {
    if (!userId || !password) {
      return {
        error: {
          user_id: "User ID is required",
          password: "Password is required",
        },
      };
    }

    const payload = { user_id: userId, password };

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsed;
        try {
          parsed = JSON.parse(errorText);
        } catch {
          parsed = { message: errorText };
        }
        return { error: parsed };
      }

      const data = await response.json();

      const fName = data.fName || "";
      const lName = data.lName || "";
      const profileImage = data.picturePath
        ? `${API_URL}/${data.picturePath}?t=${Date.now()}`
        : `${fName[0] || "R"}${lName[0] || "J"}`; // default initials

      const newAuth = {
        token: data.token,
        userId: data.userId,
        role: data.role,
        fName: data.fName,
        lName: data.lName,
        profileImage,
      };

      setAuth(newAuth);
      return { data: newAuth };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  // LOGOUT
  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
