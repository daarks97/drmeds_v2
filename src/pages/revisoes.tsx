import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CalendarCheck2, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Revisao {
  id: string;
  tema: string;
  tipo: 'D1' | 'D7' | 'D30';
  data_revisao: string;
  concluida: boolean;
  study_plan_id: string;
}

const RevisoesPage = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [revisoes, setRevisoes] = useState<Revisao[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchRevisoes = async () => {
      if (!session?.user?.id) return;

      const { data: revisoesData, error } = await supabase
        .from('revisions')
        .select(`id, revision_stage, revision_date, is_completed, study_plan_id, study_plans(theme)`) // JOIN
        .eq('user_id', session.user.id);

      if (!error && revisoesData) {
        const mapped = revisoesData.map((rev: any) => ({
          id: rev.id,
          tipo: rev.revision_stage,
          data_revisao: rev.revision_date,
          concluida: rev.is_completed,
          study_plan_id: rev.study_plan_id,
          tema: rev.study_plans?.theme || 'Tema desconhecido',
        })) as Revisao[];

        setRevisoes(mapped);
      }
      setLoading(false);
    };
    fetchRevisoes();
  }, [session]);

  const handleConcluirRevisao = async (id: string) => {
    const { error } = await supabase
      .from('revisions')
      .update({ is_completed: true })
      .eq('id', id);

    if (!error) {
      setRevisoes(prev => prev.map(r => r.id === id ? { ...r, concluida: true } : r));
    }
  };

  const revisoesHoje = revisoes.filter(r => r.data_revisao === todayStr && !r.concluida);
  const revisoesAtrasadas = revisoes.filter(r => r.data_revisao < todayStr && !r.concluida);

  const getRevisoesPorTipo = (tipo: 'D1' | 'D7' | 'D30') => {
    return revisoes
      .filter(r => r.tipo === tipo)
      .sort((a, b) => a.data_revisao.localeCompare(b.data_revisao));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Revisões | DrMeds</title>
        <meta name="description" content="Veja e acompanhe suas revisões do cronograma DrMeds." />
      </Helmet>

      <div className="flex items-center gap-3 mb-6">
        <CalendarCheck2 className="h-6 w-6 text-purple-500" />
        <h1 className="text-2xl font-bold text-yellow-400">Minhas Revisões</h1>
      </div>

      {!loading && (
        <div className="mb-6 space-y-2 bg-purple-950/30 border border-purple-700 p-4 rounded-xl">
          {revisoesHoje.length > 0 ? (
            <p className="text-green-400">
              Hoje você deve revisar: {revisoesHoje.map(r => r.tema).join(', ')}
            </p>
          ) : (
            <p className="text-muted-foreground">Você não tem revisões para realizar hoje.</p>
          )}

          {revisoesAtrasadas.length > 0 ? (
            <p className="text-red-400">
              Você tem {revisoesAtrasadas.length} revisão{revisoesAtrasadas.length > 1 ? 'es' : ''} atrasada{revisoesAtrasadas.length > 1 ? 's' : ''}!
            </p>
          ) : (
            <p className="text-muted-foreground">Você não tem revisões atrasadas.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['D1', 'D7', 'D30'].map(tipo => (
          <div key={tipo}>
            <h2 className="text-lg font-semibold text-purple-300 mb-2">Revisão {tipo}</h2>
            <div className="space-y-2">
              {getRevisoesPorTipo(tipo as 'D1' | 'D7' | 'D30').map(rev => (
                <div
                  key={rev.id}
                  className={`border border-border p-3 rounded-md transition-colors cursor-pointer hover:bg-muted/40 ${
                    !rev.concluida && rev.data_revisao < todayStr ? 'bg-red-900/30 border-red-600 animate-pulse' : 'bg-card'
                  }`}
                  onClick={() => navigate(`/meu-caderno/tema/${rev.study_plan_id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-medium">{rev.tema}</span>
                      <span className="text-xs text-muted-foreground">{rev.tipo} — {new Date(rev.data_revisao).toLocaleDateString()}</span>
                    </div>
                    {!rev.concluida && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConcluirRevisao(rev.id);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Concluir
                      </Button>
                    )}
                  </div>

                  {!rev.concluida && rev.data_revisao < todayStr && (
                    <div className="text-xs text-red-400 flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3 h-3" /> Revisão atrasada
                    </div>
                  )}
                </div>
              ))}
              {getRevisoesPorTipo(tipo as 'D1' | 'D7' | 'D30').length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma revisão {tipo}.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisoesPage;
