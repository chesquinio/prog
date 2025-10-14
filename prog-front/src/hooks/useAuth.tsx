"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import axios from "../lib/axios";

type User = { id: number; name: string; email: string; role: string };

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();

    const onLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("app:logout", onLogout as EventListener);
    return () =>
      window.removeEventListener("app:logout", onLogout as EventListener);
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    try {
      await axios.post("/auth/login", { email, password });
      // backend sets cookie; fetch profile
      const me = await axios.get("/auth/me");
      setUser(me.data);
      return me.data;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      // ignore
    }
    setUser(null);
    // notify other tabs
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:logout"));
    }
  };

  const isAuthenticated = !!user;

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    if (!roles) return true;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        loading,
        isAuthenticated,
        hasRole,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
