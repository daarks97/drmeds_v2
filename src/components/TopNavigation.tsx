import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast"; // Corrigido a importação
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserRound } from "lucide-react";

const TopNavigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado com sucesso" }); // Agora `toast` está corretamente acessado
    navigate("/login");
  };

  if (user === null) return null;

  return (
    <nav className="fixed w-full top-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/home" className="text-xl font-bold text-purple-700">DrMeds</Link>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center space-x-4">
              <Link to="/planejamento" className="text-gray-600 hover:text-purple-600 transition-colors">
                Planejamento
              </Link>
              <Link to="/meu-caderno" className="text-gray-600 hover:text-purple-600 transition-colors">
                Meu Caderno
              </Link>
              <Link to="/avaliacoes" className="text-gray-600 hover:text-purple-600 transition-colors">
                Avaliações
              </Link>
              <Link to="/revisions" className="text-gray-600 hover:text-purple-600 transition-colors">
                Revisões
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/perfil')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              <UserRound className="h-5 w-5" />
              <span>Perfil</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
