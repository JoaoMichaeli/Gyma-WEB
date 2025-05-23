"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Plano, Exercise } from "@/type";
import { useAuth } from "@/context/AuthContext";

interface ExerciseForm {
  id?: number;
  name: string;
  muscleGroup: string;
  repetitions: number;
  series: number;
  restSec: number;
}

export default function EditPlanoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { email, senha } = useAuth();

  const planoId = pathname?.split("/").pop();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("");
  const [exercises, setExercises] = useState<ExerciseForm[]>([]);

  useEffect(() => {
    if (!email || !senha || !planoId) return;

    async function fetchPlano() {
      setLoading(true);
      setError(null);

      try {
        const authHeader = "Basic " + btoa(`${email}:${senha}`);

        const res = await fetch(`http://localhost:8080/plans/${planoId}`, {
          headers: { Authorization: authHeader },
        });

        if (!res.ok) throw new Error("Erro ao carregar plano");

        const plano: Plano = await res.json();

        setName(plano.name);
        setPlanType(plano.type || "");
        setExercises(
          plano.exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            muscleGroup: ex.muscleGroup,
            repetitions: ex.repetitions,
            series: ex.series,
            restSec: ex.restSec,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }

    fetchPlano();
  }, [email, senha, planoId]);

  function handleExerciseChange(
    index: number,
    field: keyof ExerciseForm,
    value: string | number
  ) {
    const updated = [...exercises];
    updated[index] = {
      ...updated[index],
      [field]:
        typeof value === "string" &&
        (field === "repetitions" || field === "series" || field === "restSec")
          ? Number(value)
          : value,
    };
    setExercises(updated);
  }

  function addExercise() {
    setExercises([
      ...exercises,
      { name: "", muscleGroup: "", repetitions: 0, series: 0, restSec: 0 },
    ]);
  }

  function removeExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !planType.trim()) {
      setError("Nome do plano e tipo do plano são obrigatórios.");
      return;
    }

    for (const ex of exercises) {
      if (
        !ex.name.trim() ||
        !ex.muscleGroup.trim() ||
        ex.repetitions <= 0 ||
        ex.series <= 0 ||
        ex.restSec < 0
      ) {
        setError("Preencha todos os campos dos exercícios corretamente.");
        return;
      }
    }

    if (!email || !senha || !planoId) {
      setError("Usuário não autenticado ou plano inválido.");
      return;
    }

    setSaving(true);

    try {
      const authHeader = "Basic " + btoa(`${email}:${senha}`);

      const body = {
        name,
        type: planType,
        exercises: exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          repetitions: ex.repetitions,
          series: ex.series,
          restSec: ex.restSec,
        })),
      };

      const res = await fetch(`http://localhost:8080/plans/${planoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao atualizar plano");
      }

      router.push("/plans");
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      setSaving(false);
    }
  }

  if (!email || !senha) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <p className="text-white text-center">Faça login para editar um plano.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <p className="text-white text-center">Carregando plano...</p>
      </main>
    );
  }

  return (
    <>
      <Navbar active="Planos" />
      <main className="min-h-screen bg-slate-900 p-6 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-6 rounded w-full max-w-3xl flex flex-col gap-6"
        >
          <h2 className="text-2xl font-bold text-white">Editar Plano</h2>

          {error && <p className="text-red-500">{error}</p>}

          <label className="flex flex-col text-white">
            Nome do Plano
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 rounded text-black"
              required
            />
          </label>

          <label className="flex flex-col text-white">
            Tipo do Plano
            <input
              type="text"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="mt-1 p-2 rounded text-black"
              placeholder="Ex: Hipertrofia"
              required
            />
          </label>

          <fieldset className="text-white border border-gray-600 rounded p-4">
            <legend className="px-2">Exercícios</legend>

            {exercises.map((ex, idx) => (
              <div key={idx} className="mb-4 border-b border-gray-500 pb-4 relative">
                <button
                  type="button"
                  onClick={() => removeExercise(idx)}
                  className="absolute top-0 right-0 text-red-500 font-bold hover:text-red-700"
                  title="Remover exercício"
                >
                  &times;
                </button>

                <label className="flex flex-col mb-1">
                  Nome
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(idx, "name", e.target.value)}
                    className="mt-1 p-1 rounded text-black"
                    required
                  />
                </label>

                <label className="flex flex-col mb-1">
                  Grupo Muscular
                  <input
                    type="text"
                    value={ex.muscleGroup}
                    onChange={(e) => handleExerciseChange(idx, "muscleGroup", e.target.value)}
                    className="mt-1 p-1 rounded text-black"
                    placeholder="Ex: Peito, Tríceps"
                    required
                  />
                </label>

                <label className="flex flex-col mb-1">
                  Repetições
                  <input
                    type="number"
                    min={1}
                    value={ex.repetitions}
                    onChange={(e) =>
                      handleExerciseChange(idx, "repetitions", Number(e.target.value))
                    }
                    className="mt-1 p-1 rounded text-black"
                    required
                  />
                </label>

                <label className="flex flex-col mb-1">
                  Séries
                  <input
                    type="number"
                    min={1}
                    value={ex.series}
                    onChange={(e) =>
                      handleExerciseChange(idx, "series", Number(e.target.value))
                    }
                    className="mt-1 p-1 rounded text-black"
                    required
                  />
                </label>

                <label className="flex flex-col mb-1">
                  Descanso (segundos)
                  <input
                    type="number"
                    min={0}
                    value={ex.restSec}
                    onChange={(e) =>
                      handleExerciseChange(idx, "restSec", Number(e.target.value))
                    }
                    className="mt-1 p-1 rounded text-black"
                    required
                  />
                </label>
              </div>
            ))}

            <Button
              type="button"
              onClick={addExercise}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + Adicionar Exercício
            </Button>
          </fieldset>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/plans")}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
