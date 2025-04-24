import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { registrarRespostaQuestao } from "@/lib/supabase/questoes";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

interface Questao {
  id: string;
  enunciado: string;
  alternativas: Record<string, string>;
  correta: string;
  tema: string;
}

export default function QuestoesPorTema() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tema = params.get("tema");

  const session = useSession();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondidas, setRespondidas] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [acertos, setAcertos] = useState(0);

  const todasRespondidas = Object.keys(respondidas).length === questoes.length;

  useEffect(() => {
    const fetchQuestoes = async () => {
      const { data, error } = await supabase
        .from("questoes")
        .select("*")
        .eq("tema", tema);

      if (!error && data) {
        const sorteadas = data
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map((q) => {
            let alternativasObj: Record<string, string> = {};

            if (typeof q.alternativas === "object" && q.alternativas !== null) {
              alternativasObj = q.alternativas;
            } else if (typeof q.alternativas === "string") {
              try {
                alternativasObj = JSON.parse(q.alternativas);
              } catch (e) {
                console.error("Erro ao parsear alternativas:", e);
              }
            }

            return {
              id: q.id,
              enunciado: q.enunciado,
              alternativas: alternativasObj,
              correta: q.correta,
              tema: q.tema,
            };
          });

        setQuestoes(sorteadas);
      }
      setLoading(false);
    };

    if (tema) fetchQuestoes();
  }, [tema]);

  const handleResposta = async (
    questaoId: string,
    alternativa: string,
    correta: string,
    tema: string
  ) => {
    if (!session?.user?.id || respondidas[questaoId]) return;

    const acertou = alternativa === correta;

    setRespondidas((prev) => ({ ...prev, [questaoId]: true }));
    setSelected((prev) => ({ ...prev, [questaoId]: alternativa }));
    if (acertou) setAcertos((prev) => prev + 1);

    await registrarRespostaQuestao({
      userId: session.user.id,
      questaoId,
      tema,
      acertou,
    });

    toast({
      title: acertou ? "✅ Resposta correta!" : "❌ Resposta errada",
      description: acertou
        ? "+2XP adicionados ao seu perfil"
        : "Você poderá revisar essa questão depois.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-8">
      <Helmet>
        <title>Questões de {tema} | DrMeds</title>
        <meta name="description" content={`Treine questões sobre ${tema} e veja seu progresso.`} />
      </Helmet>

      <h1 className="text-2xl font-bold text-purple-400 mb-6">
        Questões sobre "{tema}"
      </h1>

      {loading ? (
        <p className="text-muted-foreground">Carregando questões...</p>
      ) : questoes.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma questão encontrada.</p>
      ) : (
        <div>
          <div className="mb-6 p-4 rounded-xl bg-purple-100 border-l-4 border-purple-500 shadow-sm">
            <h2 className="text-purple-700 font-bold text-lg">
              🧠 Treino rápido: {questoes.length} questões sobre "{tema}"
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Responda sem medo — errou, aprende. Acertou, avança! 🚀
            </p>
          </div>

          {todasRespondidas && (
            <div className="mt-10 p-6 bg-green-100 border border-green-400 rounded-xl text-center shadow-md">
              <h2 className="text-xl font-bold text-green-700 mb-2">
                🎉 Você concluiu o treino!
              </h2>
              <p className="text-green-800 text-lg">
                ✅ Acertos: {acertos} de {questoes.length} (
                {Math.round((acertos / questoes.length) * 100)}%)
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                {acertos === questoes.length
                  ? "Mestre! Gabaritou esse tema!"
                  : acertos >= questoes.length * 0.8
                  ? "Muito bem! Tá quase dominando."
                  : acertos >= questoes.length * 0.5
                  ? "Boa! Mas dá pra melhorar. Bora revisar?"
                  : "Hmm... precisa revisar esse tema com carinho 💜"}
              </p>

              {acertos < questoes.length * 0.6 && (
                <div className="mt-4">
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                    onClick={() =>
                      navigate(`/meu-caderno/tema/${tema?.toLowerCase().replace(/\s+/g, "-")}`)
                    }
                  >
                    🔁 Revisar este tema agora
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  🔁 Refazer este treino
                </Button>
              </div>
            </div>
          )}

          <ul className="space-y-4">
            {questoes.map((q, i) => (
              <li
                key={q.id}
                className="border border-border rounded-xl p-4 bg-card shadow-sm"
              >
                <p className="font-medium mb-2">
                  {i + 1}. {q.enunciado}
                </p>
                {Object.entries(q.alternativas).map(([letra, texto]) => (
                  <Button
                    key={letra}
                    variant="outline"
                    className={`w-full text-left justify-start mt-1 py-3 px-4 flex items-center gap-2 border-2
                    ${
                      respondidas[q.id]
                        ? letra === q.correta
                          ? "border-green-600 bg-green-50 text-green-800"
                          : letra === selected[q.id]
                          ? "border-red-600 bg-red-50 text-red-800"
                          : "opacity-60"
                        : ""
                    }
                  `}
                    onClick={() =>
                      handleResposta(q.id, letra, q.correta, q.tema)
                    }
                    disabled={respondidas[q.id]}
                  >
                    <span className="font-bold">{letra})</span>
                    <span>{texto}</span>
                    {respondidas[q.id] && letra === q.correta && (
                      <span className="ml-auto">✅</span>
                    )}
                    {respondidas[q.id] &&
                      letra === selected[q.id] &&
                      letra !== q.correta && <span className="ml-auto">❌</span>}
                  </Button>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Footer currentPage="topics" />
    </div>
  );
}
