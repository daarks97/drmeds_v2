import { useStudyTopics } from './useStudyTopics';
import { useReviewTopics } from './useReviewTopics';
import { useStudyPlanMutations } from './useStudyPlanMutations';
import { useStudyPlansData } from './useStudyPlansData';
import { useToast } from './use-toast';
import { useConquistaRecente } from './useConquistaRecente';
import { userData } from '@/lib/mockData'; // TODO: substituir por dados reais futuramente

export const useDashboard = () => {
  const { studyTopic, handleViewTopic } = useStudyTopics();
  const { reviewTopic, handleMarkReviewCompleted, handleRejectReview } = useReviewTopics();
  const { toggleCompletionMutation, markCompletedMutation } = useStudyPlanMutations();
  const { studyPlans, studyPlansLoading, completedTopics, totalTopics, schedule } = useStudyPlansData();
  const { toast } = useToast();
  const { mostrarConquista } = useConquistaRecente();

  const enhancedUserStats = {
    ...userData,
    topicsStudiedThisWeek: completedTopics,
    topicsCompleted: completedTopics,
    pendingReviews: 0,
  };

  const handleMarkStudyCompleted = (id: string) => {
    markCompletedMutation.mutate(id, {
      onSuccess: () => {
        if (studyTopic?.tema) {
          mostrarConquista("tema", studyTopic.tema);
        }
      },
    });
  };

  return {
    studyTopic,
    reviewTopic,
    enhancedUserStats,
    completedTopics,
    totalTopics,
    studyPlans,
    studyPlansLoading,
    schedule,
    handleMarkStudyCompleted,
    handleViewTopic,
    handleMarkReviewCompleted,
    handleRejectReview,
    toggleCompletionMutation,
    markCompletedMutation,
  };
};
