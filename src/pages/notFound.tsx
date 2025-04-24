import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-yellow-400 mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Opa! A página que você tentou acessar não existe.
        </p>
        <Link
          to="/"
          className="inline-block mt-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
