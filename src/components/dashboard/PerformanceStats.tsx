import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useQuestionPerformance } from '@/hooks/useQuestionPerformance';
import { motion } from 'framer-motion';

const getPerformanceBadge = (percentage: number) => {
  if (percentage >= 80) return { label: '🥇 Excelente', color: 'text-green-600' };
  if (percentage >= 60) return { label: '⚠️ Regular', color: 'text-yellow-600' };
  return { label: '❌ Crítico', color: 'text-red-600' };
};

const getMotivationalMessage = (percentage: number) => {
  if (percentage >= 80) return 'Continue assim! 👏';
  if (percentage >= 60) return 'Você está quase lá!';
  return 'Reveja esse tema em breve!';
};

const PerformanceStats = () => {
  const { data: performance, isLoading } = useQuestionPerformance();

  if (isLoading || !performance) {
    return <div>Carregando estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Desempenho Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Total de Questões</p>
              <p className="text-2xl font-bold">{performance.totalQuestions}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Acertos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                <Check className="inline-block mr-1 h-5 w-5" />
                {performance.correctAnswers}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Erros</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                <X className="inline-block mr-1 h-5 w-5" />
                {performance.wrongAnswers}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Tema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performance.performanceByTheme.map((theme) => {
              const badge = getPerformanceBadge(theme.percentage);
              const message = getMotivationalMessage(theme.percentage);

              return (
                <div key={theme.theme} className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-zinc-700 dark:text-zinc-200">{theme.theme}</p>
                    <div className={`text-sm font-semibold ${badge.color}`}>{badge.label}</div>
                  </div>
                  <div className="text-sm mb-1 text-zinc-500 dark:text-zinc-400">
                    {theme.correct}/{theme.total} ({theme.percentage}%)
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${theme.percentage}%` }}
                    transition={{ duration: 0.6 }}
                    className={`
                      h-2 rounded-full 
                      ${theme.percentage >= 70 ? 'bg-green-500' : theme.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                    `}
                  />
                  <p className="text-xs mt-1 italic text-zinc-500 dark:text-zinc-400">{message}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceStats;
