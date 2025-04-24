import { motion, AnimatePresence } from "framer-motion";
import { useConquistaStore } from "@/store/useConquistaStore";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export function ConquistaModal() {
  const { conquista } = useConquistaStore();
  const { width, height } = useWindowSize();

  if (!conquista) return null;

  const mensagem =
    conquista.tipo === "mestre_tema"
      ? `🏆 Mestre do tema ${conquista.tema}`
      : conquista.tipo === "gabarito"
      ? `🎯 Gabaritou ${conquista.tema}`
      : conquista.tipo === "streak_3"
      ? "🔥 Foco Iniciado! 3 dias seguidos"
      : conquista.tipo === "streak_5"
      ? "🔥🔥 Foco Crescendo! 5 dias seguidos"
      : conquista.tipo === "streak_7"
      ? "🧨 Constância Pro! 7 dias seguidos"
      : `🏅 Nova conquista desbloqueada!`;

  const extra =
    conquista.tipo?.startsWith("streak") ? "Continue assim, foco total!" :
    conquista.tipo === "gabarito" ? "Você está dominando esse tema!" :
    conquista.tipo === "mestre_tema" ? "Você chegou ao topo do conhecimento!" :
    "";

  return (
    <AnimatePresence>
      <>
        <Confetti
          width={width}
          height={height}
          numberOfPieces={width > 500 ? 120 : 60}
          recycle={false}
        />
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }}
          exit={{ opacity: 0, y: 30, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-yellow-400 dark:bg-yellow-300 text-black dark:text-gray-900 p-4 px-6 rounded-2xl shadow-xl font-bold text-center z-50"
        >
          {mensagem}
          {extra && <div className="text-sm font-normal mt-1">{extra}</div>}
        </motion.div>
      </>
    </AnimatePresence>
  );
}
