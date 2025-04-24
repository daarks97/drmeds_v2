import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isWeekend
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Revision } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RevisionCalendarProps {
  revisions: Revision[];
}

const RevisionCalendar: React.FC<RevisionCalendarProps> = ({ revisions }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(month => {
      const newMonth = new Date(month);
      newMonth.setMonth(month.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(month => {
      const newMonth = new Date(month);
      newMonth.setMonth(month.getMonth() + 1);
      return newMonth;
    });
  };

  const getRevisionsForDay = (day: Date) => {
    return revisions.filter(revision => {
      const revisionDate = parseISO(revision.revision_date);
      return isSameDay(revisionDate, day);
    });
  };

  const getRevisionStyle = (revision: Revision) => {
    const today = new Date();
    const revisionDate = parseISO(revision.revision_date);
    const isLate = revisionDate < today && !revision.is_completed && !revision.is_refused;

    if (revision.is_completed) return 'bg-green-300/80 text-green-900';
    if (revision.is_refused) return 'bg-orange-300/80 text-orange-900';
    if (isLate) return 'bg-amber-300/70 text-amber-900 border border-amber-400';

    switch (revision.revision_stage) {
      case 'D1':
        return 'bg-blue-200/70 text-blue-900';
      case 'D7':
        return 'bg-indigo-200/70 text-indigo-900';
      case 'D30':
        return 'bg-purple-200/70 text-purple-900';
      default:
        return 'bg-zinc-200 text-zinc-800';
    }
  };

  const getTooltip = (revision: Revision) => {
    const base = revision.study_plans?.theme || 'Revisão';
    const stage = revision.revision_stage;
    const status = revision.is_completed
      ? 'Concluída'
      : revision.is_refused
      ? 'Recusada'
      : parseISO(revision.revision_date) < new Date()
      ? 'Atrasada'
      : 'Pendente';

    return `${base} (${stage}) • ${status}`;
  };

  return (
    <Card className="shadow-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gray-800 dark:text-white">
            Calendário de Revisões
          </CardTitle>
          <div className="flex space-x-2 text-sm">
            <button
              onClick={previousMonth}
              className="px-2 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              &lt;
            </button>
            <span className="font-medium text-gray-700 dark:text-white">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button
              onClick={nextMonth}
              className="px-2 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              &gt;
            </button>
          </div>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Visualize todas as suas revisões programadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center text-xs text-gray-600 dark:text-gray-400 font-medium py-1"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => {
              const dayRevisions = getRevisionsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isWeekendDay = isWeekend(day);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[85px] p-1 border rounded-md text-sm transition",
                    isCurrentMonth
                      ? "bg-white dark:bg-zinc-800"
                      : "bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400",
                    isWeekendDay && "bg-zinc-50 dark:bg-zinc-900/50",
                    isToday &&
                      "ring-2 ring-blue-500 font-bold bg-blue-50 dark:bg-blue-900/30"
                  )}
                >
                  <div className="text-right text-xs text-gray-600 dark:text-gray-300 mb-1">
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayRevisions.map(revision => (
                      <div
                        key={revision.id}
                        className={cn(
                          "text-[11px] p-1 rounded truncate",
                          getRevisionStyle(revision)
                        )}
                        title={getTooltip(revision)}
                      >
                        {revision.study_plans?.theme || "Revisão"}
                        <span className="ml-1 text-[10px] opacity-80">
                          ({revision.revision_stage})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisionCalendar;
