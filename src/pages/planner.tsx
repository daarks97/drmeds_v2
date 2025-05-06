import React, { useState } from 'react';
import { format, parseISO, isBefore, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
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
  const session = useSession();
  const { openQuestionsModal } = useQuestionsModal();
  const { markCompletedMutation } = useStudyPlanMutations();
  const [showCompleted, setShowCompleted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow' | 'late'>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('Todas');

  const today = new Date();
  const userId = session?.user?.id;

  const { data } = useQuery<StudyPlan[]>({
    queryKey: ['studyPlans', 'Todas'],
    queryFn: fetchStudyPlans,
    enabled: !!userId,
  });

  if (!userId) {
    return <p className="text-center text-muted-foreground mt-8">Carregando usuário...</p>;
  }

  const studyPlans = (data ?? []) as StudyPlan[];
  const sortedPlans = studyPlans.sort((a, b) => a.planned_date.localeCompare(b.planned_date));

  const filteredPlans = sortedPlans.filter(p => {
    if (p.is_completed) return false;
    const date = parseISO(p.planned_date);
    if (filter === 'today') return isToday(date);
    if (filter === 'tomorrow') return isTomorrow(date);
    if (filter === 'late') return isBefore(date, today);
    return true;
  }).filter(p => disciplineFilter === 'Todas' || p.discipline === disciplineFilter);

  const completedPlans = sortedPlans.filter(p => p.is_completed);

  const handleTopicClick = (topicId: string) => {
    navigate(`/meu-caderno/tema/${topicId}`);
  };

  const renderBadge = (plannedDate: string, isCompleted: boolean) => {
    const parsedDate = parseISO(plannedDate);
    const isLate = isBefore(parsedDate, today) && !isCompleted;

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
        {isToday(parsedDate) ? 'Hoje' : isTomorrow(parsedDate) ? 'Amanhã' : 'Agendado'}
      </Badge>
    );
  };

  const renderCard = (topic: StudyPlan) => (
    <Card
      key={topic.id}
      className="p-4 bg-muted/5 border border-muted rounded-xl transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">{topic.theme}</h3>
          <div className="flex gap-2 text-sm text-muted-foreground items-center">
            <Calendar className="w-4 h-4" />
            {format(parseISO(topic.planned_date), 'dd/MM/yyyy')} •
            <Badge className="text-xs px-2 py-0.5 bg-secondary text-foreground border border-border">
              {topic.discipline}
            </Badge>
          </div>
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
            Concluir
          </Button>
        )}
      </div>
    </Card>
  );

  const disciplines = Array.from(new Set(studyPlans.map(p => p.discipline)));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Planejamento | DrMeds</title>
        <meta
          name="description"
          content="Veja todos os seus temas planejados, concluídos e atrasados em ordem."
        />
      </Helmet>

      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-yellow-400">
            <Calendar className="h-6 w-6 text-purple-500" />
            Seu planejamento
          </h1>
          <p className="text-muted-foreground mt-2">
            Você tem {filteredPlans.length} tema{filteredPlans.length !== 1 ? 's' : ''} pendente{filteredPlans.length !== 1 ? 's' : ''}.
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

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Todos</Button>
        <Button variant={filter === 'today' ? 'default' : 'outline'} onClick={() => setFilter('today')}>Hoje</Button>
        <Button variant={filter === 'tomorrow' ? 'default' : 'outline'} onClick={() => setFilter('tomorrow')}>Amanhã</Button>
        <Button variant={filter === 'late' ? 'default' : 'outline'} onClick={() => setFilter('late')}>Atrasados</Button>
        <select
          className="ml-auto bg-background border border-border text-foreground rounded px-2 py-1"
          value={disciplineFilter}
          onChange={e => setDisciplineFilter(e.target.value)}
        >
          <option value="Todas">Todas as disciplinas</option>
          {disciplines.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4 mb-8">
        {filteredPlans.length > 0 ? (
          filteredPlans.map(renderCard)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum tema encontrado para o filtro selecionado.
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
    </div>
  );
};

export default Planner;
