
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { User } from "@/types/user";
import { api } from "@/services/api";

interface AuthContextType {
  user: User | null;
  ready: boolean;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ email: string }>;
  signin: (data: {
    email: string;
    password: string;
  }) => Promise<{ token: string; user: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restore logged-in user from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  // Save user and JWT token
  const signIn = useCallback((user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  }, []);

  // Register user through backend
  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      return api.register(data);
    },
    []
  );

  // Login user through backend
  const signin = useCallback(
    async (data: { email: string; password: string }) => {
      const response = await api.login(data);

      signIn(response.user, response.token);

      return response;
    },
    [signIn]
  );

  // Logout user
  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn,
      signOut,
      signup,
      signin,
    }),
    [user, ready, signIn, signOut, signup, signin]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
