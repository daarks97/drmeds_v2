
import React, { useEffect, useState } from 'react';
import { Alert } from "@/components/ui/alert";
import { Rocket, Timer, Trophy, PartyPopper } from "lucide-react";
import { useWeeklyProgress } from '@/hooks/useWeeklyProgress';
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';

const MotivationAlert = () => {
  const { data: progressData = 0 } = useWeeklyProgress();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Garantir que progress seja um número
  const progress = typeof progressData === 'number' ? progressData : 0;

  useEffect(() => {
    if (progress >= 100 && !showConfetti) {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      setShowConfetti(true);
    }
  }, [progress, showConfetti]);

  const getMessage = (progress: number) => {
    if (progress < 30) {
      return "⏳ Ainda dá tempo de começar a semana com o pé direito!";
    } else if (progress <= 70) {
      return "🚀 Você está indo bem! Continue assim!";
    } else if (progress < 100) {
      return "🏆 Incrível! Você está prestes a bater sua meta!";
    } else {
      return "🎉 Semana completa! Você é um monstro!";
    }
  };

  const getIcon = (progress: number) => {
    if (progress < 30) return <Timer className="h-5 w-5 text-yellow-500" />;
    if (progress <= 70) return <Rocket className="h-5 w-5 text-blue-600" />;
    if (progress < 100) return <Trophy className="h-5 w-5 text-green-600" />;
    return <PartyPopper className="h-5 w-5 text-pink-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-700 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {getIcon(progress)}
            <span className="font-medium text-green-800 dark:text-green-200 text-sm sm:text-base">
              {getMessage(progress)}
            </span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2 bg-green-100 dark:bg-green-800" />
        </div>
      </Alert>
    </motion.div>
  );
};

export default MotivationAlert;
