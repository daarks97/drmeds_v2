import React, { useEffect, useState } from 'react';
import AchievementsGrid from "@/components/AchievementsGrid";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useUserXP } from '@/hooks/useUserXP';
import { Helmet } from 'react-helmet';
import AchievementsPanel from '@/components/AchievementsPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface UserData {
  id: string;
  name: string;
  email: string;
  course?: string;
  specialty?: string;
  level?: string;
  personalGoal?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openGoalEdit, setOpenGoalEdit] = useState(false);
  const [formData, setFormData] = useState({ course: '', specialty: '', level: '', personalGoal: '' });
  const { userXP } = useUserXP();
  const { achievements } = useUserAchievements();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          navigate('/login');
          return;
        }

        let { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!userData) {
          const { error: insertError } = await supabase.from('users').insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || 'Usuário'
          });

          if (insertError) {
            console.error('Erro ao criar usuário:', insertError);
            toast({ title: 'Erro', description: 'Não foi possível criar o perfil do usuário.' });
            return;
          }

          const { data: newUserData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          userData = newUserData;
        }

        if (error) {
          console.error('Erro ao buscar dados:', error);
          return;
        }

        const userInfo = {
          id: authUser.id,
          email: authUser.email || '',
          name: userData?.name || 'Usuário',
          course: userData?.course,
          specialty: userData?.specialty,
          level: userData?.level,
          personalGoal: userData?.personalGoal || ''
        };

        setUser(userInfo);
        setFormData({
          course: userInfo.course || '',
          specialty: userInfo.specialty || '',
          level: userInfo.level || '',
          personalGoal: userInfo.personalGoal || ''
        });
      } catch (error) {
        console.error('Erro no perfil:', error);
        toast({ title: 'Erro', description: 'Falha ao carregar perfil' });
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

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from('users').update(formData).eq('id', user.id);
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar as alterações.' });
    } else {
      toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso!' });
      setUser({ ...user, ...formData });
      setOpenEdit(false);
      setOpenGoalEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Perfil do Usuário | DrMeds</title>
        <meta name="description" content="Gerencie suas informações pessoais e acompanhe seu progresso no DrMeds." />
      </Helmet>

      <div className="container max-w-4xl mx-auto py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Seu Perfil</h1>
            <p className="text-muted-foreground mt-1">Acompanhe seu progresso e conquistas no DrMeds.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <Card className="bg-card border border-border rounded-2xl shadow-lg">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Informações Pessoais</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setOpenEdit(true)}>Editar Perfil</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-border">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback className="bg-muted text-yellow-400">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Curso</h3>
                    <p className="text-foreground">{user?.course || 'Não definido'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Especialidade</h3>
                    <p className="text-foreground">{user?.specialty || 'Não definido'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Nível Acadêmico</h3>
                    <p className="text-foreground">{user?.level || 'Não definido'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-2xl shadow-lg">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Meta Pessoal</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setOpenGoalEdit(true)}>Editar Meta</Button>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-sm">{user?.personalGoal || 'Nenhuma meta definida.'}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Progresso Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Temas Concluídos</p>
                <Progress value={40} />
                <p className="text-xs text-muted-foreground mt-1">{12} de {30} temas concluídos</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-2xl shadow-lg">
  <CardHeader>
    <CardTitle>Minhas Conquistas</CardTitle>
  </CardHeader>
  <CardContent>
    <AchievementsGrid achievements={achievements} />
  </CardContent>
</Card>

            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleLogout}>Sair da Conta</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Curso" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} />
            <Input placeholder="Especialidade" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} />
            <Input placeholder="Nível Acadêmico" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenEdit(false)} variant="ghost">Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openGoalEdit} onOpenChange={setOpenGoalEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Meta Pessoal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Minha meta é..." value={formData.personalGoal} onChange={(e) => setFormData({ ...formData, personalGoal: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenGoalEdit(false)} variant="ghost">Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
