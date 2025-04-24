// src/components/dashboard/FocusTimer.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useUserXP } from '@/hooks/useUserXP';
import { Button } from '@/components/ui/button';
import { XP_VALUES, getMascotByXP, MASCOT_LEVELS } from '@/lib/xpValues';
import { Pause, Play, CheckCircle } from 'lucide-react';
import ECGLine from './ECGLine';

// Format time in mm:ss format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Format hours in hh:mm:ss format
const formatTimeWithHours = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Get ECG color based on study time
const getEcgColor = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 20) return '#22c55e'; // green
  if (minutes < 45) return '#facc15'; // yellow
  return '#dc2626'; // red
};

interface FocusTimerProps {
  onClose: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { userXP, addXP } = useUserXP();

  const totalXP = userXP?.xp || 0;
  const { level, mascot, nextLevel, xpForNextLevel } = getMascotByXP(totalXP);

  const handleStart = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleEnd = useCallback(() => {
    setIsActive(false);

    const minutes = Math.floor(seconds / 60);
    let xpAmount = 0;

    if (minutes < 5) {
      xpAmount = XP_VALUES.FOCUS_MODE.SHORT;
    } else if (minutes < 15) {
      xpAmount = XP_VALUES.FOCUS_MODE.MEDIUM;
    } else {
      xpAmount = XP_VALUES.FOCUS_MODE.LONG;
    }

    if (addXP) {
      addXP.mutate({ xpAmount });
    }

    onClose();
  }, [seconds, addXP, onClose]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const ecgColor = getEcgColor(seconds);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6">Modo de Estudo Focado</h2>

      {/* Timer Display */}
      <div className="text-5xl font-mono font-bold mb-6">
        {formatTimeWithHours(seconds)}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 mb-8">
        {!isActive ? (
          <Button
            className="py-2 px-6 bg-purple-600 hover:bg-purple-700"
            onClick={handleStart}
          >
            <Play className="mr-2 w-4 h-4" /> Iniciar Estudo
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button
                className="py-2 px-6 bg-green-600 hover:bg-green-700"
                onClick={handleResume}
              >
                <Play className="mr-2 w-4 h-4" /> Retomar
              </Button>
            ) : (
              <Button
                className="py-2 px-6 bg-amber-500 hover:bg-amber-600"
                onClick={handlePause}
              >
                <Pause className="mr-2 w-4 h-4" /> Pausar
              </Button>
            )}
            <Button
              className="py-2 px-6 bg-red-500 hover:bg-red-600"
              onClick={handleEnd}
            >
              <CheckCircle className="mr-2 w-4 h-4" /> Terminar
            </Button>
          </>
        )}
      </div>

      {/* XP Progress Info */}
      {nextLevel && (
        <div className="text-md text-purple-600 font-medium mb-8">
          📈 Faltam {xpForNextLevel} XP para se tornar "{MASCOT_LEVELS[nextLevel].title}"
        </div>
      )}

      {/* ECG Animation */}
      <div className="w-full h-16 pt-2">
        {isActive && !isPaused ? (
          <ECGLine color={ecgColor} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Estudo em pausa
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusTimer;
