// src/lib/services/flashcardsService.ts
import { supabase } from "@/integrations/supabase/client";

export const fetchFlashcardDoDia = async () => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("flashcards_publicos")
    .select("*")
    .eq("data", today)
    .single();

  if (error) {
    console.error("Erro ao buscar flashcard do dia:", error);
    return null;
  }

  return data;
};
