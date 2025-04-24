import React, { useState } from 'react';
import { Book, RefreshCw, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStudySuggestion } from '@/hooks/useStudySuggestion';
import { StudyPlan, Revision } from '@/lib/types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const mascots = {
  study: '📘', // estudo novo
  revision: '🔁', // revisão normal
  reaction: '🔥', // reação ao clique
};

const StudySuggestion = () => {
  const {
    suggestion,
    isLoading,
    handleStartStudy,
    handleStartRevision,
    overdueRevisionsCount
  } = useStudySuggestion();

  // Add a default value for remainingToday
  const remainingToday = { study: 2, revision: 1 };
  const [mascot, setMascot] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">💡 Sugestão de hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-gray-500 dark:text-zinc-400">Carregando sugestão...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) {
    return (
      <Card className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">💡 Sugestão de hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex flex-col items-center justify-center gap-2">
            <p className="text-gray-600 dark:text-zinc-300">Você está em dia com seus estudos! 🎉</p>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Parabéns por manter a disciplina.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isRevision = suggestion.type === 'revision';
  const theme = isRevision
    ? (suggestion.item as Revision).study_plans?.theme
    : (suggestion.item as StudyPlan).theme;

  // Safely extract revision_date for revisions only
  const isLateRevision = isRevision &&
    (suggestion.item as Revision).revision_date < new Date().toISOString().split('T')[0];

  const revisionDate = isRevision
    ? format(new Date((suggestion.item as Revision).revision_date), 'dd/MM')
    : null;

  const handleClick = () => {
    setMascot(mascots.reaction);
    setTimeout(() => {
      setMascot(isRevision ? mascots.revision : mascots.study);
    }, 1200);

    isRevision
      ? handleStartRevision(suggestion.item.id)
      : handleStartStudy(suggestion.item.id);
  };

  const emoji = mascot || (isRevision ? mascots.revision : mascots.study);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`rounded-xl shadow-sm border ${isLateRevision ? 'border-red-400' : 'border-gray-100 dark:border-zinc-800'} bg-white dark:bg-zinc-900`}>
        <CardHeader className="pb-2 flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">💡 Sugestão de hoje</CardTitle>
          <span className="text-2xl">{emoji}</span>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isRevision ? (
                    <RefreshCw className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <Book className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="font-medium text-gray-800 dark:text-gray-100">{theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={isRevision ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}>
                    {isRevision ? `Revisão ${(suggestion.item as Revision).revision_stage}` : 'Estudo'}
                  </Badge>
                  {isLateRevision && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Atrasada
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                className={isRevision ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700"}
                onClick={handleClick}
              >
                {isRevision ? 'Revisar' : 'Estudar'}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRevision ? (
                <>
                  Esta é uma revisão <strong>{(suggestion.item as Revision).revision_stage}</strong> do tema <strong>"{theme}"</strong>.<br />
                  Revisão marcada para: <strong>{revisionDate}</strong>{' '}
                  {isLateRevision && <span className="text-red-500 font-medium">(atrasada)</span>}
                </>
              ) : (
                `Este tema está programado para hoje e ainda não foi concluído.`
              )}
            </p>

            <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
              {isRevision
                ? 'Revisar é fixar. Você já sabe, agora só precisa reforçar!'
                : 'A constância é o segredo dos que vencem.'}
            </p>

            <div className="text-xs mt-2 text-right text-zinc-500 dark:text-zinc-400 flex items-center justify-end gap-2">
              <Sparkles className="h-3 w-3" />
              Faltam hoje: {remainingToday.study} estudo(s), {remainingToday.revision} revisão(ões)
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudySuggestion;
