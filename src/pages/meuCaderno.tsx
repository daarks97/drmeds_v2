import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search, BookOpen, Check, AlertTriangle, Brain, Pencil
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { fetchStudyPlans } from '@/lib/services/studyPlans_v2/fetchStudyPlans';
import { useQuestionsModal } from '@/hooks/avaliacoes/useQuestionsModal';

const MeuCaderno = () => {
  const navigate = useNavigate();
  const { openQuestionsModal } = useQuestionsModal();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: studyPlans = [] } = useQuery({
    queryKey: ['studyPlans', 'Todas'],
    queryFn: fetchStudyPlans,
  });

  const filteredTopics = searchTerm
    ? studyPlans.filter(plan =>
        plan.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.discipline.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : studyPlans;

  const pendingCount = filteredTopics.filter(p => !p.is_completed).length;

  const uniqueDisciplines = Array.from(new Set(filteredTopics.map(t => t.discipline)));

  const topicsByDiscipline = uniqueDisciplines.reduce((acc, discipline) => {
    const disciplineTopics = filteredTopics.filter(topic => topic.discipline === discipline);
    if (disciplineTopics.length > 0) {
      acc[discipline] = disciplineTopics;
    }
    return acc;
  }, {} as Record<string, typeof studyPlans>);

  const handleTopicClick = (topicId: string) => {
    navigate(`/meu-caderno/tema/${topicId}`);
  };

  const handleQuestionsClick = (theme: string) => {
    openQuestionsModal('Simulado', new Date().getFullYear(), false, theme);
  };

  const getTopicStatus = (topic: typeof studyPlans[0]) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (topic.is_completed) {
      return {
        icon: <Check className="h-4 w-4 text-green-400" />,
        label: 'Concluído',
        color: 'bg-green-900 text-green-100'
      };
    } else if (topic.planned_date < today) {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        label: 'Pendente',
        color: 'bg-amber-900 text-amber-100'
      };
    } else if (topic.planned_date === today) {
      return {
        icon: <Brain className="h-4 w-4 text-purple-400 animate-pulse" />,
        label: 'Hoje',
        color: 'bg-purple-900 text-purple-100'
      };
    } else if (topic.planned_date === tomorrowStr) {
      return {
        icon: <BookOpen className="h-4 w-4 text-blue-400" />,
        label: 'Amanhã',
        color: 'bg-blue-900 text-blue-100'
      };
    }

    return {
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
      label: 'Planejado',
      color: 'bg-muted text-foreground'
    };
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-yellow-400">📒 Meu Caderno</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar tema ou disciplina..."
            className="pl-8 bg-card border-border text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-6">
        Você tem <span className="text-yellow-300 font-medium">{pendingCount}</span> tema{pendingCount !== 1 ? 's' : ''} pendente{pendingCount !== 1 ? 's' : ''}.
      </p>

      <Accordion type="multiple" className="space-y-4">
        {Object.entries(topicsByDiscipline).map(([discipline, topics]) => (
          <AccordionItem key={discipline} value={discipline}>
            <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-yellow-400">
              <span className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                {discipline} ({topics.length})
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {topics.map(topic => {
                  const status = getTopicStatus(topic);
                  return (
                    <Card
                      key={topic.id}
                      className="hover:shadow-md transition-shadow p-4 bg-card border border-border rounded-2xl"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-foreground">{topic.theme}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(topic.planned_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge className={`${status.color} flex items-center gap-1`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 border-border hover:scale-[1.03] transition-transform"
                            onClick={() => handleTopicClick(topic.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Resumir
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 border-border hover:scale-[1.03] transition-transform"
                            onClick={() => handleQuestionsClick(topic.theme)}
                          >
                            <Brain className="h-3.5 w-3.5" />
                            Fazer questões
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MeuCaderno;
