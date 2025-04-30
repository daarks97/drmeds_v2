import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { startOfWeek, endOfWeek, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Helmet } from 'react-helmet';
import { fetchStudyPlans } from '@/lib/services/studyPlans_v2/fetchStudyPlans';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Pencil } from 'lucide-react';
import { useStudyPlanMutations } from '@/hooks/useStudyPlanMutations';
import { StudyPlan } from '@/lib/types';

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const PlanejamentoSemanal = () => {
  const navigate = useNavigate();
  const { markCompletedMutation } = useStudyPlanMutations();

  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 });

  const { data: plans = [] } = useQuery<StudyPlan[]>({
    queryKey: ['studyPlans', 'Todas'],
    queryFn: fetchStudyPlans,
  });

  const plansDaSemana = plans.filter(plan => {
    const data = new Date(plan.planned_date);
    return data >= inicioSemana && data <= fimSemana;
  });

  const agrupadoPorDia = diasSemana.map((nomeDia, index) => {
    const dataAlvo = new Date(inicioSemana);
    dataAlvo.setDate(dataAlvo.getDate() + index);

    const planosDoDia = plansDaSemana.filter(plan =>
      isSameDay(parseISO(plan.planned_date), dataAlvo)
    );

    return {
      nome: nomeDia,
      dataFormatada: format(dataAlvo, "dd/MM"),
      planos: planosDoDia,
    };
  });

  const handleResumir = (id: string) => {
    navigate(`/meu-caderno/tema/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Planejamento Semanal | DrMeds</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-yellow-400">📅 Planejamento Semanal</h1>

      <div className="space-y-6">
        {agrupadoPorDia.map((dia) => (
          <div key={dia.nome}>
            <h2 className="text-xl font-semibold text-purple-400 mb-2">
              {dia.nome} – <span className="text-muted-foreground">{dia.dataFormatada}</span>
            </h2>

            {dia.planos.length === 0 ? (
              <p className="text-sm text-muted-foreground mb-4">Nenhum tema planejado.</p>
            ) : (
              <div className="space-y-3">
                {dia.planos.map(plan => (
                  <Card key={plan.id} className="p-4 border border-border bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{plan.theme}</h3>
                        <p className="text-sm text-muted-foreground">{plan.discipline}</p>
                      </div>
                      {plan.is_completed && (
                        <Badge className="bg-green-900 text-green-300">Concluído</Badge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-border"
                        onClick={() => handleResumir(plan.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Resumir
                      </Button>

                      {!plan.is_completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 border-green-600 text-green-400 hover:bg-green-900"
                          onClick={() => markCompletedMutation.mutate(plan.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Marcar como concluído
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanejamentoSemanal;
