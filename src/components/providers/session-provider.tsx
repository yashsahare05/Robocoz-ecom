"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

type AdminAuthContextValue = {
  isAdmin: boolean;
  adminEmail: string | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const ADMIN_SESSION_KEY = "robocoz_admin_session_v1";

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const getAdminConfig = () => {
  const email =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() ??
    "admin@robocoz.com";
  const password =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";
  return { email, password };
};

const readStoredSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string } | null;
    if (!parsed?.email) return null;
    return parsed.email;
  } catch {
    return null;
  }
};

export const AuthSessionProvider = ({ children }: Props) => {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedEmail = readStoredSession();
    if (storedEmail) {
      setAdminEmail(storedEmail);
    }
    setReady(true);
  }, []);

  const login = (email: string, password: string) => {
    const { email: allowedEmail, password: allowedPassword } = getAdminConfig();
    if (!email || !password) {
      return { ok: false, error: "Enter email and password." };
    }
    if (email.toLowerCase() !== allowedEmail || password !== allowedPassword) {
      return { ok: false, error: "Invalid admin credentials." };
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ email }),
      );
    }
    setAdminEmail(email);
    return { ok: true };
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
    }
    setAdminEmail(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin: Boolean(adminEmail),
        adminEmail,
        ready,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AuthSessionProvider");
  }
  return context;
};

