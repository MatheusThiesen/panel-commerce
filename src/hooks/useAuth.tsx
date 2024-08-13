"use client";

import { Me } from "@/@types/me";
import { BASE_URL } from "@/services/api";
import { api } from "@/services/apiClient";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import nookies, { parseCookies, setCookie } from "nookies";
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
export async function refreshToken(
  ctx: GetServerSidePropsContext | undefined = undefined
): Promise<string | undefined> {
  const { "auth.session-refresh": tokenRefresh } = parseCookies(ctx);

  try {
    const refreshTokenResponse = await axios.post<{
      refresh_token: string;
      access_token: string;
    }>(`${BASE_URL}auth/refresh`, {
      token: tokenRefresh,
    });

    setCookie(
      ctx,
      "auth.session-token",
      refreshTokenResponse.data.access_token,
      {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      }
    );
    setCookie(
      ctx,
      "auth.session-refresh",
      refreshTokenResponse.data.refresh_token,
      {
        maxAge: 60 * 60 * 24 * 30, //30 Days
        path: "/",
      }
    );

    return refreshTokenResponse.data.access_token;
  } catch (error) {
    console.log(error);
    signOut();
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { "auth.session-token": token } = parseCookies();

  const [user, setUser] = useState<Me>({} as Me);
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
  }, [token]);

  return (
    <AuthContext.Provider value={{ signOut, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
