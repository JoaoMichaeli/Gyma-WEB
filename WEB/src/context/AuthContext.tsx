"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  email: string | null;
  senha: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  email: null,
  senha: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [senha, setSenha] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedSenha = localStorage.getItem("senha");

    if (storedEmail && storedSenha) {
      setEmail(storedEmail);
      setSenha(storedSenha);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    localStorage.setItem("email", email);
    localStorage.setItem("senha", senha);
    setEmail(email);
    setSenha(senha);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("senha");
    setEmail(null);
    setSenha(null);
  };

  const isAuthenticated = !!email && !!senha;

  return (
    <AuthContext.Provider value={{ email, senha, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
