import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart } from 'lucide-react';
import { usePerformanceModal } from '@/hooks/avaliacoes/usePerformanceModal';

interface AvaliacaoCardProps {
  prova: string;
  ano: number;
  acertos: number;
  total: number;
  percentual: number;
}

const AvaliacaoCard = ({ prova, ano, acertos, total, percentual }: AvaliacaoCardProps) => {
  const { openPerformanceModal } = usePerformanceModal();
  const navigate = useNavigate();
  const isCompleted = total > 0;

  const handleStartExam = () => {
    const slug = `${prova.toLowerCase().replace(/\s+/g, '-')}-${ano}`;
    navigate(`/avaliacoes/${slug}`);
  };

  return (
    <Card
      className={`overflow-hidden transition-shadow duration-300 hover:shadow-lg
        ${isCompleted ? 'opacity-90 bg-gray-50' : 'bg-white border-purple-200'}`}
    >
      <CardHeader className={isCompleted ? 'bg-gray-100' : 'bg-purple-50'}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-purple-900">{prova} {ano}</h3>
          {isCompleted && (
            <span className="text-sm text-purple-700 font-medium">
              {acertos}/{total} questões
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {isCompleted ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Desempenho</span>
              <span className="font-medium">{percentual}%</span>
            </div>
            <Progress
              value={percentual}
              className="h-2"
              indicatorClassName={
                percentual >= 70
                  ? 'bg-green-500'
                  : percentual >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }
            />
          </div>
        ) : (
          <div className="py-2 text-center text-sm text-gray-500">
            Você ainda não realizou esta prova
          </div>
        )}
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 bg-gray-50 mt-4">
        <Button
          variant={isCompleted ? 'outline' : 'default'}
          className={`w-full h-auto py-2 text-sm ${!isCompleted ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          onClick={handleStartExam}
        >
          {isCompleted ? 'Refazer Prova' : 'Fazer Prova'}
        </Button>

        <Button
          variant="outline"
          className="flex-1 h-auto py-2 text-sm"
          onClick={() => openPerformanceModal(prova, ano)}
        >
          <LineChart className="h-4 w-4 mr-1" />
          Ver Desempenho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvaliacaoCard;
