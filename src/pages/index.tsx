import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDashboard } from '@/hooks/useDashboard';
import { useUserAchievements } from '@/hooks/useUserAchievements';
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
  const { checkAutoAchievements } = useUserAchievements();
  const { studyTopic } = useDashboard();
  const { userXP } = useUserXP();
  const weeklyProgress = useWeeklyProgress();
  const { todayRevisions } = useRevisions();

  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const [userName, setUserName] = useState('');
  const [weeklyStudyData, setWeeklyStudyData] = useState<{ day: string; minutes: number }[]>([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setRandomQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

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
    checkAutoAchievements();
  }, [checkAutoAchievements]);

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
        {/* Conteúdo renderizado aqui conforme acima */}
      </main>
    </div>
  );
};

export default Index;
