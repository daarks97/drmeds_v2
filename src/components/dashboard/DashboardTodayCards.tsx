// src/components/dashboard/DashboardTodayCards.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, RefreshCw, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { StudyTopic } from '@/lib/types';

interface DashboardTodayCardsProps {
  studyTopic?: StudyTopic;
  todayRevisionsCount: number;
  currentLevel: number;
  currentXP: number;
  xpProgress: number;
  onOpenStudyModal: () => void;
}

const DashboardTodayCards: React.FC<DashboardTodayCardsProps> = ({
  studyTopic,
  todayRevisionsCount,
  currentLevel,
  currentXP,
  xpProgress,
  onOpenStudyModal,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Tema do Dia */}
      <Card className="bg-zinc-900 shadow-md border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Book className="h-6 w-6" />
            Tema do Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-300">
          <p className="text-lg font-medium">
            {studyTopic?.name || "Nenhum tema agendado"}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() =>
              studyTopic
                ? navigate(`/meu-caderno/tema/${studyTopic.id}`)
                : onOpenStudyModal()
            }
            className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
          >
            Estudar Agora
          </Button>
        </CardFooter>
      </Card>

      {/* Revisões do Dia */}
      <Card className="bg-zinc-900 shadow-md border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <RefreshCw className="h-6 w-6" />
            Revisão do Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-300">
          <p className="text-lg font-medium">
            Você tem {todayRevisionsCount} revisões agendadas
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => navigate('/revisions')}
            className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
          >
            Ver Revisões
          </Button>
        </CardFooter>
      </Card>

      {/* XP do Dia */}
      <Card className="bg-zinc-900 shadow-md border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Brain className="h-6 w-6" />
            XP de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-zinc-300">
          <p className="text-lg font-medium">
            {`Você ganhou ${currentXP - currentLevel * 100} XP hoje`}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Nível {currentLevel}</span>
              <span>Nível {currentLevel + 1}</span>
            </div>
            <Progress
              value={xpProgress}
              className="h-3"
              indicatorClassName="bg-yellow-400"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTodayCards;
