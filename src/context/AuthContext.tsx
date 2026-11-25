
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
import { api, userApi } from "@/services/api";

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
    let restoredUser: User | null = null;

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        if (!parsedUser?.id) {
          throw new Error("Stored user data is invalid.");
        }
        restoredUser = parsedUser;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    // Restore browser-only state after the client hydrates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(restoredUser);
    setReady(true);
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

      if (!response.accessToken) {
        throw new Error("Login response is missing an access token.");
      }

      const users = await userApi.getAllUsers();
      const user = users.find(
        (candidate) =>
          candidate.email.toLowerCase() === data.email.trim().toLowerCase()
      );

      if (!user) {
        throw new Error("Could not load the signed-in user profile.");
      }

      signIn(user, response.accessToken);

      return { token: response.accessToken, user };
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
