
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useStudySuggestion } from './useStudySuggestion';
import { useUserXP } from './useUserXP';
import { XP_VALUES, getMascotByXP } from '@/lib/xpValues';
import { supabase } from '@/integrations/supabase/client';

export const useFocusMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15); // Default 15 minutes
  const { suggestion, handleStartStudy, handleStartRevision } = useStudySuggestion();
  const { toast } = useToast();

  const { addXP } = useUserXP();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      
      // Award XP based on session duration
      const xpAmount = selectedDuration <= 5 ? XP_VALUES.FOCUS_MODE.SHORT :
                      selectedDuration <= 15 ? XP_VALUES.FOCUS_MODE.MEDIUM :
                      XP_VALUES.FOCUS_MODE.LONG;
      
      // Execute the mutation and handle the success case
      addXP.mutate({ xpAmount }, {
        onSuccess: (newTotalXP) => {
          if (newTotalXP) {
            const { mascot } = getMascotByXP(newTotalXP);
            
            toast({
              title: "✅ Sessão concluída!",
              description: `Parabéns! Você completou ${selectedDuration} minutos de estudo focado e ganhou +${xpAmount} XP como ${mascot.title}!`,
            });
          }
        }
      });
      
      // Update study time for the current study/revision
      if (suggestion) {
        const isRevision = 'revision_stage' in suggestion.item;
        if (isRevision) {
          handleStartRevision(suggestion.item.id);
          // No need to update study time for revisions
        } else {
          handleStartStudy(suggestion.item.id);
          // Update study time for study plans
          updateStudyTime(suggestion.item.id, selectedDuration);
        }
      } else {
        // If no specific study item is selected, still record the time in a general way
        updateUserTotalStudyTime(selectedDuration);
      }
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, selectedDuration, suggestion]);

  // Function to update study time for a specific study plan
  const updateStudyTime = async (studyPlanId: string, minutes: number) => {
    try {
      // First get the current study time
      const { data: currentData, error: fetchError } = await supabase
        .from('study_plans')
        .select('study_time_minutes')
        .eq('id', studyPlanId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentTime = currentData?.study_time_minutes || 0;
      const newTime = currentTime + minutes;
      
      // Update the study time
      const { error: updateError } = await supabase
        .from('study_plans')
        .update({ study_time_minutes: newTime })
        .eq('id', studyPlanId);
      
      if (updateError) throw updateError;
      
      console.log(`Updated study time for plan ${studyPlanId}: +${minutes} minutes (total: ${newTime})`);
    } catch (error) {
      console.error('Error updating study time:', error);
    }
  };
  
  // Function to update total study time for the user
  const updateUserTotalStudyTime = async (minutes: number) => {
    try {
      // In a real app, we would update a user profile table with the time
      console.log(`Recorded ${minutes} minutes of general study time`);
      // This is a placeholder - in a full implementation, you'd store this in the user's profile
    } catch (error) {
      console.error('Error updating total study time:', error);
    }
  };

  const startFocusMode = (duration: number = 15) => {
    setSelectedDuration(duration);
    setTimeLeft(duration * 60);
    setIsActive(true);
  };

  const stopFocusMode = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const pauseFocusMode = () => {
    setIsActive(false);
  };

  const resumeFocusMode = () => {
    setIsActive(true);
  };

  return {
    isActive,
    timeLeft,
    selectedDuration,
    startFocusMode,
    stopFocusMode,
    pauseFocusMode,
    resumeFocusMode,
    currentTopic: suggestion,
  };
};
