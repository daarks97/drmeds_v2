import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-foreground px-6 py-12 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-yellow-400 blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full bg-purple-600 blur-[100px] opacity-10 animate-pulse" />

      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-yellow-400 drop-shadow mb-6">404</h1>
        <p className="text-2xl text-zinc-300 mb-6">
          Opa! A página que você tentou acessar não existe.
        </p>
        <Link
          to="/home"
          className="inline-block mt-2 px-8 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-transform hover:scale-105 shadow-xl"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;