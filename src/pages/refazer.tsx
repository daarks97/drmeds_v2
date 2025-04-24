import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { registrarRespostaQuestao } from "@/lib/supabase/questoes";
import { Helmet } from "react-helmet";

type Questao = {
  id: string;
  enunciado: string;
  alternativas: Record<string, string>;
  resposta_correta: string;
};

export default function RefazerQuestoes() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();

  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [concluida, setConcluida] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const ids = searchParams.get('ids')?.split(',') || [];
  const tema = searchParams.get('tema') || 'sem-tema';

  useEffect(() => {
    if (!ids.length) return;

    supabase
      .from("questoes")
      .select("*")
      .in("id", ids)
      .then(({ data }) => {
        if (data) {
          const transformed: Questao[] = data.map(item => ({
            id: item.id,
            enunciado: item.enunciado,
            alternativas: item.alternativas as Record<string, string>,
            resposta_correta: item.correta,
          }));
          setQuestoes(transformed);
        }
      });
  }, [ids]);

  const handleResponder = async (questao: Questao, letra: string) => {
    if (!session?.user?.id) return;

    const acertou = letra === questao.resposta_correta;

    await registrarRespostaQuestao({
      userId: session.user.id,
      questaoId: questao.id,
      tema: tema,
      acertou,
    });

    setRespostas((prev) => ({ ...prev, [questao.id]: letra }));

    if (Object.keys(respostas).length + 1 === questoes.length) {
      setConcluida(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 flex justify-center">
      <Helmet>
        <title>Refazer Questões | DrMeds</title>
        <meta name="description" content="Revise questões que você errou e fortaleça seus pontos fracos." />
      </Helmet>

      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
          🔁 Refazendo questões erradas ({questoes.length})
        </h1>

        {questoes.map((q, i) => (
          <div key={q.id} className="mb-6 bg-card p-4 rounded-xl border border-border">
            <p className="mb-2 font-semibold">{i + 1}. {q.enunciado}</p>
            <div className="space-y-2">
              {Object.entries(q.alternativas).map(([letra, texto]) => {
                const selecionada = respostas[q.id] === letra;
                const correta = letra === q.resposta_correta;

                return (
                  <Button
                    key={letra}
                    variant="outline"
                    disabled={!!respostas[q.id]}
                    onClick={() => handleResponder(q, letra)}
                    className={`w-full justify-start text-left transition ${
                      selecionada
                        ? correta
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : ""
                    }`}
                  >
                    <b>{letra})</b> {texto}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}

        {concluida && (
          <div className="text-center mt-10">
            <p className="text-green-400 text-lg font-bold mb-4">
              ✅ Você terminou de refazer todas as questões!
            </p>
            <Button
              onClick={() => navigate("/questoes/respondidas")}
              className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            >
              Voltar para o histórico
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
