import React, { useEffect } from 'react';
import { Calendar, CheckCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeeklySummary } from '@/hooks/useWeeklySummary';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const WeeklySummary = () => {
  const {
    studyCount,
    revisionCount,
    weeklyProgress,
    lastAchievement,
    isLoading,
    isVisible
  } = useWeeklySummary();

  useEffect(() => {
    if (weeklyProgress >= 90) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [weeklyProgress]);

  if (!isVisible || isLoading) return null;

  const getMotivationalMessage = () => {
    if (studyCount >= 7) {
      return "🌟 Você foi um verdadeiro guerreiro dos estudos esta semana!";
    } else if (studyCount >= 5) {
      return "💪 Sua consistência está construindo o seu futuro!";
    } else if (studyCount >= 3) {
      return "🌱 Cada pequeno passo conta. Continue assim!";
    }
    return "🎯 Uma nova semana, novas oportunidades de aprendizado!";
  };

  return (
    <TooltipProvider>
      <Card className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 dark:bg-indigo-800/20 rounded-bl-full opacity-50" />

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              📅 Resumo da Semana
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
                <div className="flex items-center gap-1 text-blue-700 dark:text-blue-300 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">Temas estudados</span>
                </div>
                <span className="text-2xl font-semibold text-blue-800 dark:text-blue-100">{studyCount}</span>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 flex flex-col items-center">
                <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 mb-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Revisões</span>
                </div>
                <span className="text-2xl font-semibold text-indigo-800 dark:text-indigo-100">{revisionCount}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progresso da semana
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {weeklyProgress}%
                </span>
              </div>
              <Progress
                value={weeklyProgress}
                className="h-2 bg-purple-100 dark:bg-purple-900/30"
                indicatorClassName={`${
                  weeklyProgress >= 90 ? 'bg-green-500' : 'bg-purple-600'
                }`}
              />
            </motion.div>

            {lastAchievement && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-amber-50 dark:bg-yellow-900/20 rounded-lg p-3 mt-3"
              >
                <div className="flex items-center gap-1 text-amber-700 dark:text-yellow-300 mb-1">
                  <span className="text-xl">{lastAchievement.icon}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium cursor-help">Conquista desbloqueada</span>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-[220px]">
                      Conquista obtida por atingir um marco da semana!
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-amber-800 dark:text-yellow-100">{lastAchievement.title}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-lg p-4 mt-3"
            >
              <p className="text-center text-gray-800 dark:text-gray-200 font-medium">
                {getMotivationalMessage()}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default WeeklySummary;
