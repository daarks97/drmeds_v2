import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FocusTimerWidgetProps {
  mode: 'pomodoro' | 'contador';
}

const FOCUS_TIME = 25 * 60; // 25 min
const REST_TIME = 5 * 60; // 5 min

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({ mode }) => {
  const [started, setStarted] = useState(false);
  const [resting, setResting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Iniciar cronômetro
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (mode === 'contador') return prev + 1;
        if (mode === 'pomodoro') {
          if (!resting && prev >= FOCUS_TIME) {
            setResting(true);
            return 0;
          }
          if (resting && prev >= REST_TIME) {
            setResting(false);
            setCycle((c) => c + 1);
            return 0;
          }
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, resting, mode]);

  const formatTime = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <div className="space-y-2 text-center">
      <div className="text-lg font-semibold">
        {mode === 'pomodoro' && resting ? 'Tempo de descanso' : 'Tempo de estudo'}
      </div>

      <div className="text-4xl font-mono">
        {formatTime(seconds)} {mode === 'pomodoro' && <span className="ml-2">🍅 x{cycle}</span>}
      </div>

      <motion.div
        animate={{ x: [0, 10, -10, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-2 w-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-full"
      />

      {!started ? (
        <Button onClick={() => setStarted(true)}>Iniciar</Button>
      ) : (
        <div className="flex justify-center gap-4">
          <Button variant="destructive" onClick={() => {
            setStarted(false);
            setResting(false);
            setSeconds(0);
          }}>
            Parar
          </Button>
          {!resting ? (
            <Button onClick={() => setResting(true)}>Descansar</Button>
          ) : (
            <Button onClick={() => {
              setResting(false);
              setSeconds(0);
            }}>
              Ignorar descanso
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
