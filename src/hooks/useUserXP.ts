import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getMascotByXP } from '@/lib/xpValues';

type UserXPData = {
  user_id: string;
  xp: number;
  level: number;
};

export const useUserXP = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userXP, isLoading } = useQuery<UserXPData | null>({
    queryKey: ['userXP'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newXpData, error: createError } = await supabase
            .rpc('add_user_xp', {
              xp_amount: 0,
              user_uuid: user.id,
            });

          if (createError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Erro ao criar XP inicial:', createError);
            }
            return null;
          }

          return {
            xp: 0,
            level: 1,
            user_id: user.id,
          };
        }

        if (process.env.NODE_ENV === 'development') {
          console.error('Erro ao buscar XP:', error);
        }
        return null;
      }

      const { level } = getMascotByXP(data.xp);
      return { ...data, level };
    },
  });

  const addXP = useMutation({
    mutationFn: async ({ xpAmount }: { xpAmount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const { data, error } = await supabase.rpc('add_user_xp', {
        xp_amount: xpAmount,
        user_uuid: user.id,
      });

      if (error) throw error;
      return { xpAmount, newXP: data };
    },

    onSuccess: async ({ xpAmount, newXP }) => {
      await queryClient.invalidateQueries({ queryKey: ['userXP'] });

      const { data: { user } } = await supabase.auth.getUser();
      const { data: updatedData } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!updatedData) return;

      const newLevel = getMascotByXP(updatedData.xp).level;
      const oldLevel = userXP?.level ?? 1;

      toast({
        title: `+${xpAmount} XP ganho!`,
        description: `Continue assim, você está evoluindo!`,
      });

      if (newLevel > oldLevel) {
        const { mascot } = getMascotByXP(updatedData.xp);

        toast({
          title: `🔥 Você subiu para o nível ${newLevel}!`,
          description: `Novo mascote: ${mascot.title}! Você está evoluindo!`,
        });

        // 🚀 Futuramente: disparar animação, som ou confete aqui
      }
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao adicionar XP:', error);
      }

      toast({
        title: "Erro ao adicionar XP",
        description: "Não foi possível atualizar sua pontuação.",
        variant: "destructive",
      });
    },
  });

  return {
    userXP,
    addXP,
    isLoading,
  };
};
