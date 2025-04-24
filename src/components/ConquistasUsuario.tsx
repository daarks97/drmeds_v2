import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Star, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConquistasUsuario() {
  const [favoritas, setFavoritas] = useState<string[]>([]);

  // Carrega favoritos do localStorage
  useEffect(() => {
    const favs = localStorage.getItem("conquistasFavoritas");
    if (favs) setFavoritas(JSON.parse(favs));
  }, []);

  const toggleFavorita = (id: string) => {
    const atualizado = favoritas.includes(id)
      ? favoritas.filter(fav => fav !== id)
      : [...favoritas, id];
    setFavoritas(atualizado);
    localStorage.setItem("conquistasFavoritas", JSON.stringify(atualizado));
  };

  const compartilharConquista = (texto: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Minha conquista no DrMeds",
        text: texto,
        url: window.location.href,
      });
    } else {
      alert("Compartilhamento não suportado neste navegador.");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["conquistas_usuario"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conquistas_usuario")
        .select("*");
      if (error) throw new Error(error.message);
      return data ?? [];
    }
  });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <div className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-2xl p-6 mb-6 shadow-md">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
        🏅 Suas Conquistas
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((c, i) => {
          const titulo =
            c.tipo === "mestre_tema"
              ? `🧠 Mestre do tema ${c.tema}`
              : c.tipo === "gabarito"
              ? `🎯 Gabaritou ${c.tema}`
              : c.tipo === "streak_3"
              ? "🔥 Foco Iniciado - 3 dias seguidos"
              : c.tipo === "streak_5"
              ? "🔥🔥 Foco Crescente - 5 dias"
              : c.tipo === "streak_7"
              ? "🧨 Constância Pro - 7 dias"
              : "🏅 Conquista";

          const isFavorita = favoritas.includes(c.id);

          return (
            <li
              key={i}
              className="relative text-sm text-white bg-zinc-700/30 rounded-xl border border-zinc-600 p-4 transition hover:scale-[1.02] hover:bg-zinc-600/30"
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <div className="font-semibold">{titulo}</div>
                <div className="flex gap-2">
                  <button onClick={() => toggleFavorita(c.id)} title="Marcar como favorita">
                    <Star size={16} className={cn("transition", isFavorita ? "fill-yellow-400 text-yellow-400" : "text-white")} />
                  </button>
                  <button
                    onClick={() => compartilharConquista(titulo)}
                    title="Compartilhar conquista"
                  >
                    <Share2 size={16} className="text-white hover:text-yellow-400 transition" />
                  </button>
                </div>
              </div>
              {c.desbloqueada_em && (
                <div className="text-xs text-zinc-300">
                  Conquistado em: {format(new Date(c.desbloqueada_em), "dd/MM/yyyy")}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
