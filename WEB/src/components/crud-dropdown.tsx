import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface CrudDropdownProps {
  exerciseId: number;
}

export default function CrudDropdown({ exerciseId }: CrudDropdownProps) {
  const router = useRouter();

  function handleEdit() {
    // Navegar para a página de edição, passando o id
    router.push(`/exercises/edit/${exerciseId}`);
  }

  async function handleDelete() {
    // Aqui você pode chamar sua API para deletar o exercício
    // Exemplo:
    const confirmed = confirm("Tem certeza que quer apagar esse exercício?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:8080/exercises/${exerciseId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Atualize a lista, recarregue página ou use um callback para remover o item da UI
      router.refresh(); // força atualização da página no Next.js 13+
    } else {
      alert("Erro ao apagar exercício");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil />
          editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash />
          apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
