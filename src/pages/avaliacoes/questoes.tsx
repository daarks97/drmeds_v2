import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';

const AvaliacaoQuestoes = () => {
  const { provaSlug } = useParams<{ provaSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [prova, ano] = React.useMemo(() => {
    if (!provaSlug) return ['', 0];
    const parts = provaSlug.toLowerCase().split('-');
    const ano = parseInt(parts[parts.length - 1]);
    const prova = parts.slice(0, parts.length - 1).join('-');
    return [prova, ano];
  }, [provaSlug]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!prova || !ano) {
        navigate('/avaliacoes');
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('questoes')
          .select('*')
          .eq('prova', prova)
          .eq('ano', ano);

        if (error) throw error;
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          toast({
            title: 'Não foram encontradas questões',
            description: `Não há questões disponíveis para ${prova} ${ano}`,
            variant: 'destructive',
          });
          navigate('/avaliacoes');
        }
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
        toast({
          title: 'Erro ao carregar questões',
          description: 'Ocorreu um erro ao buscar as questões desta avaliação',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [prova, ano, navigate, toast]);

  const handleAnswer = (alternativa) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: alternativa });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleFinish = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      const missing = questions.length - Object.keys(selectedAnswers).length;
      toast({
        title: 'Avaliação incompleta',
        description: `${missing} questões não respondidas. Deseja continuar?`,
        action: (
          <Button variant="destructive" size="sm" onClick={submitAnswers}>
            Finalizar mesmo assim
          </Button>
        ),
      });
      return;
    }
    await submitAnswers();
  };

  const submitAnswers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Usuário não autenticado',
          description: 'É preciso estar logado para salvar suas respostas',
          variant: 'destructive',
        });
        return;
      }
      const answers = Object.entries(selectedAnswers).map(([index, alternativa]) => {
        const q = questions[parseInt(index)];
        return {
          questao_id: q.id,
          user_id: user.id,
          alternativa_marcada: alternativa,
          correta: q.correta,
          tema: q.tema,
        };
      });
      const { error } = await supabase.from('respostas_questoes').insert(answers);
      if (error) throw error;
      toast({
        title: 'Avaliação concluída',
        description: 'Suas respostas foram salvas com sucesso!',
      });
      navigate('/avaliacoes');
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      toast({
        title: 'Erro ao salvar respostas',
        description: 'Ocorreu um erro ao salvar suas respostas',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-purple-800">Carregando questões...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (!currentQuestion) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Nenhuma questão disponível</h1>
        <Button className="mt-4" onClick={() => navigate('/avaliacoes')}>
          Voltar para Avaliações
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Helmet>
        <title>Avaliação: {prova} {ano} | DrMeds</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100">{prova} {ano}</h1>
        <div className="text-sm font-medium text-gray-400">
          Questão {currentIndex + 1} de {questions.length}
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-8" />

      <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-700 mb-6">
        <p className="text-lg text-gray-200 mb-6 whitespace-pre-wrap leading-relaxed">
          {currentQuestion.enunciado}
        </p>

        <div className="space-y-3 mt-6">
          {Object.entries(currentQuestion.alternativas).map(([letra, texto]) => (
            <Button
              key={letra}
              variant={selectedAnswers[currentIndex] === letra ? 'default' : 'outline'}
              className={`w-full justify-start text-left h-auto py-3 px-4 text-gray-100 ${
                selectedAnswers[currentIndex] === letra ? 'bg-purple-600 hover:bg-purple-700' : ''
              }`}
              onClick={() => handleAnswer(letra)}
            >
              <span className="font-bold mr-2">{letra}.</span>
              <span className="whitespace-pre-wrap">{texto}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>

        <div className="flex gap-2">
          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleFinish}>
              <Check className="h-4 w-4 mr-1" /> Finalizar Prova
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Próxima <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvaliacaoQuestoes;
