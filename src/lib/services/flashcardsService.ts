
import { supabase } from "@/integrations/supabase/client";

export async function fetchFlashcardDoDia() {
  // Obter a data de hoje
  const hoje = new Date().toISOString().split('T')[0];
  
  try {
    // Buscar flashcard do dia atual
    const { data, error } = await supabase
      .from('flashcards_publicos')
      .select('tema, conteudo')
      .eq('data', hoje)
      .single();
    
    if (error) {
      console.error("Erro ao buscar flashcard do dia:", error);
      // Se não encontrar para hoje, busca o flashcard mais recente
      const { data: recentData } = await supabase
        .from('flashcards_publicos')
        .select('tema, conteudo')
        .order('data', { ascending: false })
        .limit(1)
        .single();
      
      return recentData;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar flashcard:", error);
    return null;
  }
}
