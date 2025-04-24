import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserXP } from '@/hooks/useUserXP';
import { getMascotByXP, MASCOT_LEVELS } from '@/lib/xpValues';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw, Info } from 'lucide-react';
import MedicalIcon from '@/components/ui/medical-icon';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const motivationalPhrases = [
  "Continue assim, futuro R1! 💪",
  "A disciplina te trouxe até aqui!",
  "Cada tema te deixa mais preparado.",
  "Você tá voando! 🧠",
  "Mais um nível, mais uma conquista! 🎯"
];

const getRandomPhrase = () =>
  motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

const UserLevel = () => {
  const { userXP, isLoading } = useUserXP();
  const [phrase, setPhrase] = useState('');
  const [levelChanged, setLevelChanged] = useState(false);
  const [lastLevel, setLastLevel] = useState<number | null>(null);

  useEffect(() => {
    if (userXP?.xp !== undefined) {
      setPhrase(getRandomPhrase());
    }
  }, [userXP?.xp]);

  if (isLoading || !userXP) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-purple-50/50 to-white dark:from-zinc-800 dark:to-zinc-900 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-24">
            <p className="text-muted-foreground">Carregando informações de nível...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalXP = userXP.xp || 0;
  const { level, mascot, nextLevel, xpForNextLevel } = getMascotByXP(totalXP);

  useEffect(() => {
    if (lastLevel !== null && level !== lastLevel) {
      setLevelChanged(true);
      setTimeout(() => setLevelChanged(false), 2000);
    }
    setLastLevel(level);
  }, [level]);

  const currentXP = totalXP;
  const nextLevelXP = nextLevel ? MASCOT_LEVELS[nextLevel].requiredXP : null;
  const currentLevelXP = MASCOT_LEVELS[level].requiredXP;
  const xpRange = nextLevelXP ? nextLevelXP - currentLevelXP : 1;
  const currentProgress = currentXP - currentLevelXP;
  const progress = (currentProgress / xpRange) * 100;

  const progressMessage = nextLevel
    ? `Faltam ${xpForNextLevel} XP para o nível "${MASCOT_LEVELS[nextLevel].title}"`
    : "Você atingiu o nível máximo!";

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-purple-50 via-purple-50/50 to-white dark:from-zinc-800 dark:to-zinc-900 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full ${
                    levelChanged ? 'ring-4 ring-yellow-400 ring-opacity-50 animate-pulse' : 'bg-purple-100 dark:bg-purple-900/30'
                  }`}
                >
                  <MedicalIcon name={mascot.icon} className="text-purple-600" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">{mascot.title}</h2>
                  <p className="text-base text-muted-foreground">
                    Nível {level} – XP: {currentXP}
                    {nextLevelXP ? ` / ${nextLevelXP}` : ''}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              >
                <Progress
                  value={progress}
                  className="h-2.5 bg-purple-100 dark:bg-purple-900/30"
                  indicatorClassName="bg-purple-500"
                />
              </motion.div>

              <p className="text-sm text-purple-600 font-medium flex items-center gap-1.5 dark:text-purple-300">
                <RefreshCcw className="h-4 w-4" />
                {progressMessage}
              </p>

              <div className="text-sm italic text-purple-700 dark:text-purple-300">
                {phrase}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-white">
                    <Info className="h-3.5 w-3.5 mr-1" />
                    Como ganhar XP?
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-sm max-w-xs text-left leading-snug">
                  Você ganha XP ao:<br />
                  ✅ Marcar temas como estudados<br />
                  ✅ Concluir revisões<br />
                  ✅ Acertar questões<br />
                  ✅ Manter o streak de dias seguidos
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="hidden md:flex items-center justify-center pl-6">
              <div className={`w-24 h-24 flex items-center justify-center rounded-full ${levelChanged ? 'ring-4 ring-yellow-400 animate-pulse' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                <MedicalIcon name={mascot.icon} className="text-purple-600" size={56} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default UserLevel;
