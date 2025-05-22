"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function PlanFormPage() {
  const { email, senha, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <p className="text-white text-center">Faça login para cadastrar planos.</p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const auth = "Basic " + btoa(`${email}:${senha}`);

      const res = await fetch("http://localhost:8080/plans", {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao criar plano");
      }

      router.push("/plans");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar active="Planos" />
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-6 rounded max-w-md w-full"
        >
          <h2 className="text-white text-2xl mb-4">Novo Plano</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <label className="block mb-2 text-white font-semibold">
            Nome do Plano
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-slate-700 text-white"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </main>
    </>
  );
}
