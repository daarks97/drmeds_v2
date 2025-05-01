import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked_at: string | null;
};

type Props = {
  achievements: Achievement[];
};

export default function AchievementsGrid({ achievements }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const unlocked = achievements.some((a) => a.unlocked_at);
    if (unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [achievements]);

  const getIcon = (title: string) => {
    if (title.includes("Memória")) return "🧠";
    if (title.includes("Foco")) return "🎯";
    if (title.includes("Maratona")) return "🏃‍♂️";
    if (title.includes("Desafio")) return "🔥";
    return "🏅";
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked_at && !b.unlocked_at) return -1;
    if (!a.unlocked_at && b.unlocked_at) return 1;
    return 0;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked_at).length;

  return (
    <div className="relative px-4 py-6">
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}
      
      {/* Contador de conquistas */}
      <p className="text-sm text-muted-foreground mb-4">
        {unlockedCount} de {achievements.length} conquistas desbloqueadas
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sortedAchievements.map((a) => {
          const isUnlocked = !!a.unlocked_at;

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className={`relative rounded-2xl p-4 shadow-lg border transition-all duration-300
                ${
                  isUnlocked
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-300 text-black border-yellow-500"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 opacity-60 grayscale"
                }
              `}
            >
              {isUnlocked && (
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                  ✅ Desbloqueada
                </div>
              )}

              {isUnlocked ? (
                <>
                  <div className="text-2xl font-bold mb-2">
                    {getIcon(a.title)} {a.title}
                  </div>
                  <p className="text-sm mb-1">{a.description}</p>
                  <p className="text-xs">
                    Desbloqueada em{" "}
                    {new Date(a.unlocked_at).toLocaleDateString("pt-BR")}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-md font-semibold mb-1">???</p>
                  <p className="text-sm">Desbloqueie esta conquista estudando!</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
