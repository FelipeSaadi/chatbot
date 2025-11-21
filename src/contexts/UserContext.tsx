"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect,  } from "react";

type UserRole = "analyst" | "user" | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      if (newRole) {
        localStorage.setItem("userRole", newRole);
      } else {
        localStorage.removeItem("userRole");
      }
    }
  };

  const logout = () => {
    handleSetRole(null);
    if (typeof window !== 'undefined') {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem("userRole") as UserRole;
      if (savedRole) {
        setRole(savedRole);
      }
    }
  }, []);

  // ✅ Atualiza o localStorage sempre que o papel mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem("userRole", role);
      } else {
        localStorage.removeItem("userRole");
      }
    }
  }, [role]);

  return (
    <UserContext.Provider value={{ role, setRole: handleSetRole, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
