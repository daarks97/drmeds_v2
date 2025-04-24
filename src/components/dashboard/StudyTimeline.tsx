import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StudyTimelineProps {
  studies: Array<{
    id: string;
    theme: string;
    discipline: string;
    completed_at: string;
  }>;
}

const disciplineColors: Record<string, string> = {
  'Clínica Médica': 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  'Pediatria': 'text-pink-600 bg-pink-100 dark:bg-pink-900/20',
  'Ginecologia/Obstetrícia': 'text-rose-600 bg-rose-100 dark:bg-rose-900/20',
  'Psiquiatria': 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  'Neurologia': 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20',
  'Cirurgia': 'text-green-600 bg-green-100 dark:bg-green-900/20',
  'Saúde Pública': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
  'Ética Médica': 'text-gray-700 bg-gray-100 dark:bg-gray-900/20',
};

const disciplineIcons: Record<string, string> = {
  'Clínica Médica': '⚕️',
  'Pediatria': '👶',
  'Ginecologia/Obstetrícia': '🤰',
  'Psiquiatria': '🧠',
  'Neurologia': '🧬',
  'Cirurgia': '🔪',
  'Saúde Pública': '🏥',
  'Ética Médica': '📜',
};

const StudyTimeline: React.FC<StudyTimelineProps> = ({ studies }) => {
  const [showAll, setShowAll] = useState(false);

  if (!studies.length) return null;

  const studiesToShow = showAll ? studies : studies.slice(0, 5);

  const grouped = studiesToShow.reduce((acc, study) => {
    const date = format(new Date(study.completed_at), "dd 'de' MMMM", { locale: ptBR });
    acc[date] = [...(acc[date] || []), study];
    return acc;
  }, {} as Record<string, typeof studies>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />
          Histórico de Estudos
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayStudies], index) => (
            <div key={date}>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1">
                📅 {date}
              </div>
              <div className="space-y-4">
                {dayStudies.map((study, i) => {
                  const color = disciplineColors[study.discipline] || 'text-gray-600 bg-gray-100 dark:bg-zinc-800';
                  const icon = disciplineIcons[study.discipline] || '📘';
                  return (
                    <motion.div
                      key={study.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="relative pl-6 border-l-2 border-blue-100 dark:border-zinc-700"
                    >
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-600" />
                      <div className="mb-1">
                        <p className="font-medium text-zinc-800 dark:text-zinc-100 flex items-center gap-1">
                          {icon} {study.theme}
                        </p>
                        <div className={`inline-flex text-xs px-2 py-1 rounded-full ${color} mt-1`}>
                          {study.discipline}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!showAll && studies.length > 5 && (
          <div className="text-center mt-6">
            <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
              Ver todos os {studies.length} registros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyTimeline;
