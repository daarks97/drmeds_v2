
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { sub, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
  achievement_type: string;
}

interface AchievementInput {
  achievement_type: string;
  title?: string; 
  description?: string;
  icon?: string;
}

export const useAchievements = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's achievements
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }

      return data || [];
    }
  });

  // Unlock achievement mutation
  const unlockAchievement = useMutation({
    mutationFn: async (achievementData: AchievementInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const achievementType = achievementData.achievement_type.toUpperCase();
      
      // Get achievement type info from ACHIEVEMENT_ICONS
      const ACHIEVEMENT_ICONS: Record<string, { title: string; description: string; icon: string }> = {
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
        }
      };
      
      // Use a type assertion to handle this safely
      const themedAchievement = ACHIEVEMENT_ICONS[achievementType] || {
        title: 'Conquista',
        description: 'Nova conquista desbloqueada',
        icon: '🏆'
      };

      const finalAchievementData = {
        title: achievementData.title || themedAchievement.title,
        description: achievementData.description || themedAchievement.description,
        icon: achievementData.icon || themedAchievement.icon,
        achievement_type: achievementData.achievement_type
      };

      const { data: existingAchievements, error: checkError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('achievement_type', achievementData.achievement_type)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingAchievements) return null;

      const { data, error } = await supabase
        .from('achievements')
        .insert({
          ...finalAchievementData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Import confetti dynamically only when needed
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast({
        title: '🎉 Nova Conquista Desbloqueada!',
        description: `${themedAchievement.title}`,
        duration: 5000,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  });

  const checkStudyAchievements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: studyPlans, error: studyPlansError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('is_completed', true)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: true });

    if (studyPlansError || !studyPlans) return;

    const { data: revisions, error: revisionsError } = await supabase
      .from('revisions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (revisionsError) return;

    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());

    const uniqueDates = new Set(
      studyPlans.map(plan => plan.completed_at?.split('T')[0])
    );
    const sortedDates = Array.from(uniqueDates).sort();
    let maxConsecutiveDays = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxConsecutiveDays = Math.max(maxConsecutiveDays, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    const thisWeekStudies = studyPlans.filter(plan => {
      const planDate = new Date(plan.completed_at || '');
      return isWithinInterval(planDate, { start: weekStart, end: weekEnd });
    });

    // Safely check if revisions exist and have these properties
    const completedRevisions = revisions?.filter(rev => 
      rev.is_completed === true && rev.is_refused === false
    ) || [];

    const achievements = [
      {
        condition: maxConsecutiveDays >= 3,
        achievement: { achievement_type: 'streak' }
      },
      {
        condition: maxConsecutiveDays >= 7,
        achievement: { achievement_type: 'streak' }
      },
      {
        condition: studyPlans.length >= 10,
        achievement: { achievement_type: 'volume' }
      },
      {
        condition: studyPlans.length >= 20,
        achievement: { achievement_type: 'volume' }
      },
      {
        condition: thisWeekStudies.length >= 7,
        achievement: { achievement_type: 'marathon' }
      },
      {
        condition: completedRevisions.length >= 3,
        achievement: { achievement_type: 'revision' }
      }
    ];

    for (const { condition, achievement } of achievements) {
      if (condition) {
        unlockAchievement.mutate(achievement);
      }
    }
  };

  const lastUnlockedAchievement = achievements.length > 0 ? achievements[0] : null;

  return {
    achievements,
    isLoading,
    lastUnlockedAchievement,
    unlockAchievement,
    checkStudyAchievements
  };
};
