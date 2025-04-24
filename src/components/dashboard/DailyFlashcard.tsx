import React, { useEffect, useState } from "react";
import { fetchFlashcardDoDia } from "@/lib/services/flashcardsService";

const DailyFlashcard = () => {
  const [flashcard, setFlashcard] = useState<{ tema: string; conteudo: string } | null>(null);

  useEffect(() => {
    const loadFlashcard = async () => {
      const data = await fetchFlashcardDoDia();
      if (data) setFlashcard(data);
    };
    loadFlashcard();
  }, []);

  if (!flashcard) return null;

  return (
    <div className="bg-amber-100 rounded-xl p-6 shadow-md border border-amber-200">
      <div className="text-center space-y-3">
        <span className="text-4xl">💡</span>
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-amber-900">Flashcard do dia: {flashcard.tema}</h3>
          <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">
            {flashcard.conteudo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyFlashcard;
