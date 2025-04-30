import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '@/integrations/supabase/client';
import { FocusTimerWidget } from '@/components/ui/FocusTimerWidget';

import { salvarResumo, buscarResumo } from '@/lib/supabase/resumos';
import { concluirTema } from '@/lib/services/studyPlans_v2/completeStudyPlan';
import { buscarRevisoesDoTema, concluirRevisao } from '@/lib/supabase/manageRevisions';
import { registrarRespostaQuestao } from '@/lib/supabase/questoes';

const TemaEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();

  const [nomeTema, setNomeTema] = useState('Carregando...');
  const [resumoSalvo, setResumoSalvo] = useState('');
  const [revisoes, setRevisoes] = useState<any[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [concluindo, setConcluindo] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [respondida, setRespondida] = useState(false);
  const [modoTimer, setModoTimer] = useState<'contador' | 'pomodoro'>('contador');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setResumoSalvo(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!id || !session?.user?.id || !editor) return;

    // Buscar nome do tema (title) no Supabase usando ID
    supabase
      .from('study_plans')
      .select('title')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) return setNomeTema('Tema não encontrado');
        setNomeTema(data.title);
        buscarResumo(session.user.id, data.title).then((res) => {
          if (res?.conteudo) {
            editor.commands.setContent(res.conteudo);
            setResumoSalvo(res.conteudo);
          }
        });
        buscarRevisoesDoTema(session.user.id, data.title).then((res) => {
          if (res?.revisoes) setRevisoes(res.revisoes);
        });
      });
  }, [id, session, editor]);

  const handleSalvarResumo = async () => {
    if (!session?.user?.id || !id || nomeTema === 'Carregando...') return;
    setSalvando(true);
    const res = await salvarResumo(session.user.id, nomeTema, resumoSalvo);
    setSalvando(false);
    toast({
      title: res.success ? 'Resumo salvo com sucesso!' : 'Erro ao salvar resumo',
      variant: res.success ? 'default' : 'destructive',
    });
  };

  const handleConcluirTema = async () => {
    if (!id) return;
    setConcluindo(true);
    try {
      await concluirTema(id);
      toast({ title: 'Tema concluído! Revisões agendadas.' });
      navigate('/meu-caderno');
    } catch (err) {
      toast({ title: 'Erro ao concluir tema', variant: 'destructive' });
    }
    setConcluindo(false);
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
    toast({ title: 'Revisão marcada como feita!' });
  };

  const handleResposta = async (alternativa: string) => {
    if (!session?.user?.id || respondida) return;
    setRespondida(true);
    const acertou = alternativa === 'C';
    await registrarRespostaQuestao({
      userId: session.user.id,
      questaoId: 'q1-avc',
      tema: nomeTema,
      acertou,
    });
    toast({ title: acertou ? '✅ Acertou! +2XP' : '❌ Errou! Tente de novo.' });
  };

  return (
    <div className="container py-6 bg-background text-foreground min-h-screen">
      <Button variant="outline" onClick={() => navigate('/meu-caderno')} className="mb-6">
        Voltar ao Caderno
      </Button>

      <div className="space-y-6 max-w-4xl mx-auto bg-card rounded-2xl shadow-md p-8 border border-border">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-yellow-400">{nomeTema}</h1>
          <p className="text-sm text-muted-foreground">Explore o tema no seu tempo, do seu jeito.</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-muted-foreground">⏱️ Selecione o modo de cronômetro:</div>
            <div className="flex gap-2">
              <Button
                variant={modoTimer === 'contador' ? 'default' : 'outline'}
                onClick={() => setModoTimer('contador')}
              >
                Contador
              </Button>
              <Button
                variant={modoTimer === 'pomodoro' ? 'default' : 'outline'}
                onClick={() => setModoTimer('pomodoro')}
              >
                Pomodoro
              </Button>
            </div>
          </div>
          <FocusTimerWidget mode={modoTimer} />
        </div>

        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="bg-muted text-muted-foreground border border-border">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="revisar">Revisar</TabsTrigger>
            <TabsTrigger value="questoes">Questões</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo">
            {editor && (
              <div className="flex gap-2 mb-2 text-sm text-muted-foreground">
                <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>B</Button>
                <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()}>I</Button>
                <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button>
                <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
                <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()}>• Lista</Button>
              </div>
            )}

            <div className="bg-white text-black border border-border rounded-md p-4 min-h-[300px]">
              {editor ? <EditorContent editor={editor} /> : <p>Carregando editor...</p>}
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSalvarResumo}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" className="border-border" disabled>
                Exportar PDF (em breve)
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConcluirTema}
                disabled={concluindo}
              >
                {concluindo ? 'Concluindo...' : 'Concluir Tema'}
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
                      {rev.tipo} – {new Date(rev.data_revisao).toLocaleDateString()} –{' '}
                      {rev.concluida ? (
                        <span className="text-green-400">Concluído</span>
                      ) : (
                        <span className="text-red-400">Pendente</span>
                      )}
                    </div>
                    {!rev.concluida && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={atualizando}
                        onClick={() => handleConcluirRevisao(rev.id)}
                        className="border-border"
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
                <p className="mb-2">
                  1. Qual o principal sintoma de AVC isquêmico em artéria cerebral média esquerda?
                </p>
                <div className="space-y-2">
                  {['Afasia', 'Hemianopsia', 'Hemiparesia direita', 'Disartria'].map((alt, idx) => (
                    <Button
                      key={alt}
                      onClick={() => handleResposta(String.fromCharCode(65 + idx))}
                      disabled={respondida}
                      variant="outline"
                      className="w-full text-left justify-start border-border"
                    >
                      {String.fromCharCode(65 + idx)}) {alt}
                    </Button>
                  ))}
                </div>
              </li>
            </ul>

            <div className="mt-6 flex justify-center">
              <Button
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => navigate(`/avaliacoes?tema=${encodeURIComponent(nomeTema)}`)}
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
