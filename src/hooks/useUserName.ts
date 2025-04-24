import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserName = () => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setUserName('Usuário');
          return;
        }

        // Prioriza nome do metadata
        const metaName = user.user_metadata?.name;
        if (metaName) {
          setUserName(metaName);
          return;
        }

        // Senão, tenta na tabela `users`
        const { data } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();

        if (data?.name) {
          setUserName(data.name);
        } else {
          const emailFallback = user.email?.split('@')[0] || 'Usuário';
          setUserName(emailFallback);
        }
      } catch (err) {
        setError(err as Error);
        setUserName('Usuário');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, []);

  return { userName, isLoading, error };
};
