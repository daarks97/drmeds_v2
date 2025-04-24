import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressPieChartProps {
  completed: number;
  total: number;
}

const ProgressPieChart: React.FC<ProgressPieChartProps> = ({ completed, total }) => {
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = [
    { name: 'Concluídos', value: completed, color: '#34D399' }, // verde suave
    { name: 'Pendentes', value: remaining, color: '#60A5FA' },   // azul suave
  ];

  const COLORS = data.map((d) => d.color);

  const formatTooltip = (value: number, name: string) => [`${value} temas`, name];

  return (
    <Card className="w-full h-full shadow-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-700 dark:text-white">
          Progresso dos Temas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex items-center justify-center">
          {/* Texto percentual no centro */}
          <div className="absolute z-10 text-center">
            <p className="text-xl font-bold text-study-green dark:text-green-400">{percentage}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">completos</p>
          </div>
          {/* Gráfico */}
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={60}
                dataKey="value"
                animationDuration={800}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {completed} de {total} temas concluídos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressPieChart;
