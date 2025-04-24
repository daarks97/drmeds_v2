import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: React.ReactNode;
  isAuthRoute?: boolean; // para rotas como /login
  isPublic?: boolean;    // para rotas públicas como /sobre
}

const ProtectedRoute = ({ children, isAuthRoute = false, isPublic = false }: Props) => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Erro ao verificar usuário:", error.message);
          if (!isPublic && !isAuthRoute) navigate('/login');
          return;
        }

        if (user && isAuthRoute && !hasRedirected.current) {
          hasRedirected.current = true;
          navigate('/');
        } else if (!user && !isAuthRoute && !isPublic && !hasRedirected.current) {
          hasRedirected.current = true;
          navigate('/login');
        }
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (hasRedirected.current) return;

      if (session?.user && isAuthRoute) {
        hasRedirected.current = true;
        navigate('/');
      } else if (!session?.user && !isAuthRoute && !isPublic) {
        hasRedirected.current = true;
        navigate('/login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, isAuthRoute, isPublic]);

  if (checkingAuth && !isPublic) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400 text-sm">
        Verificando acesso...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
