"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types/user";

interface AuthValue { user: User | null; ready: boolean; signIn: (u: User, token: string) => void; signOut: () => void; }
const AuthContext = createContext<AuthValue | null>(null);

// Demo user so the UI renders before a backend exists.
const demo: User = { id: "me", name: "Vivien Hale", avatar: "", online: true };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem("user"); setUser(raw ? JSON.parse(raw) : demo); } catch { setUser(demo); }
    setReady(true);
  }, []);
  const signIn = useCallback((u: User, token: string) => { localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(u)); setUser(u); }, []);
  const signOut = useCallback(() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); }, []);
  const value = useMemo(() => ({ user, ready, signIn, signOut }), [user, ready, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error("useAuth outside AuthProvider"); return c; };
