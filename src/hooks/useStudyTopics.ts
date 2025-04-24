import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type StudyTopic = {
  id: string;
  name: string;
  isCompleted: boolean;
};

export const useStudyTopics = () => {
  const { toast } = useToast();
  const [studyTopic, setStudyTopic] = useState<StudyTopic | null>(null);

  const {
    data: studyTopics = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<StudyTopic[]>({
    queryKey: ['todayStudyTopics'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('planned_date', today)
        .eq('is_completed', false)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);

      const formatted = data.map(plan => ({
        id: plan.id,
        name: plan.theme,
        isCompleted: plan.is_completed,
      }));

      return formatted;
    },
    onSuccess: (topics) => {
      if (topics.length > 0) {
        setStudyTopic(topics[0]);
      }
    },
  });

  const handleViewTopic = (id: string) => {
    const topic = studyTopics.find(t => t.id === id);
    if (topic) {
      setStudyTopic(topic);
      toast({
        title: "Acessando tema",
        description: `Você está acessando o tema: ${topic.name}`,
      });
    }
  };

  return {
    studyTopic,
    studyTopics,
    isLoading,
    isError,
    handleViewTopic,
    refetchStudyTopics: refetch,
  };
};
