import React, { useState } from 'react';
import { format, parseISO, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Check,
  Clock,
  Calendar,
  Pencil,
  Brain,
  Plus,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchStudyPlans } from '@/lib/services/studyPlans_v2/fetchStudyPlans';
import { useStudyPlanMutations } from '@/hooks/useStudyPlanMutations';
import { useQuestionsModal } from '@/hooks/avaliacoes/useQuestionsModal';
import { Helmet } from 'react-helmet';
import { StudyPlan } from '@/lib/types';

const Planner: React.FC = () => {
  const navigate = useNavigate();
  const { openQuestionsModal } = useQuestionsModal();
  const { markCompletedMutation } = useStudyPlanMutations();
  const [showCompleted, setShowCompleted] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const { data } = useQuery<StudyPlan[]>({
    queryKey: ['studyPlans', 'Todas'],
    queryFn: fetchStudyPlans,
  });

  const studyPlans = (data ?? []) as StudyPlan[];
  const sortedPlans = studyPlans.sort((a, b) => a.planned_date.localeCompare(b.planned_date));
  const upcomingPlans = sortedPlans.filter(p => !p.is_completed);
  const completedPlans = sortedPlans.filter(p => p.is_completed);

  const handleTopicClick = (topicId: string) => {
    navigate(`/meu-caderno/tema/${topicId}`);
  };

  const renderBadge = (plannedDate: string, isCompleted: boolean) => {
    const isLate = isBefore(parseISO(plannedDate), today) && !isCompleted;

    if (isCompleted) {
      return (
        <Badge className="bg-green-900 text-green-100">
          <Check className="h-4 w-4 mr-1" />
          Concluído
        </Badge>
      );
    }

    if (isLate) {
      return (
        <Badge className="bg-red-900 text-red-100 animate-pulse">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Atrasado
        </Badge>
      );
    }

    return (
      <Badge className="bg-purple-900 text-purple-100">
        <Clock className="h-4 w-4 mr-1" />
        {plannedDate === todayStr ? 'Hoje' : 'Agendado'}
      </Badge>
    );
  };

  const renderCard = (topic: StudyPlan) => (
    <Card
      key={topic.id}
      className="p-4 bg-card border border-border transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-foreground">{topic.theme}</h3>
          <p className="text-sm text-muted-foreground">
            {topic.discipline} — {format(parseISO(topic.planned_date), 'dd/MM/yyyy')}
          </p>
        </div>
        {renderBadge(topic.planned_date, topic.is_completed)}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1 border-border"
          onClick={() => handleTopicClick(topic.id)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Resumir
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1 border-border"
          onClick={() =>
            openQuestionsModal('Simulado', new Date().getFullYear(), false, topic.theme)
          }
        >
          <Brain className="h-3.5 w-3.5" />
          Fazer questões
        </Button>

        {!topic.is_completed && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border-green-600 text-green-400 hover:bg-green-900"
            onClick={() => markCompletedMutation.mutate(topic.id)}
          >
            <Check className="h-3.5 w-3.5" />
            Marcar como concluído
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Planejamento | DrMeds</title>
        <meta
          name="description"
          content="Veja todos os seus temas planejados, concluídos e atrasados em ordem."
        />
      </Helmet>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-yellow-400">
            <Calendar className="h-6 w-6 text-purple-500" />
            Seu planejamento
          </h1>
          <p className="text-muted-foreground mt-2">
            Você tem {upcomingPlans.length} tema{upcomingPlans.length !== 1 ? 's' : ''} pendente{upcomingPlans.length !== 1 ? 's' : ''}.
          </p>
        </div>

        <Button
          variant="secondary"
          className="flex items-center gap-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-900/20"
          onClick={() => navigate('/meu-caderno/novo')}
        >
          <Plus className="h-4 w-4" />
          Novo Tema
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        {upcomingPlans.length > 0 ? (
          upcomingPlans.map(renderCard)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum tema pendente.
          </div>
        )}
      </div>

      {completedPlans.length > 0 && (
        <div className="mt-8">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground flex items-center gap-1"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {showCompleted ? 'Ocultar' : 'Mostrar'} {completedPlans.length} concluído{completedPlans.length > 1 ? 's' : ''}
          </Button>

          {showCompleted && (
            <div className="space-y-4 mt-4">
              {completedPlans.map(renderCard)}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 justify-center mt-10">
        <Button
          variant="secondary"
          className="flex items-center gap-2 border border-purple-500 text-purple-500 hover:bg-purple-900/20"
          onClick={() => navigate('/planejamento/semana')}
        >
          <Calendar className="h-4 w-4" />
          Ver planejamento da semana
        </Button>
      </div>
    </div>
  );
};

export default Planner;
