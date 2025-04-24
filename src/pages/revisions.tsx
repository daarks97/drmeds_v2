import React from "react";
import { Helmet } from "react-helmet";
import { Brain, Loader2 } from "lucide-react";
import { useRevisions } from "@/hooks/useRevisions";
import { Card, CardContent } from "@/components/ui/card";
import RevisionsList from "@/components/revisions/RevisionsList";
import RefusedRevisionsPopover from "@/components/revisions/RefusedRevisionsPopover";

const Revisions: React.FC = () => {
  const {
    todayRevisions,
    tomorrowRevisions,
    lateRevisions,
    refusedRevisions,
    isLoading,
    hasError,
    markAsCompleted,
    refuse,
    reactivate,
  } = useRevisions();

  const hasRevisionsToday = todayRevisions.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        <span className="ml-2">Carregando revisões...</span>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-5xl mx-auto bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Revisões do Dia | DrMeds</title>
        <meta
          name="description"
          content="Consolide seu aprendizado revisando temas nos ciclos ideais de 1, 7 e 30 dias."
        />
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Brain className="h-8 w-8 text-purple-500" />
            Suas Revisões
          </h1>
          <p className="text-muted-foreground">
            Revise os temas no momento ideal para consolidar seu aprendizado.
          </p>
        </div>
        {refusedRevisions.length > 0 && (
          <RefusedRevisionsPopover
            revisions={refusedRevisions}
            onReactivate={reactivate}
            onMarkCompleted={markAsCompleted}
          />
        )}
      </div>

      {/* Revisões do dia por estágio */}
      <div className="space-y-8">
        <RevisionsList
          revisions={todayRevisions.filter(r => r.revision_stage === "D1")}
          type="today"
          onMarkCompleted={markAsCompleted}
          onRefuse={refuse}
          title="Revisões D1 (24h)"
          description="Temas para revisar hoje - primeiro ciclo"
          isLoading={isLoading}
          error={hasError}
          variant="blue"
        />

        <RevisionsList
          revisions={todayRevisions.filter(r => r.revision_stage === "D7")}
          type="today"
          onMarkCompleted={markAsCompleted}
          onRefuse={refuse}
          title="Revisões D7 (7 dias)"
          description="Temas para revisar hoje - segundo ciclo"
          isLoading={isLoading}
          error={hasError}
          variant="purple"
        />

        <RevisionsList
          revisions={todayRevisions.filter(r => r.revision_stage === "D30")}
          type="today"
          onMarkCompleted={markAsCompleted}
          onRefuse={refuse}
          title="Revisões D30 (30 dias)"
          description="Temas para revisar hoje - terceiro ciclo"
          isLoading={isLoading}
          error={hasError}
          variant="orange"
        />

        {lateRevisions.length > 0 && (
          <RevisionsList
            revisions={lateRevisions}
            type="late"
            onMarkCompleted={markAsCompleted}
            onRefuse={refuse}
            title="Revisões Atrasadas"
            description="Temas que precisam ser revisados com urgência"
            isLoading={isLoading}
            error={hasError}
            variant="red"
          />
        )}

        {!hasRevisionsToday && !isLoading && (
          <Card className="bg-card border border-border">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Brain className="h-12 w-12 text-purple-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                🎉 Nada para revisar hoje
              </h3>
              <p className="text-muted-foreground">
                Que tal revisar um tema antigo?
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Revisions;
