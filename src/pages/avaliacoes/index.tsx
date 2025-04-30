import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { useSession } from "@supabase/auth-helpers-react";

interface Avaliacao {
  id: string;
  prova: string;
  ano: number;
  quantidade: number;
  acertos: number;
}

export default function ListaAvaliacoes() {
  const [provas, setProvas] = useState<Avaliacao[]>([]);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const session = useSession();

  useEffect(() => {
    const fetchDesempenho = async () => {
      if (!session?.user?.id) return;

      // Pega desempenho do usuário
      const { data: desempenho } = await supabase
        .from("desempenho_por_prova")
        .select("*")
        .eq("user_id", session.user.id);

      // Pega total de questões por prova
      const { data: questoes } = await supabase
        .from("questoes")
        .select("prova, ano, id");

      if (desempenho && questoes) {
        const agrupadas = Array.from(
          new Set(questoes.map((q) => `${q.prova}-${q.ano}`))
        ).map((chave) => {
          const [prova, anoStr] = chave.split(/-(?=\d{4}$)/);
          const ano = Number(anoStr);
          const totalQuestoes = questoes.filter(
            (q) => q.prova === prova && q.ano === ano
          ).length;
          const match = desempenho.find(
            (d) => d.prova === prova && d.ano === ano
          );
          const acertos = match?.acertos || 0;

          return {
            id: chave,
            prova,
            ano,
            quantidade: totalQuestoes,
            acertos,
          };
        });

        setProvas(agrupadas);
      }
    };

    fetchDesempenho();
  }, [session?.user?.id]);

  const slugifyProva = (prova: string) => {
    return prova
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
  };

  const provasFiltradas = onlyWrong
    ? provas.filter((p) => p.acertos < p.quantidade)
    : provas;

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <Helmet>
        <title>Avaliações | DrMeds</title>
        <meta
          name="description"
          content="Selecione provas antigas de residência médica e treine com questões reais."
        />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">📚 Avaliações</h1>
          <p className="text-muted-foreground">
            Escolha uma prova e teste seus conhecimentos com questões reais!
          </p>
        </div>
        <Toggle
          pressed={onlyWrong}
          onPressedChange={setOnlyWrong}
          className="text-sm"
        >
          Ver apenas as que errei
        </Toggle>
      </div>

      {provasFiltradas.length === 0 ? (
        <div className="text-muted-foreground mt-10">Nenhuma prova disponível no momento.</div>
      ) : (
        <ul className="space-y-4">
          {provasFiltradas.map((p) => {
            const concluida = p.acertos === p.quantidade;
            const percentual = p.quantidade > 0 ? Math.round((p.acertos / p.quantidade) * 100) : 0;

            return (
              <li key={p.id}>
                <Link
                  to={`/avaliacoes/${slugifyProva(p.prova)}-${p.ano}`}
                  className="block bg-card hover:bg-accent border border-border p-4 rounded-xl font-semibold transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span>📄 {p.prova} {p.ano}</span>
                    {concluida && <Badge className="bg-green-700 text-white">🔒 Concluída</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {p.quantidade} questões • {p.acertos}/{p.quantidade} acertos ({percentual}%)
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
