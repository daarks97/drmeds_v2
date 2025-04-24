import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDashboard } from '@/hooks/useDashboard';
import { useAchievements } from '@/hooks/useAchievements';
import { useUserXP } from '@/hooks/useUserXP';
import { useWeeklyProgress } from '@/hooks/useWeeklyProgress';
import { useRevisions } from '@/hooks/useRevisions';
import { supabase } from '@/integrations/supabase/client';

import StudyModal from '@/components/dashboard/StudyModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, RefreshCw, Brain } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MOTIVATIONAL_QUOTES = [
  "Grandes médicos se constroem nos pequenos hábitos.",
  "Você não precisa estudar o dia todo. Só precisa estudar hoje.",
  "A rotina vence o talento quando o talento não tem rotina."
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { checkStudyAchievements } = useAchievements();
  const { studyTopic } = useDashboard();
  const { userXP } = useUserXP();
  const weeklyProgress = useWeeklyProgress();
  const { todayRevisions } = useRevisions();

  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const [userName, setUserName] = useState('');
  const [weeklyStudyData, setWeeklyStudyData] = useState<{ day: string; minutes: number }[]>([]);

  // Frase motivacional aleatória
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setRandomQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  // Nome do usuário
  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();
        setUserName(data?.name || user.email?.split('@')[0] || 'Estudante');
      }
    };
    getUserName();
  }, []);

  // Dados da semana para gráfico
  useEffect(() => {
    const getWeeklyStudyData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const { data: studyPlans } = await supabase
        .from('study_plans')
        .select('planned_date, study_time_minutes')
        .gte('planned_date', monday.toISOString().split('T')[0])
        .lte('planned_date', sunday.toISOString().split('T')[0]);

      const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      const weekData = daysOfWeek.map((day, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        const dateStr = date.toISOString().split('T')[0];
        const dayPlans = studyPlans?.filter(p => p.planned_date === dateStr) || [];
        const totalMinutes = dayPlans.reduce((sum, p) => sum + (p.study_time_minutes || 0), 0);
        return { day, minutes: totalMinutes };
      });

      setWeeklyStudyData(weekData);
    };

    getWeeklyStudyData();
  }, []);

  useEffect(() => {
    checkStudyAchievements();
  }, [checkStudyAchievements]);

  // Cálculo de progresso de XP
  const currentLevel = userXP?.level || 1;
  const nextLevelXP = Math.pow((currentLevel + 1) * 10, 2);
  const currentXP = userXP?.xp || 0;
  const xpProgress = Math.min(100, Math.floor((currentXP / nextLevelXP) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Dashboard | DrMeds</title>
        <meta name="description" content="Acompanhe sua evolução, XP e estudos no painel central do DrMeds." />
      </Helmet>

      <main className="container max-w-4xl mx-auto py-8 px-6">
        {/* Boas-vindas */}
        <div className="bg-card rounded-2xl p-6 shadow mb-6 border border-border">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-yellow-400/30">
              <AvatarImage src="/placeholder.svg" alt={userName} />
              <AvatarFallback className="bg-muted text-yellow-400">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">
                👋 Olá, {userName}! Pronto pra mais um dia de evolução no DrMeds?
              </h1>
            </div>
          </div>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tema do Dia */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Book className="h-6 w-6" />
                Tema do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="text-lg font-medium">{studyTopic?.name || "Nenhum tema agendado"}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => studyTopic ? navigate(`/meu-caderno/tema/${studyTopic.id}`) : setStudyModalOpen(true)}
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
              >
                Estudar Agora
              </Button>
            </CardFooter>
          </Card>

          {/* Revisões do Dia */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <RefreshCw className="h-6 w-6" />
                Revisão do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="text-lg font-medium">
                Você tem {todayRevisions?.length || 0} revisões agendadas
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate('/revisions')}
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
              >
                Ver Revisões
              </Button>
            </CardFooter>
          </Card>

          {/* XP de Hoje */}
          <Card className="bg-card border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Brain className="h-6 w-6" />
                XP de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="text-lg font-medium">
                {`Você ganhou ${currentXP - (currentLevel * 100)} XP hoje`}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Nível {currentLevel}</span>
                  <span>Nível {currentLevel + 1}</span>
                </div>
                <Progress
                  value={xpProgress}
                  className="h-3"
                  indicatorClassName="bg-yellow-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Consistência */}
        <Card className="bg-card border border-border mb-6">
          <CardHeader>
            <CardTitle className="text-center text-xl text-yellow-400">Sua consistência esta semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="day" stroke="#71717a" />
                  <YAxis stroke="#71717a" unit="min" />
                  <Tooltip
                    formatter={(value) => [`${value} minutos`, 'Tempo estudado']}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                    labelStyle={{ color: '#e4e4e7' }}
                  />
                  <Bar dataKey="minutes" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Frase motivacional */}
        <div className="text-center py-8">
          <p className="text-xl font-medium text-muted-foreground italic">"{randomQuote}"</p>
        </div>

        <StudyModal open={studyModalOpen} onOpenChange={setStudyModalOpen} />
      </main>
    </div>
  );
};

export default Index;
