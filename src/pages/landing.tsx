import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Helmet } from "react-helmet-async";
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-foreground flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      <Helmet>
        <title>DrMeds • Estudar é chato. Mas saber é foda.</title>
        <meta
          name="description"
          content="Organize seus estudos com clareza, motivação e paz mental. O DrMeds cuida do plano, você cuida do foco."
        />
      </Helmet>

      <div className="absolute -top-16 -left-16 w-[500px] h-[500px] rounded-full bg-yellow-400 blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-[400px] h-[400px] rounded-full bg-purple-600 blur-[120px] opacity-10 animate-pulse" />

      <h1 className="text-4xl md:text-6xl font-extrabold text-center text-yellow-400 leading-tight drop-shadow-md">
        Estudar é chato. <br className="hidden md:block" />
        Mas saber é foda.
      </h1>

      <p className="mt-6 text-lg md:text-xl text-center text-zinc-300 max-w-xl">
        Organize seus estudos com clareza, motivação e paz mental. O <span className="text-yellow-300 font-semibold">DrMeds</span> cuida do plano, você cuida do foco.
      </p>

      <Button
        asChild
        className="mt-10 bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-2xl hover:bg-yellow-300 transition duration-300 ease-in-out shadow-xl hover:scale-105"
      >
        <a href="/login">🚀 Começar agora</a>
      </Button>
    </div>
  );
};

export default Landing;
