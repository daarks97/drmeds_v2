import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Revision, StudyPlan } from '@/lib/types';

type SuggestionType = 'revision' | 'study';
interface Suggestion {
  type: SuggestionType;
  item: Revision | StudyPlan;
  priority: number;
}

const queryKeys = {
  overdueRevisions: ['overdueRevisions'],
  todayRevisions: ['todayRevisions'],
  todayStudyPlans: ['todayStudyPlans'],
  weekStudyPlans: ['weekStudyPlans'],
};

export const useStudySuggestion = () => {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Requisições
  const { data: overdueRevisions = [], isLoading: loadingOverdue } = useQuery({
    queryKey: queryKeys.overdueRevisions,
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("revisions")
        .select("*, study_plans:study_plan_id (theme, discipline, difficulty, is_difficult)")
        .lt("revision_date", today)
        .eq("is_completed", false)
        .eq("is_refused", false)
        .order("revision_date", { ascending: true });
      return error ? [] : data;
    },
  });

  const { data: todayRevisions = [], isLoading: loadingToday } = useQuery({
    queryKey: queryKeys.todayRevisions,
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("revisions")
        .select("*, study_plans:study_plan_id (theme, discipline, difficulty, is_difficult)")
        .eq("revision_date", today)
        .eq("is_completed", false)
        .eq("is_refused", false)
        .order("revision_stage", { ascending: true });
      return error ? [] : data;
    },
  });

  const { data: todayStudyPlans = [], isLoading: loadingStudyPlans } = useQuery({
    queryKey: queryKeys.todayStudyPlans,
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("study_plans")
        .select("*")
        .eq("planned_date", today)
        .eq("is_completed", false)
        .order("created_at", { ascending: true });
      return error ? [] : data;
    },
  });

  const { data: weekStudyPlans = [], isLoading: loadingWeekPlans } = useQuery({
    queryKey: queryKeys.weekStudyPlans,
    queryFn: async () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = endOfWeek.toISOString().split('T')[0];
      const todayDate = today.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from("study_plans")
        .select("*")
        .gte("planned_date", startDate)
        .lte("planned_date", endDate)
        .gt("planned_date", todayDate)
        .eq("is_completed", false)
        .order("planned_date", { ascending: true });
      return error ? [] : data;
    },
  });

  const allSuggestions = useMemo(() => {
    if (loadingOverdue || loadingToday || loadingStudyPlans || loadingWeekPlans) return [];

    const suggestions: Suggestion[] = [];

    // Overdue
    overdueRevisions.forEach((rev, i) => {
      const difficult = rev.study_plans?.is_difficult;
      const stage = rev.revision_stage === 'D1' ? 1 : rev.revision_stage === 'D7' ? 2 : 3;
      suggestions.push({
        type: 'revision',
        item: rev,
        priority: difficult ? 11 : 10 - i * 0.1 - stage * 0.01
      });
    });

    // Today study plans
    todayStudyPlans.forEach((plan, i) => {
      suggestions.push({
        type: 'study',
        item: plan,
        priority: plan.is_difficult ? 9 : 8 - i * 0.1
      });
    });

    // Today revisions
    todayRevisions.forEach((rev, i) => {
      const stage = rev.revision_stage === 'D1' ? 1 : rev.revision_stage === 'D7' ? 2 : 3;
      suggestions.push({
        type: 'revision',
        item: rev,
        priority: 6 - i * 0.1 - stage * 0.01
      });
    });

    // Week study plans
    weekStudyPlans.forEach((plan, i) => {
      suggestions.push({
        type: 'study',
        item: plan,
        priority: 4 - i * 0.1
      });
    });

    return suggestions.sort((a, b) => b.priority - a.priority);
  }, [overdueRevisions, todayRevisions, todayStudyPlans, weekStudyPlans,
      loadingOverdue, loadingToday, loadingStudyPlans, loadingWeekPlans]);

  useEffect(() => {
    setSuggestion(allSuggestions[0] || null);
  }, [allSuggestions]);

  // Exibe toast de revisões atrasadas apenas uma vez por dia
  useEffect(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const seenKey = `seenOverdueToast_${todayKey}`;

    if (!localStorage.getItem(seenKey) && overdueRevisions.length > 0 && !loadingOverdue) {
      localStorage.setItem(seenKey, 'true');
      toast({
        title: `⚠️ Revisões atrasadas`,
        description: `Você tem ${overdueRevisions.length} revisão(ões) atrasada(s). Que tal começar por elas?`,
        duration: 6000,
      });
    }
  }, [overdueRevisions, loadingOverdue]);

  const handleStartStudy = (id: string) => {
    toast({
      title: "Iniciando estudo",
      description: "Redirecionando para o tema selecionado."
    });
    navigate(`/planner?study=${id}`);
  };

  const handleStartRevision = (id: string) => {
    toast({
      title: "Iniciando revisão",
      description: "Redirecionando para a revisão selecionada."
    });
    navigate(`/revisions?revision=${id}`);
  };

  return {
    suggestion,
    isLoading: loadingOverdue || loadingToday || loadingStudyPlans || loadingWeekPlans,
    handleStartStudy,
    handleStartRevision,
    overdueRevisionsCount: overdueRevisions?.length || 0,
  };
};
