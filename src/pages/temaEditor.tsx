import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from "@supabase/auth-helpers-react";
import { salvarResumo, buscarResumo } from "@/lib/supabase/resumos";
import { concluirTema } from "@/lib/supabase/completeStudyPlan";
import { buscarRevisoesDoTema, concluirRevisao } from "@/lib/supabase/manageRevisions";
import { registrarRespostaQuestao } from "@/lib/supabase/questoes";

const TemaEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const nomeTema = id?.toString().replace(/-/g, " ") || "Carregando...";
  const [resumo, setResumo] = useState("");
  const session = useSession();
  const [salvando, setSalvando] = useState(false);
  const [concluindo, setConcluindo] = useState(false);
  const [revisoes, setRevisoes] = useState<any[]>([]);
  const [atualizando, setAtualizando] = useState(false);
  const [respondida, setRespondida] = useState(false);

  const handleConcluirTema = async () => {
    if (!session?.user?.id) return;
    setConcluindo(true);
    const res = await concluirTema(session.user.id, nomeTema);
    setConcluindo(false);
    if (res.success) {
      alert("Tema concluído! Revisões agendadas.");
    } else {
      alert("Erro ao concluir tema.");
    }
  };

  const handleConcluirRevisao = async (id: string) => {
    setAtualizando(true);
    const res = await concluirRevisao(id);

    const revisaoConcluida = revisoes.find((r) => r.id === id);
    const atualizada = revisaoConcluida
      ? { ...revisaoConcluida, concluida: true, data_conclusao: new Date().toISOString() }
      : null;

    setRevisoes((prev) => {
      const novaLista = prev.map((r) => (r.id === id ? atualizada : r));
      return res.nova ? [...novaLista, res.nova] : novaLista;
    });

    setAtualizando(false);
  };

  useEffect(() => {
    if (session?.user?.id && nomeTema !== "Carregando...") {
      buscarResumo(session.user.id, nomeTema).then((res) => {
        setResumo(res.conteudo);
      });
    }
  }, [session, nomeTema]);

  useEffect(() => {
    if (session?.user?.id && nomeTema !== "Carregando...") {
      buscarRevisoesDoTema(session.user.id, nomeTema).then((res) => {
        if (res.revisoes) setRevisoes(res.revisoes);
      });
    }
  }, [session, nomeTema]);

  const handleSalvarResumo = async () => {
    if (!session?.user?.id) return;
    setSalvando(true);
    const res = await salvarResumo(session.user.id, nomeTema, resumo);
    setSalvando(false);
    if (res.success) {
      alert("Resumo salvo com sucesso!");
    } else {
      alert("Erro ao salvar resumo.");
    }
  };

  const handleResposta = async (alternativa: string) => {
    if (!session?.user?.id || respondida) return;

    setRespondida(true);

    const acertou = alternativa === "C";
    await registrarRespostaQuestao({
      userId: session.user.id,
      questaoId: "q1-avc",
      tema: nomeTema,
      acertou,
    });

    alert(acertou ? "✅ Acertou! +2XP" : "❌ Errou! Tente de novo.");
  };

  return (
    <div className="container py-6 bg-background text-foreground min-h-screen">
      <Button 
        variant="outline" 
        onClick={() => navigate('/meu-caderno')}
        className="mb-6"
      >
        Voltar ao Caderno
      </Button>
      
      <div className="space-y-6 max-w-4xl mx-auto bg-card rounded-2xl shadow-md p-8 border border-border">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-yellow-400">{nomeTema}</h1>
          <p className="text-sm text-muted-foreground">
            Explore o tema no seu tempo, do seu jeito.
          </p>
        </div>

        <Tabs defaultValue="resumo" className="w-full">
          <TabsList>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="revisar">Revisar</TabsTrigger>
            <TabsTrigger value="questoes">Questões</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo">
            <div className="flex justify-between items-center mb-4 text-muted-foreground text-sm">
              <div>🧠 Tempo estimado: 25 minutos</div>
              <div>⏱️ Pomodoro: <span className="text-green-500">25:00</span></div>
            </div>
            <Textarea
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Escreva aqui seu resumo, esquemas, tópicos..."
              className="w-full min-h-[300px] bg-muted border border-border"
            />
            <div className="mt-4 flex gap-3">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSalvarResumo}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="outline">Exportar PDF</Button>

              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConcluirTema}
                disabled={concluindo}
              >
                {concluindo ? "Concluindo..." : "Concluir Tema"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="revisar">
            <h2 className="text-lg font-semibold mb-4 text-yellow-400">📆 Revisões Programadas</h2>
            {revisoes.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma revisão agendada ainda.</p>
            ) : (
              <ul className="space-y-3">
                {revisoes.map((rev) => (
                  <li
                    key={rev.id}
                    className="bg-muted p-4 rounded-lg border border-border flex justify-between items-center"
                  >
                    <div>
                      {rev.tipo} – {new Date(rev.data_revisao).toLocaleDateString()} –{" "}
                      {rev.concluida ? (
                        <span className="text-green-500">Concluído</span>
                      ) : (
                        <span className="text-red-500">Pendente</span>
                      )}
                    </div>
                    {!rev.concluida && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={atualizando}
                        onClick={() => handleConcluirRevisao(rev.id)}
                      >
                        Marcar como feita
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="questoes">
            <h2 className="text-lg font-semibold mb-4 text-yellow-400">📝 Questões do Tema</h2>
            <ul className="space-y-3">
              <li className="bg-muted p-4 rounded-lg border border-border">
                <p className="mb-2">1. Qual o principal sintoma de AVC isquêmico em artéria cerebral média esquerda?</p>
                <div className="space-y-2">
                  <Button onClick={() => handleResposta("A")} disabled={respondida} variant="outline" className="w-full text-left justify-start">A) Afasia</Button>
                  <Button onClick={() => handleResposta("B")} disabled={respondida} variant="outline" className="w-full text-left justify-start">B) Hemianopsia</Button>
                  <Button onClick={() => handleResposta("C")} disabled={respondida} variant="outline" className="w-full text-left justify-start">C) Hemiparesia direita</Button>
                  <Button onClick={() => handleResposta("D")} disabled={respondida} variant="outline" className="w-full text-left justify-start">D) Disartria</Button>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex justify-center">
              <Button
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => navigate(`/questoes?tema=${encodeURIComponent(nomeTema)}`)}
              >
                🔍 Ver todas as questões sobre "{nomeTema}"
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TemaEditor;
