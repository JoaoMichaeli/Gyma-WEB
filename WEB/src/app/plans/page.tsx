"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import PlanoItem from "@/components/plano-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Plano } from "@/type";
import { getPlanos, deletePlano } from "@/app/actions/plano-actions";

export default function PlanosPage() {
  const { email, senha } = useAuth();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || !senha) {
      setPlanos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getPlanos(email, senha)
      .then(setPlanos)
      .catch((err) => {
        console.error("Erro ao buscar planos:", err);
        setPlanos([]);
      })
      .finally(() => setLoading(false));
  }, [email, senha]);

  const handleDelete = async (id: number) => {
    if (!email || !senha) return;

    try {
      await deletePlano(id, email, senha);
      setPlanos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      // Aqui você pode exibir toast ou mensagem de erro
    }
  };

  if (!email || !senha) {
    return (
      <>
        <Navbar active="Planos" />
        <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
          <p className="text-white text-center">Faça login para ver seus planos.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar active="Planos" />
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <div className="bg-slate-800 rounded w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Meus Planos</h2>
            <Button asChild>
              <Link href="/plans/novo" className="flex items-center gap-2">
                <Plus size={16} />
                Novo Plano
              </Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-white text-center">Carregando...</p>
          ) : planos.length === 0 ? (
            <p className="text-white text-center">Nenhum plano cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {planos.map((plano) => (
                <PlanoItem key={plano.id} plano={plano} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
