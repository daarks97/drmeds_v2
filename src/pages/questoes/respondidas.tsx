import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";

type Resposta = {
  tema: string;
  acertou: boolean;
  respondido_em: string;
  questao_id: string;
};

export default function HistoricoQuestoes() {
  const session = useSession();
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "erradas">("todas");

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchRespostas = async () => {
      const { data, error } = await supabase
        .from("questoes_respostas")
        .select("*")
        .eq("user_id", session.user.id)
        .order("respondido_em", { ascending: false });

      if (!error && data) setRespostas(data);
    };

    fetchRespostas();
  }, [session]);

  const filtradas =
    filtro === "erradas"
      ? respostas.filter((r) => !r.acertou)
      : respostas;

  const agrupadasPorTema = filtradas.reduce((acc, resposta) => {
    if (!acc[resposta.tema]) acc[resposta.tema] = [];
    acc[resposta.tema].push(resposta);
    return acc;
  }, {} as Record<string, Resposta[]>);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <Helmet>
        <title>Histórico de Questões | DrMeds</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">📚 Questões Respondidas</h1>

      <div className="mb-6 flex gap-2">
        <Button
          variant={filtro === "todas" ? "default" : "outline"}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </Button>
        <Button
          variant={filtro === "erradas" ? "default" : "outline"}
          onClick={() => setFiltro("erradas")}
        >
          Somente Erradas
        </Button>
      </div>

      {filtro === "erradas" ? (
        Object.entries(agrupadasPorTema).length === 0 ? (
          <p className="text-muted-foreground">Nenhuma questão errada encontrada.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(agrupadasPorTema).map(([tema, respostas]) => (
              <div key={tema} className="bg-card p-4 rounded-xl border border-border flex justify-between items-center">
                <div>
                  <p className="font-semibold">{tema}</p>
                  <p className="text-sm text-muted-foreground">{respostas.length} questão(ões) erradas</p>
                </div>
                <Button
                  className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold"
                  onClick={() => {
                    const ids = respostas.map((r) => r.questao_id).join(",");
                    window.location.href = `/refazer?tema=${encodeURIComponent(tema)}&ids=${ids}`;
                  }}
                >
                  Refazer
                </Button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-muted-foreground">
          <p>Exibição de todas as questões ainda será implementada.</p>
          <Separator className="my-6" />
          <p className="text-sm">Dica: use o filtro "Somente Erradas" para treinar temas que você ainda precisa reforçar 💪</p>
        </div>
      )}
    </div>
  );
}
