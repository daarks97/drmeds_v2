import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao entrar",
        description: error.message || "Verifique seu email e senha",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-foreground flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <Helmet>
        <title>Entrar • DrMeds</title>
        <meta name="description" content="Entre com sua conta para acessar seu plano de estudos personalizado no DrMeds." />
      </Helmet>

      <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-yellow-400 blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-purple-600 blur-[100px] opacity-10 animate-pulse" />

      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center drop-shadow">
        Bora estudar do seu jeito?
      </h2>

      <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-xl border border-border">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            placeholder="Email"
            className="bg-muted text-white border-border"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            className="bg-muted text-white border-border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 shadow hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground mt-4">
          <a href="/cadastro" className="text-yellow-400 hover:text-yellow-300 font-medium">Criar conta</a>
          {" | "}
          <span className="text-zinc-500 cursor-not-allowed">Esqueci minha senha</span>
        </div>
      </div>
    </div>
  );
}
