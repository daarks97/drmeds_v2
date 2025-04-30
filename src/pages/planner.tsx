import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, Clock, Calendar, Pencil, Brain, Plus } from 'lucide-react';
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

  const today = new Date();
  const formattedDate = format(today, "EEEE, dd 'de' MMMM", { locale: ptBR });
  const todayStr = today.toISOString().split('T')[0];

  const { data } = useQuery<StudyPlan[]>({
    queryKey: ['studyPlans', 'Todas'],
    queryFn: fetchStudyPlans
  });

  const studyPlans = (data ?? []) as StudyPlan[];
  const todayPlans = studyPlans.filter(plan => plan.planned_date === todayStr);

  const handleTopicClick = (topicId: string) => {
    navigate(`/meu-caderno/tema/${topicId}`);
  };

  const getTopicStatus = (isCompleted: boolean) => {
    return isCompleted
      ? {
          icon: <Check className="h-4 w-4 text-green-400" />,
          label: 'Concluído',
          color: 'bg-green-900 text-green-100'
        }
      : {
          icon: <Clock className="h-4 w-4 text-purple-400" />,
          label: 'Hoje',
          color: 'bg-purple-900 text-purple-100'
        };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Planner do Dia | DrMeds</title>
        <meta
          name="description"
          content="Veja os temas de estudo planejados para hoje no seu cronograma personalizado."
        />
      </Helmet>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-yellow-400">
            <Calendar className="h-6 w-6 text-purple-500" />
            {formattedDate}
          </h1>
          <p className="text-muted-foreground mt-2">
            Você tem {todayPlans.length} tema{todayPlans.length !== 1 ? 's' : ''} planejado{todayPlans.length !== 1 ? 's' : ''} para hoje.
          </p>
        </div>

        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => navigate('/novo-tema')}
        >
          <Plus className="h-4 w-4" />
          Novo Tema
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        {todayPlans.map(topic => {
          const status = getTopicStatus(topic.is_completed);

          return (
            <Card
              key={topic.id}
              className="p-4 bg-card border border-border transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{topic.theme}</h3>
                  <p className="text-sm text-muted-foreground">{topic.discipline}</p>
                </div>
                <Badge className={`${status.color} flex items-center gap-1`}>
                  {status.icon}
                  {status.label}
                </Badge>
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
        })}

        {todayPlans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum tema planejado para hoje.
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-border"
          onClick={() => navigate('/planejamento-semanal')}
        >
          <Calendar className="h-4 w-4" />
          Ver planejamento da semana
        </Button>
      </div>
    </div>
  );
};

export default Planner;
