// src/components/dashboard/DashboardStats.tsx

import React from 'react';
import { UserStats } from '@/lib/types';
import { Clock, BookOpen, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
  userStats: UserStats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userStats }) => {
  const progressItems = [
    {
      icon: <Clock className="h-5 w-5 text-study-blue" />,
      title: "Você estudou",
      value: `${userStats.topicsStudiedThisWeek} temas essa semana`,
      color: "bg-blue-50 border-blue-100",
    },
    {
      icon: <BookOpen className="h-5 w-5 text-study-teal" />,
      title: "Temas concluídos",
      value: `${userStats.topicsCompleted}`,
      color: "bg-teal-50 border-teal-100",
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-study-amber" />,
      title: "Revisões pendentes",
      value: `${userStats.pendingReviews}`,
      color: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <>
      {progressItems.map((item, index) => (
        <Card
          key={index}
          className={`border ${item.color} transition-all hover:shadow-md h-full`}
        >
          <CardContent className="p-4 flex items-center">
            <div className="mr-3">{item.icon}</div>
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                {item.title}
              </h3>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;
