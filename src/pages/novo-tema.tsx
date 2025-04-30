import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

const NovoTema = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [saving, setSaving] = useState(false);

  const handleSalvar = async () => {
    if (!theme || !discipline || !date) {
      toast({ title: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      toast({ title: 'Usuário não autenticado.', variant: 'destructive' });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('study_plans').insert({
      user_id: userId,
      theme,
      discipline,
      planned_date: date,
      is_completed: false
    });

    setSaving(false);

    if (error) {
      toast({ title: 'Erro ao salvar tema.', variant: 'destructive' });
    } else {
      toast({ title: 'Tema salvo com sucesso!' });
      navigate('/planner');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Novo Tema | DrMeds</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6 text-yellow-400">📚 Novo Tema de Estudo</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="tema">Tema</Label>
          <Input id="tema" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex: AVC isquêmico" />
        </div>

        <div>
          <Label htmlFor="disciplina">Disciplina</Label>
          <Input id="disciplina" value={discipline} onChange={(e) => setDiscipline(e.target.value)} placeholder="Ex: Neurologia" />
        </div>

        <div>
          <Label htmlFor="data">Data planejada</Label>
          <Input id="data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4" onClick={handleSalvar} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Tema'}
        </Button>
      </div>
    </div>
  );
};

export default NovoTema;
