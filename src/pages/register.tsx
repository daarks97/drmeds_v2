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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-foreground flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <Helmet>
        <title>Criar Conta | DrMeds</title>
        <meta name="description" content="Crie sua conta no DrMeds e organize seus estudos com inteligência e clareza." />
      </Helmet>

      <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-yellow-400 blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-purple-600 blur-[100px] opacity-10 animate-pulse" />

      <h2 className="text-yellow-400 text-3xl font-extrabold mb-6 drop-shadow text-center">
        Bem-vindo ao DrMeds!
      </h2>

      <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-xl">
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 shadow hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar minha conta"}
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground mt-4">
          <a href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
            Já tenho conta
          </a>
        </div>
      </div>
    </div>
  );
}
