
import { useState, useMemo } from "react";
import { useDesempenhoPorTema } from "@/hooks/useDesempenhoPorTema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DesempenhoPorTema } from "@/lib/types";

export function PainelDesempenho() {
  const { data, isLoading, error } = useDesempenhoPorTema();
  const [filtroDisciplina, setFiltroDisciplina] = useState("Todas");

  const disciplinas = useMemo(() => {
    if (!data) return [];
    // Ensure data is treated as array
    const dataArray = Array.isArray(data) ? data : [];
    const unicas = Array.from(new Set(dataArray.map((d) => d.disciplina))).sort();
    return ["Todas", ...unicas];
  }, [data]);

  const dadosFiltrados = useMemo(() => {
    if (!data) return [];
    // Ensure data is treated as array
    const dataArray = Array.isArray(data) ? data : [];
    return filtroDisciplina === "Todas"
      ? dataArray
      : dataArray.filter((d) => d.disciplina === filtroDisciplina);
  }, [data, filtroDisciplina]);

  if (isLoading) return <p className="text-sm text-gray-500">Carregando desempenho...</p>;
  if (error) return <p className="text-sm text-red-500">Erro ao carregar dados.</p>;

  return (
    <div className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-900 text-sm overflow-x-auto border border-zinc-200 dark:border-zinc-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-study-gray dark:text-white">📊 Seu desempenho por tema</h2>
        <div>
          <label htmlFor="filtro" className="sr-only">Filtrar por disciplina</label>
          <select
            id="filtro"
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white px-3 py-1 rounded-md text-sm"
          >
            {disciplinas.map((disc) => (
              <option key={disc} value={disc}>
                {disc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full text-left text-zinc-800 dark:text-zinc-100">
        <thead>
          <tr className="text-sm bg-zinc-100 dark:bg-zinc-800">
            <th className="p-2 font-semibold">Tema</th>
            <th className="p-2 font-semibold">Acertos (%)</th>
            <th className="p-2 font-semibold">Tentativas</th>
            <th className="p-2 font-semibold">Último Acesso</th>
            <th className="p-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((item: DesempenhoPorTema) => {
            const status =
              item.percentual_acerto >= 80
                ? { label: "Indo bem", color: "green", icon: "✅" }
                : item.percentual_acerto >= 50
                ? { label: "Mediano", color: "yellow", icon: "⚠️" }
                : { label: "Precisa revisar", color: "red", icon: "🔁" };

            return (
              <tr
                key={item.tema}
                className={cn(
                  "border-t border-zinc-200 dark:border-zinc-700",
                  status.color === "green" && "bg-green-50 dark:bg-green-900/20",
                  status.color === "yellow" && "bg-yellow-50 dark:bg-yellow-900/20",
                  status.color === "red" && "bg-red-50 dark:bg-red-900/20"
                )}
              >
                <td className="p-2">{item.tema}</td>
                <td className="p-2">{item.percentual_acerto}%</td>
                <td className="p-2">{item.total_respostas}</td>
                <td className="p-2">
                  {format(new Date(item.ultimo_acesso), "dd/MM/yyyy")}
                </td>
                <td className="p-2">
                  <Badge
                    variant={
                      status.color === "green"
                        ? "default"
                        : status.color === "yellow"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {status.icon} {status.label}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
