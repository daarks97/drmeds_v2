import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, RefreshCw, AlertCircle, Award, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
useEffect(() => {
  const showConfetti = async () => {
    if ((fetchedStatistics?.totalStudied || 0) > 50) {
      const confetti = await import("canvas-confetti").then(m => m.default);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  showConfetti();
}, [fetchedStatistics?.totalStudied]);

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatisticsGridProps {
  statistics?: {
    totalStudied: number;
    totalRevisions: number;
    refusedRevisions: number;
    difficultTopics: number;
    totalStudyTimeHours: number;
  };
}

const StatisticsGrid: React.FC<StatisticsGridProps> = ({ statistics: propStatistics }) => {
  const navigate = useNavigate();

  const { data: fetchedStatistics, refetch } = useQuery({
    queryKey: ['userStatistics'],
    queryFn: async () => {
      try {
        const { data: studyPlansData, error: studyPlansError } = await supabase
          .from('study_plans')
          .select('*', { count: 'exact', head: true })
          .eq('is_completed', true);
        if (studyPlansError) throw studyPlansError;

        const { data: revisionsData, error: revisionsError } = await supabase
          .from('revisions')
          .select('*', { count: 'exact', head: true })
          .eq('is_completed', true);
        if (revisionsError) throw revisionsError;

        const { data: refusedRevisionsData, error: refusedRevisionsError } = await supabase
          .from('revisions')
          .select('*', { count: 'exact', head: true })
          .eq('is_refused', true);
        if (refusedRevisionsError) throw refusedRevisionsError;

        const { data: difficultTopicsData, error: difficultTopicsError } = await supabase
          .from('study_plans')
          .select('*', { count: 'exact', head: true })
          .eq('is_difficult', true);
        if (difficultTopicsError) throw difficultTopicsError;

        const { data: studyPlansTimeData, error: studyPlansTimeError } = await supabase
          .from('study_plans')
          .select('study_time_minutes')
          .eq('is_completed', true);
        if (studyPlansTimeError) throw studyPlansTimeError;

        const totalMinutes = studyPlansTimeData.reduce((acc, plan) => acc + (plan.study_time_minutes || 0), 0);
        const totalHours = Math.round(totalMinutes / 60);

        return {
          totalStudied: studyPlansData?.length || 0,
          totalRevisions: revisionsData?.length || 0,
          refusedRevisions: refusedRevisionsData?.length || 0,
          difficultTopics: difficultTopicsData?.length || 0,
          totalStudyTimeHours: totalHours
        };
      } catch (error) {
        console.error('Error fetching statistics:', error);
        return {
          totalStudied: 0,
          totalRevisions: 0,
          refusedRevisions: 0,
          difficultTopics: 0,
          totalStudyTimeHours: 0
        };
      }
    },
    initialData: propStatistics,
  });

  useEffect(() => {
    if ((fetchedStatistics?.totalStudied || 0) > 50) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [fetchedStatistics?.totalStudied]);

  const statistics = fetchedStatistics || propStatistics || {
    totalStudied: 0,
    totalRevisions: 0,
    refusedRevisions: 0,
    difficultTopics: 0,
    totalStudyTimeHours: 0
  };

  const stats = [
    {
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      tooltip: 'Número total de temas marcados como estudados.',
      label: 'Temas Estudados',
      value: statistics.totalStudied,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      route: '/planejamento'
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-blue-500" />,
      tooltip: 'Quantidade de revisões concluídas com sucesso.',
      label: 'Revisões Concluídas',
      value: statistics.totalRevisions,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      route: '/revistos'
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      tooltip: 'Revisões que você optou por não realizar.',
      label: 'Revisões Recusadas',
      value: statistics.refusedRevisions,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      route: '/revistos?refused=true'
    },
    {
      icon: <Award className="h-5 w-5 text-red-500" />,
      tooltip: 'Temas marcados como difíceis.',
      label: 'Temas Difíceis',
      value: statistics.difficultTopics,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      route: '/meu-caderno?filtro=dificeis'
    },
    {
      icon: <Clock className="h-5 w-5 text-green-500" />,
      tooltip: 'Tempo total estimado de estudo concluído.',
      label: 'Tempo de Estudo',
      value: `${statistics.totalStudyTimeHours}h`,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      route: '/perfil'
    }
  ];

  const maxValue = Math.max(...stats.map((s) => Number(String(s.value).replace('h', '')) || 0));

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const valueAsNumber = Number(String(stat.value).replace('h', '')) || 0;
          const isMax = valueAsNumber === maxValue;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(stat.route)}
              className="cursor-pointer"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`${stat.bgColor} border-none relative`}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      {stat.icon}
                      <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      {isMax && (
                        <div className="absolute top-2 right-2 text-yellow-500 text-xl animate-bounce">🥇</div>
                      )}
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-xs text-center">
                  {stat.tooltip}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default StatisticsGrid;
