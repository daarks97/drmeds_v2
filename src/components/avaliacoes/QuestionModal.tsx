import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuestionsModal, useExamQuestions } from '@/hooks/avaliacoes/useQuestionsModal';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import confetti from "canvas-confetti";

type QuestionData = {
  id?: string;
  questao_id?: string;
  enunciado: string;
  alternativas: Record<string, string>;
  correta: string;
  tema: string;
  [key: string]: any;
};

const QuestionModal = () => {
  const { isOpen, prova, ano, onlyWrong, closeQuestionsModal } = useQuestionsModal();
  const { data: questionsData = [], isLoading } = useExamQuestions(prova, ano, onlyWrong);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const questions: QuestionData[] = useMemo(() => {
    return questionsData.map((q) => ({
      ...q,
      alternativas: q.alternativas as Record<string, string>
    }));
  }, [questionsData]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [isOpen]);

  const handleAnswer = async (alternativa: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(alternativa);
    setIsAnswered(true);

    const isCorrect = alternativa === currentQuestion.correta;

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const questaoId = currentQuestion.questao_id || currentQuestion.id;
      if (!questaoId) throw new Error("ID da questão não encontrado");

      const { error } = await supabase.from('respostas_questoes').insert({
        questao_id: questaoId,
        user_id: user.id,
        alternativa_marcada: alternativa,
        correta: currentQuestion.correta,
        tema: currentQuestion.tema
      });

      if (error) throw error;

      toast({
        title: isCorrect ? "Resposta correta!" : "Resposta incorreta",
        description: isCorrect ? "Parabéns! 🎉" : `A resposta correta era ${currentQuestion.correta}`,
        variant: isCorrect ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar resposta",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      closeQuestionsModal();
    }
  };

  if (!currentQuestion || isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeQuestionsModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {prova} {ano} - Questão {currentIndex + 1}/{questions.length}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Progress value={progress} className="mb-6" />

          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-100 whitespace-pre-wrap">
              {currentQuestion.enunciado}
            </p>

            <div className="grid gap-3">
              {Object.entries(currentQuestion.alternativas).map(([letra, texto]) => {
                const isCorrect = letra === currentQuestion.correta;
                const isSelected = letra === selectedAnswer;

                return (
                  <Button
                    key={letra}
                    variant={
                      isAnswered
                        ? isCorrect
                          ? "default"
                          : isSelected
                          ? "destructive"
                          : "outline"
                        : "outline"
                    }
                    className={`justify-start text-left h-auto py-3 px-4 ${
                      isAnswered && isCorrect
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : ""
                    } ${isAnswered && isSelected && !isCorrect ? "bg-red-100 text-red-700" : ""}`}
                    onClick={() => handleAnswer(letra)}
                    disabled={isAnswered}
                  >
                    <span className="font-bold mr-2">{letra}.</span>
                    <span className="whitespace-pre-wrap">{texto}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext}>
                {currentIndex < questions.length - 1 ? "Próxima" : "Finalizar"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
