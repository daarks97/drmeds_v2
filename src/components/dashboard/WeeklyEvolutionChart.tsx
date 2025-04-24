import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

const WEEKLY_GOAL = 2; // meta de 2 temas por dia

const WeeklyEvolutionChart = () => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['weekly-evolution'],
    queryFn: async () => {
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const { data: completedPlans, error } = await supabase
        .from('study_plans')
        .select('planned_date, is_completed')
        .in('planned_date', dates)
        .eq('is_completed', true);

      if (error) throw error;

      const dailyCounts = dates.map(date => {
        const count = completedPlans?.filter(plan => plan.planned_date === date).length || 0;
        return {
          dia: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
          temas: count,
          date
        };
      });

      return dailyCounts;
    }
  });

  if (isLoading) return <div>Carregando gráfico...</div>;

  const maxDay = chartData.reduce((max, item) =>
    item.temas > max.temas ? item : max, { temas: -1 });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const count = payload[0].value;
      const message =
        count === 0 ? 'Dia sem estudo 😴' :
        count === 1 ? '1 tema! Boa!' :
        count <= 3 ? `${count} temas! Mandou bem 👏` :
        `${count} temas! Você voou! 🚀`;
      return (
        <div className="bg-white dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-100 p-2 rounded shadow">
          {message}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        📈 Temas estudados nos últimos dias
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="dia"
              tick={{ fill: '#4b5563' }}
              stroke="#d1d5db"
              className="dark:stroke-zinc-700"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#4b5563' }}
              stroke="#d1d5db"
              className="dark:stroke-zinc-700"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={WEEKLY_GOAL} stroke="#9ca3af" strokeDasharray="3 3" />

            <Bar dataKey="temas" animationDuration={700}>
              {chartData.map((entry, index) => {
                const isMax = entry.date === maxDay.date;
                const isZero = entry.temas === 0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isZero
                      ? '#fecaca' // vermelho claro
                      : isMax
                      ? '#facc15' // destaque amarelo
                      : '#9b87f5'} // padrão roxo
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
        Meta diária: {WEEKLY_GOAL} temas/dia (linha pontilhada)
      </p>
    </div>
  );
};

export default WeeklyEvolutionChart;
