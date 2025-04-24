import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import QuestionDisplay from "@/components/avaliacoes/QuestionDisplay";
import QuestionNavigation from "@/components/avaliacoes/QuestionNavigation";
import { useQuestions } from "@/hooks/avaliacoes/useQuestions";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

const AvaliacaoSlug = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const formattedSlug = slug?.toLowerCase() || "";
  const { questions, isLoading } = useQuestions(formattedSlug);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [acertos, setAcertos] = useState(0);

  const handleAnswer = async (alternativa: string) => {
    if (isAnswered || !questions[currentIndex]) return;

    setSelectedAnswer(alternativa);
    setIsAnswered(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro ao salvar resposta",
          description: "Você precisa estar logado para responder questões",
          variant: "destructive",
        });
        return;
      }

      const currentQuestion = questions[currentIndex];
      const acertou = alternativa === currentQuestion.correta;

      const { error } = await supabase.from("respostas_questoes").insert({
        questao_id: currentQuestion.id,
        user_id: user.id,
        alternativa_marcada: alternativa,
        correta: currentQuestion.correta,
        tema: currentQuestion.tema,
      });

      if (error) throw error;

      if (acertou) {
        setAcertos((prev) => prev + 1);
        await supabase.rpc('add_user_xp', {
          user_uuid: user.id,
          xp_amount: 2
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar resposta",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="container max-w-4xl py-8 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Avaliação - {slug?.toUpperCase()} | DrMeds</title>
        <meta name="description" content={`Prova de ${slug?.toUpperCase()} com questões para treino`} />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4 text-yellow-400">
          {slug?.replace("-", " ").toUpperCase()} — Questão {currentIndex + 1}/{questions.length}
        </h1>
        <Progress value={progress} className="mb-4" />
      </div>

      {currentQuestion && (
        <div className="space-y-8">
          <QuestionDisplay
            question={currentQuestion}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
          />

          <QuestionNavigation
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            isAnswered={isAnswered}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      )}

      {currentIndex === questions.length - 1 && isAnswered && (
        <div className="text-center mt-10">
          <p className="text-green-400 text-lg font-bold mb-2">
            ✅ Avaliação concluída!
          </p>
          <p className="text-yellow-400 text-lg mb-4">
            Você acertou {acertos} de {questions.length} questões (
            {Math.round((acertos / questions.length) * 100)}%)
          </p>
          <Button
            onClick={() => (window.location.href = "/avaliacoes")}
            className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold"
          >
            Voltar para lista de provas
          </Button>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoSlug;
