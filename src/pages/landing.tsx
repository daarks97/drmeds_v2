import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";

const Landing: React.FC = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      navigate("/"); // Redireciona usuários logados para o dashboard
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-6 py-12">
      <Helmet>
        <title>DrMeds • Estudar é chato. Mas saber é foda.</title>
        <meta
          name="description"
          content="Organize seus estudos com clareza, motivação e paz mental. O DrMeds cuida do plano, você cuida do foco."
        />
      </Helmet>

      <h1 className="text-3xl md:text-5xl font-bold text-center text-yellow-400 leading-tight">
        Estudar é chato. <br className="hidden md:block" />
        Mas saber é foda.
      </h1>

      <p className="mt-4 text-lg md:text-xl text-center text-muted-foreground max-w-xl">
        Organize seus estudos com clareza, motivação e paz mental. O{" "}
        <strong className="text-yellow-400">DrMeds</strong> cuida do plano,
        você cuida do foco.
      </p>

      <Button
        asChild
        className="mt-8 bg-yellow-400 text-black font-bold text-lg px-6 py-3 rounded-2xl hover:bg-yellow-300 transition shadow-lg"
      >
        <a href="/register">Começar agora</a>
      </Button>
    </div>
  );
};

export default Landing;
