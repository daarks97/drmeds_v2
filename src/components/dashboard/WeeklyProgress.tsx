
import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { useWeeklyProgress } from '@/hooks/useWeeklyProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const WeeklyProgress = () => {
  const { data: progressPercentageData = 0, isLoading } = useWeeklyProgress();
  // Cast to number to fix TypeScript errors
  const progressPercentage = Number(progressPercentageData);
  
  const progressStatus = useMemo(() => {
    if (progressPercentage >= 90) return {
      message: 'Excelente! Você está quase concluindo todos os seus estudos dessa semana!',
      color: 'bg-green-500'
    };
    if (progressPercentage >= 70) return {
      message: 'Muito bom! Continue assim para atingir todos os seus objetivos.',
      color: 'bg-emerald-500'
    };
    if (progressPercentage >= 50) return {
      message: 'Bom progresso! Você já completou metade dos seus estudos.',
      color: 'bg-blue-500'
    };
    if (progressPercentage >= 25) return {
      message: 'Você está no caminho certo. Continue estudando!',
      color: 'bg-amber-500'
    };
    return {
      message: 'Comece seus estudos! Estabeleça uma rotina consistente.',
      color: 'bg-red-500'
    };
  }, [progressPercentage]);
  
  if (isLoading) {
    return <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl"></div>;
  }
  
  return (
    <Card className="overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          🗓️ Progresso Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {progressPercentage}% concluído
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Meta: 100%
            </span>
          </div>
          
          <div className="relative h-2.5">
            <Progress 
              value={progressPercentage} 
              max={100} 
              className="h-2.5 bg-gray-100 dark:bg-gray-800" 
            />
            <motion.div 
              className={`absolute top-0 left-0 h-full ${progressStatus.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progressStatus.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
