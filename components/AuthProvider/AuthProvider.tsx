"use client";

import { useEffect, type ReactNode } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    let isCancelled = false;

    const verifySession = async (): Promise<void> => {
      try {
        const session = await checkSession();

        if (!session.success) {
          if (!isCancelled) {
            clearIsAuthenticated();
          }
          return;
        }

        const user = await getMe();
        if (!isCancelled) {
          setUser(user);
        }
      } catch {
        if (!isCancelled) {
          clearIsAuthenticated();
        }
      }
    };

    void verifySession();

    return () => {
      isCancelled = true;
    };
  }, [clearIsAuthenticated, setUser]);

  return children;
}

export default AuthProvider;
