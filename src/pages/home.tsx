import React from 'react';
import { Helmet } from 'react-helmet';
import { useDashboard } from '@/hooks/useDashboard';
import { useWeeklyProgress } from '@/hooks/useWeeklyProgress';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import StudySuggestion from '@/components/dashboard/StudySuggestion';
import WeeklyProgress from '@/components/dashboard/WeeklyProgress';
import MotivationAlert from '@/components/dashboard/MotivationAlert';
import WeeklyRanking from '@/components/dashboard/WeeklyRanking';
import UserOverview from '@/components/dashboard/UserOverview';
import { useUserXP } from "@/hooks/useUserXP";


const Home = () => {
  const {
    enhancedUserStats,
  } = useDashboard();
  
  const { data: weeklyProgress } = useWeeklyProgress();
  const { userXP } = useUserXP();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Home | DrMeds</title>
        <meta name="description" content="Sua página inicial com sugestões personalizadas de estudo" />
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Coluna Principal */}
  <div className="md:col-span-8 space-y-6">
    <UserOverview
      name={enhancedUserStats.userName}
      level={userXP?.level ?? 1}
      xp={userXP?.xp ?? 0}
      minutesToday={enhancedUserStats.topicsStudiedThisWeek * 15} // ou use minutesToday se já estiver
    />

    <DashboardWelcome userName={enhancedUserStats.userName} />

    {Number(weeklyProgress ?? 0) < 100 && (
      <MotivationAlert />
    )}

    <StudySuggestion />

    <WeeklyProgress />
  </div>

  {/* Coluna Lateral */}
  <div className="md:col-span-4 space-y-6">
    <WeeklyRanking />
  </div>
</div>
    </div>
  );
};

export default Home;
