"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
    await login(email, password);
    toast.success("Login realizado com sucesso!");
    router.push("/plans");
    } catch (err) {
    toast.error("Email ou senha inválidos");
    }
  }

  return (
    <>
      <Navbar active="Login" />

      <main className="flex items-center justify-center h-screen bg-slate-950">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 rounded p-5 w-full max-w-md shadow-md"
        >
          <h2 className="text-white text-2xl font-bold text-center mb-4">
            Entrar no Gyma
          </h2>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 rounded bg-slate-800 text-white focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-800 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700">
            Entrar
          </Button>
        </form>
      </main>
    </>
  );
}
