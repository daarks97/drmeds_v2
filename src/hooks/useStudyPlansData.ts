import { useQuery } from '@tanstack/react-query';
import { fetchStudyPlans } from '@/lib/services/studyPlans_v2';
import { WeeklySchedule } from '@/lib/types';
import { useMemo } from 'react';

export const useStudyPlansData = () => {
  const { data: studyPlans = [], isLoading: studyPlansLoading } = useQuery({
    queryKey: ['studyPlans', 'Todas'],
    queryFn: fetchStudyPlans,
  });  

  const completedTopics = studyPlans.filter(plan => plan.is_completed).length;
  const totalTopics = studyPlans.length;

  const schedule = useMemo(() => {
    if (studyPlans.length === 0) return [];

    const today = new Date();
    const currentDay = today.getDay();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - currentDay);

    const daysOfWeek = [
      "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    ];

    const weeklySchedule: WeeklySchedule[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + i);
      const formattedDate = currentDate.toISOString().split("T")[0];

      const plansForDay = studyPlans.filter(plan => plan.planned_date === formattedDate);

      plansForDay.forEach(plan => {
        weeklySchedule.push({
          dayOfWeek: daysOfWeek[i],
          dayNumber: currentDate.getDate(),
          planId: plan.id,
          topic: plan.theme,
          isCompleted: plan.is_completed
        });
      });
    }

    return weeklySchedule;
  }, [studyPlans]);

  return {
    studyPlans,
    studyPlansLoading,
    completedTopics,
    totalTopics,
    schedule,
  };
};
