import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PerformanceStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentageCorrect: number;
  performanceByTheme: {
    theme: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
}

export const useQuestionPerformance = () => {
  return useQuery({
    queryKey: ['questionPerformance'],
    queryFn: async (): Promise<PerformanceStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { data: responses, error } = await supabase
        .from('respostas_questoes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!responses?.length) {
        return {
          totalQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          percentageCorrect: 0,
          performanceByTheme: []
        };
      }

      const totalQuestions = responses.length;
      const correctAnswers = responses.filter(r => r.acertou).length;
      const wrongAnswers = totalQuestions - correctAnswers;

      const themePerformance = responses.reduce((acc, response) => {
        if (!response.tema) return acc;

        if (!acc[response.tema]) {
          acc[response.tema] = { correct: 0, total: 0 };
        }

        acc[response.tema].total++;
        if (response.acertou) {
          acc[response.tema].correct++;
        }

        return acc;
      }, {} as Record<string, { correct: number; total: number }>);

      const performanceByTheme = Object.entries(themePerformance).map(([theme, stats]) => ({
        theme,
        correct: stats.correct,
        total: stats.total,
        percentage: Math.round((stats.correct / stats.total) * 100)
      }));

      return {
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentageCorrect: Math.round((correctAnswers / totalQuestions) * 100),
        performanceByTheme: performanceByTheme.sort((a, b) => b.percentage - a.percentage)
      };
    }
  });
};
