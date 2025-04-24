import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type Avaliacao = {
  id: string;
  prova: string;
  ano: number;
};

export default function ListaAvaliacoes() {
  const [provas, setProvas] = useState<Avaliacao[]>([]);

  useEffect(() => {
    const fetchProvas = async () => {
      const { data } = await supabase
        .from("questoes")
        .select("prova, ano")
        .order("ano", { ascending: false });

      if (data) {
        const unicas = Array.from(
          new Set(data.map((q) => `${q.prova}-${q.ano}`))
        ).map((chave) => {
          const [prova, ano] = chave.split("-");
          return { id: chave, prova, ano: Number(ano) };
        });

        setProvas(unicas);
      }
    };

    fetchProvas();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <Helmet>
        <title>Avaliações | DrMeds</title>
        <meta name="description" content="Selecione provas antigas de residência médica e treine com questões reais." />
      </Helmet>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">📚 Avaliações</h1>
      <p className="mb-4 text-muted-foreground">
        Escolha uma prova e teste seus conhecimentos com questões reais!
      </p>

      {provas.length === 0 ? (
        <div className="text-muted-foreground mt-10">Nenhuma prova disponível no momento.</div>
      ) : (
        <ul className="space-y-4">
          {provas.map((p) => (
            <li key={p.id}>
              <Link
                to={`/avaliacoes/${p.prova.toLowerCase().replace(/\s+/g, "-")}-${p.ano}`}
                className="block bg-card hover:bg-accent border border-border p-4 rounded-xl font-semibold transition-colors"
              >
                📄 {p.prova} {p.ano}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
