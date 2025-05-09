import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type QuestionData = {
  id: string;
  enunciado: string;
  alternativas: Record<string, string>;
  correta: string;
  tema: string;
};

export const useQuestions = (slug: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!slug) return;

      // ⚠️ Corrigido: parsing seguro do slug
      const parts = slug.split('-');
      const ano = parseInt(parts[parts.length - 1]);
      const provaSlug = parts.slice(0, parts.length - 1).join('-');
      const prova = provaSlug.toUpperCase(); // ex: USP-SP

      if (!prova || isNaN(ano)) {
        toast({
          title: "URL inválida",
          description: "Não foi possível identificar a prova",
          variant: "destructive",
        });
        navigate('/avaliacoes');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
  .from('questoes')
  .select('*')
  .ilike('prova', prova)
  .eq('ano', ano);

          console.log('🎯 Buscando questões:', { prova, ano });
console.log('👉 Slug original:', slug);
console.log('✅ Resultado do Supabase:', data);
console.log('❌ Erro do Supabase:', error);


        if (error) {
          toast({
            title: "Erro ao carregar questões",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (!data || data.length === 0) {
          toast({
            title: "Nenhuma questão encontrada",
            description: `Esta prova (${prova} ${ano}) não possui questões cadastradas`,
            variant: "destructive",
          });
          return;
        }

        const formattedQuestions: QuestionData[] = data.map(q => ({
          id: q.id,
          enunciado: q.enunciado,
          alternativas: q.alternativas as Record<string, string>,
          correta: q.correta,
          tema: q.tema
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao buscar as questões",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [slug, navigate, toast]);

  return { questions, isLoading };
};
