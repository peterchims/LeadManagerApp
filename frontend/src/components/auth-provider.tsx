"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/token";
import type { LoginInput, RegisterInput, User } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    async function hydrate() {
      const token = getToken();
      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const { user } = await authApi.me();
        setUser(user);
        setStatus("authenticated");
      } catch {
        clearToken();
        setStatus("unauthenticated");
      }
    }

    void hydrate();
  }, []);

  async function login(input: LoginInput) {
    const { user, token } = await authApi.login(input);
    setToken(token);
    setUser(user);
    setStatus("authenticated");
  }

  async function register(input: RegisterInput) {
    const { user, token } = await authApi.register(input);
    setToken(token);
    setUser(user);
    setStatus("authenticated");
  }

  function logout() {
    clearToken();
    setUser(null);
    setStatus("unauthenticated");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
