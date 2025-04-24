
import React from 'react';
import { Helmet } from 'react-helmet';
import { useDashboard } from '@/hooks/useDashboard';
import { useWeeklyProgress } from '@/hooks/useWeeklyProgress';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import StudySuggestion from '@/components/dashboard/StudySuggestion';
import WeeklyProgress from '@/components/dashboard/WeeklyProgress';
import MotivationAlert from '@/components/dashboard/MotivationAlert';
import WeeklyRanking from '@/components/dashboard/WeeklyRanking';

const Home = () => {
  const {
    studyTopic,
    reviewTopic,
    enhancedUserStats,
    studyPlans,
    handleMarkStudyCompleted,
    handleViewTopic,
    handleMarkReviewCompleted,
    handleRejectReview
  } = useDashboard();
  
  const { data: weeklyProgress } = useWeeklyProgress();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Home | DrMeds</title>
        <meta name="description" content="Sua página inicial com sugestões personalizadas de estudo" />
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Coluna Principal */}
        <div className="md:col-span-8 space-y-6">
          <DashboardWelcome userStats={enhancedUserStats} />
          
          {weeklyProgress < 100 && (
            <MotivationAlert />
          )}
          
          <StudySuggestion 
            studyTopic={studyTopic} 
            reviewTopic={reviewTopic} 
            onStudyComplete={handleMarkStudyCompleted}
            onReviewComplete={handleMarkReviewCompleted}
            onReviewReject={handleRejectReview}
            onViewTopic={handleViewTopic}
          />
          
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
