import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NovoTema = () => {
  const navigate = useNavigate();
  const session = useSession();

  const [nomeTema, setNomeTema] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [criando, setCriando] = useState(false);
  const [disciplinasExistentes, setDisciplinasExistentes] = useState<string[]>([]);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      const { data, error } = await supabase
        .from('study_plans')
        .select('discipline')
        .neq('discipline', null);

      if (error) return;
      const unicas = Array.from(new Set(data.map((d: any) => d.discipline))).sort();
      setDisciplinasExistentes(unicas);
    };

    fetchDisciplinas();
  }, []);

  const handleCriarTema = async () => {
    if (!session?.user?.id || !nomeTema || !disciplina || !plannedDate) {
      toast({ title: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }

    
    console.log("📤 Tentando inserir:", {
      user_id: session.user.id,
      theme: nomeTema,
      discipline: disciplina,
      planned_date: plannedDate,
      is_completed: false,
    });

    setCriando(true);
    const { data, error } = await supabase.from('study_plans').insert([
      {
        user_id: session.user.id,
        theme: nomeTema,
        discipline: disciplina,
        planned_date: plannedDate,
        is_completed: false,
      },
    ]).select().single();

    setCriando(false);

    if (error || !data) {
      
      toast({
        title: 'Erro ao criar tema.',
        description: error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Tema criado com sucesso!' });
    navigate('/planejamento');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">Criar Novo Tema</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nome do Tema</label>
          <Input value={nomeTema} onChange={e => setNomeTema(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Disciplina</label>
          <Select value={disciplina} onValueChange={setDisciplina}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma disciplina" />
            </SelectTrigger>
            <SelectContent>
              {disciplinasExistentes.map((disc) => (
                <SelectItem key={disc} value={disc}>{disc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm mb-1">Data planejada</label>
          <Input type="date" value={plannedDate} onChange={e => setPlannedDate(e.target.value)} />
        </div>

        <Button
          type="button"
          onClick={() => {
            console.log("🟢 Botão clicado!");
            handleCriarTema();
          }}
          disabled={criando || !nomeTema || !disciplina || !plannedDate}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {criando ? 'Criando...' : 'Criar Tema'}
        </Button>
      </div>
    </div>
  );
};

export default NovoTema;
