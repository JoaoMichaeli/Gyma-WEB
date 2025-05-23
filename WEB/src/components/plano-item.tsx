"use client";

import { useState } from "react";
import { Trash, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Plano } from "@/type";

interface PlanoItemProps {
  plano: Plano;
  onDelete: (id: number) => void;
}

export default function PlanoItem({ plano, onDelete }: PlanoItemProps) {
  const [showExercises, setShowExercises] = useState(false);
  const router = useRouter();

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    router.push(`/plans/edit/${plano.id}`);
  }

  return (
    <div
      className="bg-slate-700 p-4 rounded cursor-pointer"
      onClick={() => setShowExercises(!showExercises)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">{plano.name}</h3>
          <p className="text-gray-300">Tipo: {plano.type || "Não informado"}</p>
          <p className="text-gray-300">Exercícios: {plano.exercises.length}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white"
            aria-label={`Editar plano ${plano.name}`}
          >
            Editar <Edit size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plano.id);
            }}
            className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
            aria-label={`Deletar plano ${plano.name}`}
          >
            Deletar <Trash size={16} />
          </button>
        </div>
      </div>

      {showExercises && (
        <div className="mt-2 pl-4 border-l-2 border-green-600 text-white">
          <h4 className="font-semibold mb-2">Exercícios:</h4>
          {plano.exercises.length > 0 ? (
            <ul className="space-y-2">
              {plano.exercises.map((ex) => (
                <li key={ex.id} className="bg-slate-600 p-2 rounded">
                  <h5 className="font-semibold">{ex.name}</h5>
                  <p>Grupo muscular: {ex.muscleGroup}</p>
                  <p>Repetições: {ex.repetitions}</p>
                  <p>Séries: {ex.series}</p>
                  <p>Descanso: {ex.restSec} segundos</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum exercício cadastrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
