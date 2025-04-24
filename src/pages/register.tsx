import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erro na senha",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4">
      <Helmet>
        <title>Criar Conta | DrMeds</title>
        <meta name="description" content="Crie sua conta no DrMeds e organize seus estudos com inteligência e clareza." />
      </Helmet>

      <h2 className="text-yellow-400 text-2xl font-semibold mb-4">Bem-vindo ao DrMeds!</h2>

      <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-md">
        <form onSubmit={handleRegister}>
          <Input
            placeholder="Nome completo"
            className="mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Email"
            className="mb-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar senha"
            className="mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar minha conta"}
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground mt-4">
          <a href="/login" className="underline hover:text-yellow-400">
            Já tenho conta
          </a>
        </div>
      </div>
    </div>
  );
}
