import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/hooks/useAchievements';
import { getCurrentWeekDates } from '@/lib/weeklyDates';

interface WeeklySummaryData {
  studyCount: number;
  revisionCount: number;
  weeklyProgress: number;
  lastAchievement: Achievement | null;
  isLoading: boolean;
  isVisible: boolean;
}

export const useWeeklySummary = (): WeeklySummaryData => {
  const [isVisible, setIsVisible] = useState(false);
  const { weekStart, weekEnd } = getCurrentWeekDates();

  // Verifica se o resumo semanal deve ser exibido
  useEffect(() => {
    const checkVisibility = () => {
      const now = new Date();
      const today = now.getDay(); // 0 = Domingo, 1 = Segunda...
      const hour = now.getHours();
      const lastShown = localStorage.getItem('lastWeeklySummaryShown');
      const lastShownDate = lastShown ? new Date(lastShown) : null;

      const isSundayAfter8PM = today === 0 && hour >= 20;
      const isFirstMondayAccess = today === 1 && (!lastShownDate || lastShownDate < weekStart);

      if ((isSundayAfter8PM || isFirstMondayAccess) && (!lastShownDate || lastShownDate < weekStart)) {
        setIsVisible(true);
        localStorage.setItem('lastWeeklySummaryShown', new Date().toISOString());
      }
    };

    checkVisibility();
  }, [weekStart]);

  // Estudos concluídos na semana
  const { data: completedStudies = [], isLoading: loadingStudies } = useQuery({
    queryKey: ['weeklyCompletedStudies', weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('is_completed', true)
        .gte('completed_at', weekStart.toISOString())
        .lte('completed_at', weekEnd.toISOString());

      if (error) {
        console.error('Erro ao buscar estudos:', error);
        return [];
      }
      return data;
    },
    enabled: isVisible
  });

  // Revisões concluídas na semana
  const { data: completedRevisions = [], isLoading: loadingRevisions } = useQuery({
    queryKey: ['weeklyCompletedRevisions', weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revisions')
        .select('*')
        .eq('is_completed', true)
        .eq('is_refused', false)
        .gte('revision_date', weekStart.toISOString().split('T')[0])
        .lte('revision_date', weekEnd.toISOString().split('T')[0]);

      if (error) {
        console.error('Erro ao buscar revisões:', error);
        return [];
      }
      return data;
    },
    enabled: isVisible
  });

  // Última conquista da semana
  const { data: weeklyAchievement, isLoading: loadingAchievement } = useQuery({
    queryKey: ['weeklyAchievement', weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .gte('unlocked_at', weekStart.toISOString())
        .lte('unlocked_at', weekEnd.toISOString())
        .order('unlocked_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar conquista:', error);
        return null;
      }
      return data;
    },
    enabled: isVisible
  });

  // Progresso da semana com ajuste básico
  const calculateWeeklyProgress = (): number => {
    const total = completedStudies.length;
    if (total === 0) return 0;

    const progress = (total / (total + 2)) * 100;
    return Math.min(100, Math.round(progress));
  };

  return {
    studyCount: completedStudies.length,
    revisionCount: completedRevisions.length,
    weeklyProgress: calculateWeeklyProgress(),
    lastAchievement: weeklyAchievement,
    isLoading: loadingStudies || loadingRevisions || loadingAchievement,
    isVisible
  };
};
