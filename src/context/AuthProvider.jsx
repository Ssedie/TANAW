import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config/constants";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setAuth(JSON.parse(saved));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  // CLEAN LOGIN — throws on error
  const login = async ({ userId, password }) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, password }),
    });

    if (!response.ok) {
      const text = await response.text();
      const error = new Error(text || "Login failed");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();

    const newAuth = {
      token: data.token,
      userId: data.userId,
      role: data.role,
      fName: data.fName,
      lName: data.lName,
      profileImage: data.picturePath
        ? `${API_URL}/${data.picturePath}?t=${Date.now()}`
        : `${data.fName?.[0] || "R"}${data.lName?.[0] || "J"}`,
    };

    setAuth(newAuth);
    return newAuth;
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
