import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@supabase/auth-helpers-react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import Confetti from "react-confetti";
import { Progress } from "@/components/ui/progress";

export default function Onboarding() {
  const session = useSession();
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    nome: "",
    diasSemana: "",
    horarios: [] as string[],
    comeco: "",
    revisoes: false,
  });

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const avancar = () => setStep((prev) => prev + 1);

  const atualizar = (campo: string, valor: any) => {
    setData((prev) => ({ ...prev, [campo]: valor }));
  };

  const finalizar = async () => {
    if (!session?.user) return;
    setSaving(true);

    await supabase.from("user_plans").insert({
      user_id: session.user.id,
      nome: data.nome,
      dias_semana: Number(data.diasSemana),
      horarios: data.horarios,
      comeco: data.comeco,
      revisoes: data.revisoes,
      created_at: new Date().toISOString(),
    });

    setShowConfetti(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-6 py-12 relative">
      <Helmet>
        <title>Comece com o DrMeds</title>
        <meta name="description" content="Configure seu plano inicial de estudos em poucos passos com o DrMeds." />
      </Helmet>

      {showConfetti && <Confetti numberOfPieces={250} recycle={false} />}

      <div className="w-full max-w-md mb-4">
        <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-yellow-400" />
      </div>

      <div className="bg-card p-6 rounded-2xl w-full max-w-md shadow-md border border-border text-center transition-all duration-300">
        {step === 0 && (
          <>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Como podemos te chamar?</h2>
            <Input
              placeholder="Seu nome"
              value={data.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
            />
            <Button className="mt-4 w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300" onClick={avancar}>
              Continuar
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Quantos dias por semana você quer estudar?</h2>
            <Input
              placeholder="Ex: 5"
              type="number"
              value={data.diasSemana}
              onChange={(e) => atualizar("diasSemana", e.target.value)}
            />
            <Button className="mt-4 w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300" onClick={avancar}>
              Continuar
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Prefere estudar em quais horários?</h2>
            <div className="flex flex-col gap-2 text-left">
              {["Manhã", "Tarde", "Noite", "Depende do dia"].map((opcao) => (
                <label key={opcao} className="flex items-center gap-2">
                  <Checkbox
                    checked={data.horarios.includes(opcao)}
                    onCheckedChange={() => {
                      const atual = [...data.horarios];
                      if (atual.includes(opcao)) {
                        atualizar("horarios", atual.filter((h) => h !== opcao));
                      } else {
                        atualizar("horarios", [...atual, opcao]);
                      }
                    }}
                  />
                  <span>{opcao}</span>
                </label>
              ))}
            </div>
            <Button className="mt-4 w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300" onClick={avancar}>
              Continuar
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Quer começar do zero ou continuar?</h2>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  atualizar("comeco", "zero");
                  avancar();
                }}
              >
                Começar do zero
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  atualizar("comeco", "retomar");
                  avancar();
                }}
              >
                Continuar de onde parei
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Quer que a gente monte suas revisões automaticamente?</h2>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
                disabled={saving}
                onClick={() => {
                  atualizar("revisoes", true);
                  finalizar();
                }}
              >
                {saving ? "Salvando..." : "Sim, por favor"}
              </Button>
              <Button
                variant="outline"
                disabled={saving}
                className="w-full"
                onClick={() => {
                  atualizar("revisoes", false);
                  finalizar();
                }}
              >
                Prefiro fazer sozinho
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
