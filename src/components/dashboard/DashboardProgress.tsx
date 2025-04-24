// src/components/dashboard/DashboardProgress.tsx

import React from 'react';
import ProgressCards from '@/components/ProgressCards';
import { UserStats } from '@/lib/types';

interface DashboardProgressProps {
  userStats: UserStats;
  completedTopics: number;
  totalTopics: number;
}

const DashboardProgress: React.FC<DashboardProgressProps> = ({
  userStats,
  completedTopics,
  totalTopics,
}) => (
  <ProgressCards
    userStats={userStats}
    completedTopics={completedTopics}
    totalTopics={totalTopics}
  />
);

export default DashboardProgress;
