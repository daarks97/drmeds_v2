import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  type: "study" | "revision";
  completed: boolean;
}

const DailyChecklist = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dailyTasks = [], isLoading } = useQuery({
    queryKey: ["daily-tasks"],
    queryFn: async (): Promise<Task[]> => {
      const today = new Date().toISOString().split("T")[0];

      // Fetch today's study plans
      const { data: studyPlans, error: studyError } = await supabase
        .from("study_plans")
        .select("id, theme, is_completed")
        .eq("planned_date", today);

      if (studyError) throw studyError;

      // Fetch today's revisions
      const { data: revisions, error: revisionError } = await supabase
        .from("revisions")
        .select(`
          id,
          revision_stage,
          is_completed,
          study_plans (
            theme
          )
        `)
        .eq("revision_date", today);

      if (revisionError) throw revisionError;

      const studyTasks: Task[] = (studyPlans || []).map((plan) => ({
        id: `study-${plan.id}`,
        title: `Estudar tema: ${plan.theme}`,
        type: "study",
        completed: plan.is_completed,
      }));

      const revisionTasks: Task[] = (revisions || []).map((rev) => ({
        id: `revision-${rev.id}`,
        title: `Revisar: ${rev.study_plans.theme} (${rev.revision_stage})`,
        type: "revision",
        completed: rev.is_completed,
      }));

      return [...studyTasks, ...revisionTasks];
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (task: { id: string; type: string; completed: boolean }) => {
      const [type, id] = task.id.split("-");
      const table = type === "study" ? "study_plans" : "revisions";

      const { error } = await supabase
        .from(table)
        .update({ is_completed: task.completed })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      toast({
        title: "Tarefa atualizada",
        description: "Status da tarefa foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        📅 Hoje você precisa:
      </h3>

      {isLoading ? (
        <p className="text-sm text-gray-500">Carregando tarefas...</p>
      ) : dailyTasks.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma tarefa para hoje! 🎉</p>
      ) : (
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={(checked) => {
                  toggleTaskMutation.mutate({
                    id: task.id,
                    type: task.type,
                    completed: checked as boolean,
                  });
                }}
              />
              <label
                htmlFor={task.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {task.title}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyChecklist;
