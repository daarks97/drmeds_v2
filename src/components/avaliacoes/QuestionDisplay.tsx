import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface QuestionData {
  id: string;
  enunciado: string;
  alternativas: Record<string, string>;
  correta: string;
  tema: string;
}

interface QuestionDisplayProps {
  question: QuestionData;
  isAnswered: boolean;
  selectedAnswer: string | null;
  onAnswer: (letra: string) => void;
}

const QuestionDisplay = ({
  question,
  isAnswered,
  selectedAnswer,
  onAnswer,
}: QuestionDisplayProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
      <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap mb-6">
        {question.enunciado}
      </p>

      <div className="grid gap-3">
        {Object.entries(question.alternativas).map(([letra, texto]) => {
          const isCorrect = letra === question.correta;
          const isSelected = letra === selectedAnswer;

          let variant: "default" | "outline" | "destructive" = "outline";
          if (isAnswered) {
            if (isCorrect) {
              variant = "default";
            } else if (isSelected) {
              variant = "destructive";
            }
          }

          return (
            <Button
              key={letra}
              variant={variant}
              onClick={() => onAnswer(letra)}
              disabled={isAnswered}
              aria-pressed={isSelected}
              className={`justify-start text-left h-auto py-3 px-4 space-x-2 ${
                isAnswered && isCorrect ? "bg-green-500 text-white hover:bg-green-600" : ""
              } ${isAnswered && isSelected && !isCorrect ? "bg-red-100 text-red-700" : ""}`}
            >
              <span className="font-bold">{letra}.</span>
              <span className="whitespace-pre-wrap flex-1">{texto}</span>

              {/* Ícones de feedback visual */}
              {isAnswered && isCorrect && <Check className="w-4 h-4 text-white" />}
              {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-red-600" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
