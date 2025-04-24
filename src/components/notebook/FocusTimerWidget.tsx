import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserXP } from '@/hooks/useUserXP';
import confetti from 'canvas-confetti';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getEcgColor = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 20) return '#22c55e'; // green
  if (minutes < 45) return '#facc15'; // yellow
  return '#dc2626'; // red
};

const getMotivationalMessage = (minutes: number) => {
  if (minutes >= 45) return '🔥 Resistência total! Você é imparável!';
  if (minutes >= 20) return '🚀 Foco ativado, mantenha o ritmo!';
  if (minutes >= 5) return '💪 Ótimo começo, continue assim!';
  return '🧠 Vamos começar com tudo!';
};

const FocusTimerWidget = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { userXP, addXP } = useUserXP();

  const minutes = Math.floor(seconds / 60);
  const ecgColor = getEcgColor(seconds);
  const motivationalMessage = getMotivationalMessage(minutes);
  const xpPreview = minutes < 5 ? 3 : minutes < 15 ? 5 : 8;

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleEnd = () => {
    const xpAmount = xpPreview;
    if (addXP) {
      addXP.mutate({ xpAmount });
    }
    if (minutes >= 15) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    setIsActive(false);
    setSeconds(0);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  // Minimized view
  if (isMinimized) {
    return (
      <Card
        className="shadow-md w-16 h-16 flex flex-col items-center justify-center cursor-pointer bg-purple-50 dark:bg-zinc-800 border-purple-200 dark:border-purple-700"
        onClick={toggleMinimize}
      >
        <CardContent className="p-2 text-center">
          <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
            {formatTime(seconds)}
          </div>
          {isActive && isPaused && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-500 hover:text-green-600 mt-1"
              onClick={(e) => {
                e.stopPropagation();
                handleResume();
              }}
            >
              <Play className="h-3 w-3" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md w-72 bg-purple-50 dark:bg-zinc-900 border-purple-200 dark:border-purple-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Cronômetro de Estudo</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={toggleMinimize}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-3xl font-mono font-bold text-center my-3 text-purple-800 dark:text-purple-100">
          {formatTime(seconds)}
        </div>

        <div className="flex justify-center gap-2 mb-2">
          {!isActive ? (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleStart} size="sm">
              <Play className="w-3 h-3 mr-1" /> Iniciar
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleResume} size="sm">
                  <Play className="w-3 h-3 mr-1" /> Retomar
                </Button>
              ) : (
                <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handlePause} size="sm">
                  <Pause className="w-3 h-3 mr-1" /> Pausar
                </Button>
              )}
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleEnd} size="sm">
                <CheckCircle className="w-3 h-3 mr-1" /> Terminar
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 italic mb-2">{motivationalMessage}</p>

        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          🎁 XP previsto: <strong>{xpPreview}</strong>
        </div>

        {/* ECG Animation */}
        <div className="w-full h-8 relative overflow-hidden border-t border-purple-200 dark:border-purple-700 pt-2">
          {isActive && !isPaused ? (
            <svg className="absolute top-0 left-0 w-[300%] h-full animate-ecg">
              <path
                d="M0,10 L5,10 L10,0 L15,20 L20,10 L25,10 L30,5 L35,15 L40,10 L100,10"
                stroke={ecgColor}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600 text-xs">
              Estudo em pausa
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusTimerWidget;
