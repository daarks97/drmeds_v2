import React from "react";
import { Button } from "@/components/ui/button";

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionNavigation = ({
  currentIndex,
  totalQuestions,
  isAnswered,
  onPrevious,
  onNext,
}: QuestionNavigationProps) => {
  return (
    <div className="flex justify-between items-center gap-4 mt-6 flex-wrap">
      <Button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        variant="outline"
        aria-label="Questão anterior"
      >
        Anterior
      </Button>

      <span className="text-sm text-gray-600 dark:text-gray-300">
        Questão {currentIndex + 1} de {totalQuestions}
      </span>

      <Button
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1 || !isAnswered}
        aria-label="Próxima questão"
      >
        Próxima
      </Button>
    </div>
  );
};

export default QuestionNavigation;
