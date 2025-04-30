
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface QuestionsModalState {
  isOpen: boolean;
  prova: string | null;
  ano: number | null;
  isFinalizado: boolean;
  tema: string | null;
  onlyWrong: boolean; // Add the missing property
  openQuestionsModal: (prova: string, ano: number, isFinalizado: boolean, tema?: string | null, onlyWrong?: boolean) => void;
  closeQuestionsModal: () => void;
}

export const useQuestionsModal = create<QuestionsModalState>((set) => ({
  isOpen: false,
  prova: null,
  ano: null,
  isFinalizado: false,
  tema: null,
  onlyWrong: false, // Add default value
  openQuestionsModal: (prova, ano, isFinalizado, tema = null, onlyWrong = false) => 
    set({ isOpen: true, prova, ano, isFinalizado, tema, onlyWrong }),
  closeQuestionsModal: () => 
    set({ isOpen: false, prova: null, ano: null, isFinalizado: false, tema: null, onlyWrong: false }),
}));

// Add the missing hook for exam questions
export const useExamQuestions = (prova: string | null, ano: number | null, onlyWrong: boolean = false) => {
  return useQuery({
    queryKey: ['exam_questions', prova, ano, onlyWrong],
    queryFn: async () => {
      if (!prova || !ano) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      if (onlyWrong) {
        // Get only wrong questions for this exam
        const { data, error } = await supabase
          .from('questoes_erradas_por_prova')
          .select('*')
          .eq('prova', prova)
          .eq('ano', ano)
         console.log('🎯 Buscando questões:', { prova, ano });
console.log('👉 Slug original:', slug);
console.log('✅ Resultado do Supabase:', data);
console.log('❌ Erro do Supabase:', error);
          .eq('user_id', user.id);
        
        if (error) throw error;
        return data || [];
      } else {
        // Get all questions for this exam
        const { data, error } = await supabase
          .from('questoes')
          .select('*')
          .eq('prova', prova)
          .eq('ano', ano);
        
        if (error) throw error;
        return data || [];
      }
    },
    enabled: !!prova && !!ano
  });
};
