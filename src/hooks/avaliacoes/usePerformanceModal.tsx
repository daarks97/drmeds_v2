import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PerformanceState {
  isOpen: boolean;
  prova: string | null;
  ano: number | null;
  openPerformanceModal: (prova: string, ano: number) => void;
  closePerformanceModal: () => void;
}

export const usePerformanceModal = create<PerformanceState>((set) => ({
  isOpen: false,
  prova: null,
  ano: null,
  openPerformanceModal: (prova, ano) => set({ isOpen: true, prova, ano }),
  closePerformanceModal: () => set({ isOpen: false, prova: null, ano: null }),
}));

interface Desempenho {
  id: string;
  user_id: string;
  prova: string;
  ano: number;
  acertos: number;
  total: number;
  data_tentativa: string;
  pontuacao?: number;
}

export const useExamPerformance = (prova: string | null, ano: number | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['exam-performance', prova, ano],
    enabled: Boolean(prova && ano),
    queryFn: async (): Promise<Desempenho[] | null> => {
      if (!prova || !ano) return null;

      const { data, error } = await supabase
        .from('desempenho_por_prova')
        .select('*')
        .eq('prova', prova)
        .eq('ano', ano)
        .order('data_tentativa', { ascending: true });

      if (error) {
        toast({
          title: 'Erro ao buscar desempenho',
          description: 'Não foi possível carregar os dados da avaliação.',
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
  });
};
