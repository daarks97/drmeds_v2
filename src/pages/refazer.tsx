import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { registrarRespostaQuestao } from "@/lib/supabase/questoes";
import { Helmet } from "react-helmet-async";

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-foreground px-6 py-10 flex justify-center relative overflow-hidden">
      <Helmet>
        <title>Refazer Questões | DrMeds</title>
        <meta name="description" content="Revise questões que você errou e fortaleça seus pontos fracos." />
      </Helmet>

      <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-yellow-400 blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-purple-600 blur-[100px] opacity-10 animate-pulse" />

      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-8 drop-shadow">
          🔁 Refazendo questões erradas ({questoes.length})
        </h1>

        {questoes.map((q, i) => (
          <div key={q.id} className="mb-6 bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow">
            <p className="mb-3 font-semibold text-lg text-zinc-100">{i + 1}. {q.enunciado}</p>
            <div className="space-y-3">
              {Object.entries(q.alternativas).map(([letra, texto]) => {
                const selecionada = respostas[q.id] === letra;
                const correta = letra === q.resposta_correta;

                return (
                  <Button
                    key={letra}
                    variant="outline"
                    disabled={!!respostas[q.id]}
                    onClick={() => handleResponder(q, letra)}
                    className={`w-full justify-start text-left transition-all text-base font-medium border border-border rounded-lg py-3 px-4 ${
                      selecionada
                        ? correta
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white"
                    }`}
                  >
                    <b className="mr-2">{letra})</b> {texto}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}

        {concluida && (
          <div className="text-center mt-12">
            <p className="text-green-400 text-xl font-semibold mb-6">
              ✅ Você terminou de refazer todas as questões!
            </p>
            <Button
              onClick={() => navigate("/questoes/respondidas")}
              className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-300 shadow-lg transition hover:scale-105"
            >
              Voltar para o histórico
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}