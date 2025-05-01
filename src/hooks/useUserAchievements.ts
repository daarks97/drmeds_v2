import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
  achievement_type: string;
}

const ACHIEVEMENT_ICONS: Record<string, { title: string; description: string; icon: string }> = {
  FIRST: {
    title: '🎓 Primeira Vitória',
    description: 'Concluiu seu primeiro tema',
    icon: '🎓'
  },
  NOTURNO: {
    title: '🌙 Estudante Noturno',
    description: 'Estudou após as 22h',
    icon: '🌙'
  },
  CONSISTENCIA: {
    title: '📅 Consistência Diária',
    description: 'Estudou por 5 dias seguidos',
    icon: '📅'
  },
  METODICO: {
    title: '🧠 Estudante Metódico',
    description: 'Concluiu 3 revisões do mesmo tema',
    icon: '🧠'
  },
  FEEDBACK: {
    title: '💬 Ajudante da Comunidade',
    description: 'Deixou feedback ou sugestão para o DrMeds',
    icon: '💬'
  },
  RENASCIMENTO: {
    title: '🔁 Recomeço',
    description: 'Voltou após 7 dias sem estudar',
    icon: '🔁'
  },
  AVALIADOR: {
    title: '📝 Mão na Prova',
    description: 'Finalizou uma avaliação completa',
    icon: '📝'
  },
  STREAK: {
    title: '🔥 Sequência de Fogo',
    description: 'Estudar por vários dias consecutivos',
    icon: '🔥'
  },
  VOLUME: {
    title: '📚 Volume de Estudos',
    description: 'Completar muitos temas de estudo',
    icon: '📚'
  },
  MARATHON: {
    title: '🏃 Maratonista',
    description: 'Estudar muitos temas em uma semana',
    icon: '🏃'
  },
  FOCUS: {
    title: '🎯 Foco Total',
    description: 'Manter alto tempo de foco nos estudos',
    icon: '🎯'
  },
  REVISION: {
    title: '🔄 Mestre das Revisões',
    description: 'Completar muitas revisões programadas',
    icon: '🔄'
  },
  ACCURACY: {
    title: '🎯 Precisão nas Respostas',
    description: 'Alta taxa de acerto nas questões',
    icon: '🎯'
  },
};

export const useUserAchievements = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      return error ? [] : data || [];
    }
  });

  const unlockAchievement = useMutation({
    mutationFn: async (achievementType: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const type = achievementType.toUpperCase();
      const iconData = ACHIEVEMENT_ICONS[type] || {
        title: '🏆 Conquista Especial',
        description: 'Você desbloqueou algo incrível!',
        icon: '🏆'
      };

      const { data: existing } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_type', type)
        .maybeSingle();

      if (existing) return null;

      const { error } = await supabase.from('achievements').insert({
        user_id: user.id,
        title: iconData.title,
        description: iconData.description,
        icon: iconData.icon,
        achievement_type: type
      });

      if (error) throw error;

      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });

      toast({ title: '🎉 Nova conquista!', description: iconData.title });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['achievements'] })
  });

  const checkAutoAchievements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: studyPlans } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', true);

    const { data: revisions } = await supabase
      .from('revisions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .eq('is_refused', false);

    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());

    const completedDates = studyPlans?.map(p => p.completed_at?.split('T')[0]) || [];
    const uniqueDates = [...new Set(completedDates)].sort();

    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const d1 = new Date(uniqueDates[i - 1]);
      const d2 = new Date(uniqueDates[i]);
      const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }

    const studiesThisWeek = studyPlans?.filter(plan =>
      isWithinInterval(new Date(plan.completed_at), { start: weekStart, end: weekEnd })
    ) || [];

    const now = new Date();
const lastStudyDate = studyPlans?.length ? new Date(studyPlans[studyPlans.length - 1].completed_at) : null;

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const studiedLate = studyPlans?.some(plan => {
  const hour = new Date(plan.completed_at).getHours();
  return hour >= 22 && sameDay(new Date(plan.completed_at), now);
});

const recentRevisions = revisions?.reduce((acc, rev) => {
  acc[rev.theme_id] = (acc[rev.theme_id] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const repeatedRevisions = Object.values(recentRevisions as Record<string, number> || {}).some((count) => count >= 3);

const conditions = [
  { unlock: maxStreak >= 3, type: 'streak' },
  { unlock: studyPlans?.length >= 10, type: 'volume' },
  { unlock: studiesThisWeek.length >= 7, type: 'marathon' },
  { unlock: revisions?.length >= 3, type: 'revision' },
  { unlock: studyPlans?.length >= 1, type: 'first' },
  { unlock: studiedLate, type: 'noturno' },
  { unlock: maxStreak >= 5, type: 'consistencia' },
  { unlock: repeatedRevisions, type: 'metodico' }
];

    for (const { unlock, type } of conditions) {
      if (unlock) unlockAchievement.mutate(type);
    }
  };

  return {
    achievements,
    isLoading,
    unlockAchievement,
    checkAutoAchievements
  };
};
