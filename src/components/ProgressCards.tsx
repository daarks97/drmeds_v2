import React from 'react';
import { Clock, BookOpen, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserStats } from '@/lib/types';
import ProgressPieChart from './ProgressPieChart';

interface ProgressCardsProps {
  userStats: UserStats;
  completedTopics: number;
  totalTopics: number;
}

const ProgressCards: React.FC<ProgressCardsProps> = ({
  userStats,
  completedTopics,
  totalTopics,
}) => {
  const progressItems = [
    {
      icon: <Clock className="h-5 w-5 text-study-blue" />,
      title: "Você estudou",
      value: `${userStats.topicsStudiedThisWeek} temas essa semana`,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
      iconBg: "bg-blue-100 dark:bg-blue-800/50"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-study-teal" />,
      title: "Temas concluídos",
      value: `${userStats.topicsCompleted}`,
      color: "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800",
      iconBg: "bg-teal-100 dark:bg-teal-800/50"
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-study-amber" />,
      title: "Revisões pendentes",
      value: `${userStats.pendingReviews}`,
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800",
      iconBg: "bg-amber-100 dark:bg-amber-800/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Cards de progresso */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
          {progressItems.map((item, index) => (
            <Card
              key={index}
              className={`border ${item.color} transition-all hover:shadow-md hover:scale-[1.02] h-full`}
            >
              <CardContent className="p-4 flex items-center">
                <div
                  className={`mr-3 p-2 rounded-full ${item.iconBg} flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">
                    {item.title}
                  </h3>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gráfico de pizza com título */}
      <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">Progresso total</p>
        <ProgressPieChart completed={completedTopics} total={totalTopics} />
      </div>
    </div>
  );
};

export default ProgressCards;
