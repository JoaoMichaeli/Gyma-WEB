"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ExerciseForm {
  name: string;
  muscleGroup: string;
  repetitions: number;
  series: number;
  restSec: number;
}

export default function NovoPlanoPage() {
  const { email, senha } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("");
  const [exercises, setExercises] = useState<ExerciseForm[]>([
    { name: "", muscleGroup: "", repetitions: 0, series: 0, restSec: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function createExercise(exercise: ExerciseForm): Promise<{ id: number }> {
    const authHeader = "Basic " + btoa(`${email}:${senha}`);

    const res = await fetch("http://localhost:8080/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup.trim(),
        repetitions: exercise.repetitions,
        series: exercise.series,
        restSec: exercise.restSec,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Erro ao cadastrar exercício");
    }

    return res.json();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

    setLoading(true);
    setError(null);

    try {
      const exerciseIds = [];
      for (const ex of exercises) {
        const exData = await createExercise(ex);
        exerciseIds.push({ id: exData.id });
      }

      const authHeader = "Basic " + btoa(`${email}:${senha}`);

      const resPlan = await fetch("http://localhost:8080/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          name,
          type: planType,
          exercises: exerciseIds,
        }),
      });

      if (!resPlan.ok) {
        throw new Error("Erro ao cadastrar plano");
      }

      router.push("/plans");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro inesperado");
      setLoading(false);
    }
  }

  if (!email || !senha) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-6">
        <p className="text-white text-center">Faça login para cadastrar um plano.</p>
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
          <h2 className="text-2xl font-bold text-white">Novo Plano</h2>

          {error && <p className="text-red-500">{error}</p>}

          <label className="flex flex-col text-white">
            Nome do Plano
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </label>

          <label className="flex flex-col text-white">
            Tipo do Plano
            <input
              type="text"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="mt-1 p-2 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="mt-1 p-1 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </label>

                <label className="flex flex-col mb-1">
                  Grupo Muscular
                  <input
                    type="text"
                    value={ex.muscleGroup}
                    onChange={(e) => handleExerciseChange(idx, "muscleGroup", e.target.value)}
                    className="mt-1 p-1 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="mt-1 p-1 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="mt-1 p-1 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="mt-1 p-1 rounded text-white border border-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </label>
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <Button
                type="button"
                onClick={addExercise}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Adicionar Exercício
              </Button>
            </div>
          </fieldset>

          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Salvando..." : "Salvar Plano"}
          </Button>
        </form>
      </main>
    </>
  );
}
