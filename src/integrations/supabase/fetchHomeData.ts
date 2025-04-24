import { supabase } from './client';

// Interface para plano de estudo
export interface StudyPlan {
  id: string;
  theme: string;
  discipline: string;
  planned_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  difficulty?: string;
  is_difficult?: boolean;
  study_time_minutes?: number;
  completed_at?: string | null;
  resumo?: string | null;
}

// Interface para revisão
export interface Revision {
  id: string;
  user_id: string;
  tema: string;
  tipo: 'D1' | 'D7' | 'D30';
  data_revisao: string;
  concluida: boolean;
  data_conclusao: string | null;
  status_revisao: 'sucesso' | 'incompleta' | null;
  created_at: string;
}

export const fetchHomeData = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];

  // Busca em paralelo os estudos e as revisões do dia
  const [{ data: todayStudyPlans, error: todayError }, { data: revisionsToday, error: revisionError }] = await Promise.all([
    supabase.from('study_plans')
      .select('*')
      .eq('planned_date', today)
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),

    supabase.from('revisions')
      .select('*')
      .eq('data_revisao', today)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
  ]);

  // Tratamento de erro
  if (todayError || revisionError) {
    console.error('Erro ao buscar dados do dia:', todayError || revisionError);
    return { todayStudyPlans: [], todayRevisions: [] };
  }

  return {
    todayStudyPlans: todayStudyPlans || [],
    todayRevisions: revisionsToday || []
  };
};

export default fetchHomeData;
