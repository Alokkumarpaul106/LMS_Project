import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMyProfile } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // app load hole dekho already login kora ache kina (token thakle)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      // UserViewSet get_queryset shudhu nijer record e filter kore,
      // tai list response e nijer ekta record e ashbe array hisebe
      const profile = Array.isArray(res.data) ? res.data[0] : res.data;
      setUser(profile || null);
    } catch (err) {
      // token invalid/expired hole logout kore dao
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await loginUser(username, password);
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eituku custom hook jeta age alada hooks/useAuth.js e chilo,
// ekhon ekhaneই rakha holo (structure simplify korar jonno)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
