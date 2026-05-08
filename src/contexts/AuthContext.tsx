'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setAccessToken, type User } from '@/lib/api';

type AuthState = {
  user: User | null;
  isHydrated: boolean;
};


type AuthContextValue = AuthState & {
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};


const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);


  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);


  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setIsHydrated(true);
      }
    }, 10000); // 10s timeout: if getMe never resolves (e.g. backend down / CORS), show login form

    api
      .getMe()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => {
        if (!cancelled) {
          clearTimeout(timeout);
          setIsHydrated(true);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const value: AuthContextValue = {
    user,
    isHydrated,
    logout,
    setUser,


  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
