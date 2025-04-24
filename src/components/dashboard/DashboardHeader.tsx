// src/components/dashboard/DashboardHeader.tsx

import React from 'react';
import Header from '@/components/Header';
import TodayStudy from '@/components/TodayStudy';
import TodayReview from '@/components/TodayReview';
import { StudyTopic, ReviewTopic } from '@/lib/types';

interface DashboardHeaderProps {
  userStats: any;
  studyTopic: StudyTopic;
  reviewTopic: ReviewTopic;
  onMarkStudyCompleted: (id: string) => void;
  onViewTopic: (id: string) => void;
  onMarkReviewCompleted: (id: string) => void;
  onRejectReview: (id: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userStats,
  studyTopic,
  reviewTopic,
  onMarkStudyCompleted,
  onViewTopic,
  onMarkReviewCompleted,
  onRejectReview,
}) => (
  <Header
    userStats={userStats}
    todayTopic={studyTopic}
    reviewTopic={reviewTopic}
    onMarkStudyCompleted={onMarkStudyCompleted}
    onViewTopic={onViewTopic}
    onMarkReviewCompleted={onMarkReviewCompleted}
    onRejectReview={onRejectReview}
  />
);

export default DashboardHeader;
