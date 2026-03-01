'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('wireup_user');
    const storedToken = localStorage.getItem('wireup_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setHydrated(true);
  }, []);

  const login = (payload) => {
    localStorage.setItem('wireup_user', JSON.stringify(payload.user));
    localStorage.setItem('wireup_token', payload.token);
    setUser(payload.user);
    setToken(payload.token);
  };

  const logout = () => {
    localStorage.removeItem('wireup_user');
    localStorage.removeItem('wireup_token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, hydrated, isAuthenticated: Boolean(token), login, logout }),
    [user, token, hydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
