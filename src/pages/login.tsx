import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12">
      <Helmet>
        <title>Entrar • DrMeds</title>
        <meta name="description" content="Entre com sua conta para acessar seu plano de estudos personalizado no DrMeds." />
      </Helmet>

      <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
        Bora estudar do seu jeito?
      </h2>

      <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow border border-border">
        <form onSubmit={handleLogin}>
          <Input
            placeholder="Email"
            className="mb-4 bg-muted text-white border-border"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            className="mb-4 bg-muted text-white border-border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground mt-4">
          <a href="/cadastro" className="text-yellow-400 hover:text-yellow-300">Criar conta</a>
          {" | "}
          <span className="text-zinc-500 cursor-not-allowed">Esqueci minha senha</span>
        </div>
      </div>
    </div>
  );
}
