// src/components/dashboard/FocusMode.tsx

import React from 'react';
import { Timer, Play, Pause, X, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFocusMode } from '@/hooks/useFocusMode';
import { Revision, StudyPlan } from '@/lib/types';
import ECGLine from './ECGLine';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const FocusModeButton = () => {
  const { startFocusMode, isActive } = useFocusMode();

  if (isActive) return null;

  return (
    <Button
      onClick={() => startFocusMode(15)}
      className="w-full bg-violet-600 hover:bg-violet-700"
    >
      <Timer className="w-4 h-4 mr-2" />
      Modo Foco: Estudar por 15 min
    </Button>
  );
};

const FocusMode: React.FC = () => {
  const {
    isActive,
    timeLeft,
    currentTopic,
    pauseFocusMode,
    resumeFocusMode,
    stopFocusMode,
  } = useFocusMode();

  if (!isActive) return null;

  const isRevision = currentTopic && 'revision_stage' in currentTopic.item;
  const item = currentTopic?.item;
  const topicName = isRevision
    ? (item as Revision)?.study_plans?.theme || 'Revisão'
    : (item as StudyPlan)?.theme || 'Estudo';

  const topicType = isRevision
    ? `Revisão ${(item as Revision)?.revision_stage}`
    : 'Estudo';

  return (
    <Card className="bg-violet-50 border-violet-200">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-violet-900">
              {topicName}
            </h3>
            <p className="text-sm text-violet-700">{topicType}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={stopFocusMode}
            className="text-violet-700 hover:text-violet-900 hover:bg-violet-200"
            aria-label="Parar modo foco"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold text-violet-900">
            {formatTime(timeLeft)}
          </div>

          <ECGLine />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={timeLeft === 0 ? stopFocusMode : pauseFocusMode}
              className="bg-white text-violet-700 border-violet-300 hover:bg-violet-100"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>

            <Button
              onClick={resumeFocusMode}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {timeLeft === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Concluir
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusMode;
