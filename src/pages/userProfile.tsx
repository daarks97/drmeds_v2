import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from "@/components/ui/use-toast"
import { useUserXP } from '@/hooks/useUserXP';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import AchievementsPanel from "@/components/AchievementsPanel";

// Exportação nomeada (não default)
export const Perfil = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Conquistas</h1>
      <AchievementsPanel />
    </div>
  );
};

interface UserData {
  id: string;
  name: string;
  email: string;
  course?: string;
  specialty?: string;
  level?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { userXP } = useUserXP();
  
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          navigate('/login');
          return;
        }
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (error) {
          console.error('Erro ao buscar dados:', error);
          return;
        }
        
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: userData?.name || 'Usuário',
          course: userData?.course,
          specialty: userData?.specialty,
          level: userData?.level
        });
      } catch (error) {
        console.error('Erro no perfil:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao carregar perfil',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [navigate]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Perfil do Usuário | DrMeds</title>
        <meta name="description" content="Gerencie suas informações pessoais e acompanhe seu progresso no DrMeds." />
      </Helmet>

      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8 text-yellow-400">Seu Perfil</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <p>Carregando...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-border">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="font-medium">Curso</h3>
                    <p className="text-foreground">{user?.course || 'Não definido'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Especialidade</h3>
                    <p className="text-foreground">{user?.specialty || 'Não definido'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Nível Acadêmico</h3>
                    <p className="text-foreground">{user?.level || 'Não definido'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-100 text-purple-900 p-4 rounded-lg">
                    <h3 className="text-sm font-medium">Nível</h3>
                    <p className="text-2xl font-bold">{userXP?.level || 1}</p>
                  </div>
                  
                  <div className="bg-blue-100 text-blue-900 p-4 rounded-lg">
                    <h3 className="text-sm font-medium">XP Total</h3>
                    <p className="text-2xl font-bold">{userXP?.xp || 0}</p>
                  </div>
                  
                  <div className="bg-green-100 text-green-900 p-4 rounded-lg">
                    <h3 className="text-sm font-medium">Conquistas</h3>
                    <p className="text-2xl font-bold">--</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleLogout}>
                Sair da Conta
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer currentPage="profile" />
    </div>
  );
};

export default UserProfile;
