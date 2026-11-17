import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api from "../lib/api";
import {
  AdminStatusContext,
  AuthContext,
  type AuthContextValue,
  type AuthUser,
} from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Always start unauthenticated on first render so SSR/hydration matches and
  // admin UI never flashes before the session is verified.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.get<AuthUser>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
    setUser(null);
  }, []);

  const isAdmin = Boolean(user?.admin);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAdmin,
      refreshUser,
      logout,
    }),
    [user, isLoading, isAdmin, refreshUser, logout]
  );

  return (
    <AdminStatusContext.Provider value={isAdmin}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </AdminStatusContext.Provider>
  );
};
