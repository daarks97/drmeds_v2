import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Medal, Trophy } from 'lucide-react';
import { useWeeklyRanking } from '@/hooks/useWeeklyRanking';
import { getMascotByLevel } from '@/lib/xpValues';
import MedicalIcon from '@/components/ui/medical-icon';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RANKING_GOAL_XP = 100; // Meta semanal pessoal (ajustável)

const RankingIcon = ({ position }: { position: number }) => {
  switch (position) {
    case 1:
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Crown className="h-5 w-5 text-yellow-400 animate-pulse" />
          </TooltipTrigger>
          <TooltipContent>Campeão da semana!</TooltipContent>
        </Tooltip>
      );
    case 2:
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Trophy className="h-5 w-5 text-slate-400" />
          </TooltipTrigger>
          <TooltipContent>2º lugar – quase lá!</TooltipContent>
        </Tooltip>
      );
    case 3:
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Medal className="h-5 w-5 text-orange-400" />
          </TooltipTrigger>
          <TooltipContent>3º lugar – top 3!</TooltipContent>
        </Tooltip>
      );
    default:
      return null;
  }
};

const WeeklyRanking = () => {
  const navigate = useNavigate();
  const { ranking, isLoading, currentUserRank } = useWeeklyRanking();

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900">
        <CardContent className="p-6 text-zinc-600 dark:text-zinc-300">Carregando ranking...</CardContent>
      </Card>
    );
  }

  // Use weeklyXp as xp for progress calculation
  const userProgressXp = currentUserRank?.weeklyXp || 0;

  return (
    <TooltipProvider>
      <Card className="bg-white dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-purple-900 dark:text-purple-300">
            <Trophy className="h-6 w-6 text-yellow-400" />
            🏆 Ranking da Semana
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {ranking.map((user) => {
            const mascot = getMascotByLevel(user.level);
            const isTopThree = user.position <= 3;
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.userId}
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                  isTopThree
                    ? 'bg-purple-50 dark:bg-purple-900/20 animate-in fade-in duration-500'
                    : isCurrentUser
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 border border-purple-200 dark:border-purple-800'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-[3rem]">
                    <span className="font-medium">{user.position}º</span>
                    <RankingIcon position={user.position} />
                  </div>
                  <div className="flex items-center gap-2">
                    <MedicalIcon name={mascot.icon} className="text-purple-600 dark:text-purple-300" size={18} />
                    <span className="font-medium text-zinc-800 dark:text-zinc-100">{user.name}</span>
                  </div>
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.weeklyXp} XP</span>
              </div>
            );
          })}

          {currentUserRank && (
            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
              <p className="text-sm font-medium text-center text-zinc-600 dark:text-zinc-400">
                Seu progresso semanal: {userProgressXp} XP de {RANKING_GOAL_XP}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((userProgressXp / RANKING_GOAL_XP) * 100, 100)}%` }}
                transition={{ duration: 0.6 }}
              >
                <Progress
                  value={userProgressXp}
                  max={RANKING_GOAL_XP}
                  className="h-3 bg-purple-100 dark:bg-purple-900/30"
                  indicatorClassName="bg-purple-600"
                />
              </motion.div>
              <div className="text-center">
                <Button size="sm" variant="outline" onClick={() => navigate('/perfil')}>
                  Ver meu histórico
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default WeeklyRanking;
