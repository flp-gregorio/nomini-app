import { createContext, useContext } from "react";

export interface AuthUser {
  username: string;
  email: string;
  admin: boolean;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
export const AdminStatusContext = createContext<boolean>(false);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export const useIsAdmin = (): boolean => {
  return useContext(AdminStatusContext);
};
