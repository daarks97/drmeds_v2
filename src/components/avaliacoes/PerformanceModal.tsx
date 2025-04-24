import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  usePerformanceModal,
  useExamPerformance
} from '@/hooks/avaliacoes/usePerformanceModal';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PerformanceModal = () => {
  const { isOpen, prova, ano, closePerformanceModal } = usePerformanceModal();
  const { data: performanceData, isLoading } = useExamPerformance(prova, ano);

  // Impede erro visual se ainda não tiver prova selecionada
  if (!prova || !ano) return null;

  // Pode exibir spinner ou fallback de loading
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={closePerformanceModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Carregando desempenho...</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-gray-500">Buscando histórico...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!performanceData) return null;

  const historyData = performanceData.map((attempt) => ({
    data: format(new Date(attempt.data_tentativa), 'dd/MM', { locale: ptBR }),
    percentual: attempt.percentual,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={closePerformanceModal}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            Desempenho - {prova} {ano}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="h-[300px]">
            <h3 className="font-medium mb-4">Histórico de Tentativas</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis unit="%" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percentual"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceModal;
