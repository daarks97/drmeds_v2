// src/components/dashboard/LastAchievement.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ACHIEVEMENT_ICONS } from '@/lib/xpValues';
import MedicalIcon from '@/components/ui/medical-icon';

const LastAchievement: React.FC = () => {
  const { lastUnlockedAchievement } = useAchievements();

  if (!lastUnlockedAchievement) return null;

  const achievementType = (lastUnlockedAchievement.achievement_type || 'FOCUS').toUpperCase();
  const achievementIcon = ACHIEVEMENT_ICONS[achievementType] || ACHIEVEMENT_ICONS.FOCUS;

  return (
    <Card className="border-green-100 bg-green-50">
      <CardHeader className="pb-2 border-b border-green-100">
        <CardTitle className="text-base font-medium text-green-800 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-green-600" />
          Última Conquista Desbloqueada
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
            <MedicalIcon name={achievementIcon.icon} className="text-green-600" size={24} />
          </div>
          <div>
            <p className="font-medium text-green-900">{achievementIcon.title}</p>
            <p className="text-sm text-green-700">
              Desbloqueado em{" "}
              {format(new Date(lastUnlockedAchievement.unlocked_at), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastAchievement;
