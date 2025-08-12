import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;
  
    const userData = JSON.parse(savedUser);
    // Map your UserResponse to AuthUser format
    const authUser: AuthUser = {
      id: userData.bctUserId?.toString(),
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.emailId,
      role: userData.userType === 1 ? "admin" : "user", // Adjust mapping as needed
    };

    return authUser;
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
