import React, { useMemo, useState } from "react";
import { format, parseISO, isToday, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Edit, Trash2, FileText } from "lucide-react";
import { StudyPlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StudyPlanListProps {
  studyPlans: StudyPlan[];
  onEdit: (studyPlan: StudyPlan) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string, isCompleted: boolean) => void;
  onToggleDifficulty?: (id: string, isDifficult: boolean) => void;
}

const StudyPlanList: React.FC<StudyPlanListProps> = ({
  studyPlans,
  onEdit,
  onDelete,
  onToggleCompletion,
  onToggleDifficulty,
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState("Todas");

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Extrair disciplinas únicas
  const disciplinas = useMemo(() => {
    const unicas = Array.from(new Set(studyPlans.map((p) => p.discipline)));
    return ["Todas", ...unicas];
  }, [studyPlans]);

  // Filtro + ordenação por data
  const planosFiltrados = useMemo(() => {
    const filtrados =
      selectedDiscipline === "Todas"
        ? studyPlans
        : studyPlans.filter((p) => p.discipline === selectedDiscipline);

    return filtrados.sort((a, b) =>
      parseISO(a.planned_date).getTime() - parseISO(b.planned_date).getTime()
    );
  }, [studyPlans, selectedDiscipline]);

  if (planosFiltrados.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
        Nenhum estudo planejado. Adicione um novo estudo para começar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtro por disciplina */}
      <div className="flex justify-end">
        <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
          <SelectTrigger className="w-60 mb-2">
            <SelectValue placeholder="Filtrar por disciplina" />
          </SelectTrigger>
          <SelectContent>
            {disciplinas.map((disc) => (
              <SelectItem key={disc} value={disc}>
                {disc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de cards */}
      {planosFiltrados.map((studyPlan) => {
        const isUrgente = isBefore(parseISO(studyPlan.planned_date), new Date()) || isToday(parseISO(studyPlan.planned_date));

        return (
          <Card
            key={studyPlan.id}
            className={cn(
              "transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
              "border-l-4",
              studyPlan.is_completed
                ? "border-l-green-500 dark:border-l-green-400"
                : studyPlan.is_difficult
                ? "border-l-purple-500 dark:border-l-purple-400"
                : isUrgente
                ? "border-l-red-500 dark:border-l-red-500"
                : "border-l-blue-500 dark:border-l-blue-400",
              "bg-white dark:bg-zinc-900"
            )}
          >
            <CardContent className="p-6">
              {/* Título e Disciplina */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {studyPlan.theme} {isUrgente && <span className="text-red-600 dark:text-red-400">⚠️</span>}
                  </h3>
                  {studyPlan.is_difficult && (
                    <Badge variant="destructive" className="text-xs">
                      🔥 Difícil
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {studyPlan.discipline}
                </p>
              </div>

              {/* Metadados */}
              <div className="flex items-center gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
                <span>📅 {formatDate(studyPlan.planned_date)}</span>
                {studyPlan.is_completed && (
                  <span className="text-green-600 dark:text-green-400">
                    ✅ Concluído
                  </span>
                )}
                {studyPlan.difficulty && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    studyPlan.difficulty === 'easy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : studyPlan.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  )}>
                    {studyPlan.difficulty === 'easy' ? '🟢 Fácil' :
                     studyPlan.difficulty === 'medium' ? '🟡 Médio' :
                     '🔴 Difícil'}
                  </span>
                )}
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-800/30",
                    studyPlan.is_completed && "text-gray-400 dark:text-gray-500 hover:text-gray-500"
                  )}
                  onClick={() => onToggleCompletion(studyPlan.id, !studyPlan.is_completed)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {studyPlan.is_completed ? "Desmarcar" : "Concluir"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                  onClick={() => onEdit(studyPlan)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800/30"
                  onClick={() => onDelete(studyPlan.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-800/30"
                  onClick={() => window.location.href = `/study/${studyPlan.id}`}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Ver detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StudyPlanList;
