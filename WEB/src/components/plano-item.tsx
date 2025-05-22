import { Plano } from "@/type";
import { Trash } from "lucide-react";

interface PlanoItemProps {
  plano: Plano;
  onDelete: (id: number) => void;
}

export default function PlanoItem({ plano, onDelete }: PlanoItemProps) {
  return (
    <div className="bg-slate-800 text-white p-4 rounded flex justify-between items-center mb-2">
      <div>
        <h3 className="font-bold">{plano.name}</h3>
        <p className="text-sm text-gray-400">
          Tipo: {plano.planType?.name ?? "Sem tipo"}
        </p>
        <p className="text-sm text-gray-400">
          Exercícios: {plano.exercises?.length ?? 0}
        </p>
      </div>
      <button onClick={() => onDelete(plano.id)}>
        <Trash className="text-red-500" />
      </button>
    </div>
  );
}
