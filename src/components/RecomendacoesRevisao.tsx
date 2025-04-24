import { useRecomendacoesRevisao } from "@/hooks/useRecomendacoesRevisao";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecomendacoesRevisao() {
  const { data, isLoading, error } = useRecomendacoesRevisao();

  if (isLoading || error || !data || data.length === 0) return null;

  // Ordena por menor percentual de acerto
  const recomendacoesOrdenadas = [...data].sort((a, b) => a.percentual_acerto - b.percentual_acerto);

  const getPrioridade = (percentual: number) => {
    if (percentual < 50) return { cor: "destructive", texto: "Alta prioridade" };
    if (percentual < 80) return { cor: "warning", texto: "Média prioridade" };
    return { cor: "default", texto: "Revisar se possível" };
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-5 mb-6 shadow-md">
      <h2 className="text-xl font-semibold mb-3 text-yellow-400">🔁 Recomendações de Revisão</h2>
      <ul className="space-y-2 text-sm">
        {recomendacoesOrdenadas.map((item, i) => {
          const prioridade = getPrioridade(item.percentual_acerto);

          return (
            <li
              key={i}
              className="bg-zinc-800 p-3 rounded-md text-white flex justify-between items-center transition hover:bg-zinc-700/80"
            >
              <div>
                <p className="font-medium">{item.tema}</p>
                <p className="text-xs text-gray-400">
                  {item.percentual_acerto}% de acertos
                </p>
              </div>
              <Badge variant={prioridade.cor} className={cn("text-[11px]")}>
                {prioridade.texto}
              </Badge>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
