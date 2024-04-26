"use client";

import { Me } from "@/@types/me";
import { api } from "@/services/apiClient";
import nookies, { parseCookies } from "nookies";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextData = {
  signOut: () => void;
  user?: Me;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  nookies.set({}, "auth.session-token", "", {
    maxAge: -1,
    path: "/",
  });
  nookies.set({}, "auth.session-refresh", "", {
    maxAge: -1,
    path: "/",
  });

  window.location.reload();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { "auth.session-token": token } = parseCookies();

  const [user, setUser] = useState<Me>();
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    if (token) {
      api
        .get<Me>("/auth/me")
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signOut, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
