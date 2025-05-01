import React from "react";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AchievementsPanel() {
  const { achievements, isLoading } = useUserAchievements();

  const ALL_ACHIEVEMENTS = [
    "streak", "volume", "marathon", "revision", "focus", "first", "noturno"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {isLoading &&
        Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}

      {!isLoading &&
        ALL_ACHIEVEMENTS.map((type) => {
          const achievement = achievements.find((a) => a.achievement_type === type);
          const isUnlocked = Boolean(achievement);
          const icon = isUnlocked ? achievement.icon : "🔒";
          const title = isUnlocked ? achievement.title : "???";
          const description = isUnlocked ? achievement.description : "Desbloqueie esta conquista estudando!";
          const unlockedAt = isUnlocked
            ? format(new Date(achievement.unlocked_at), "dd 'de' MMMM yyyy", { locale: ptBR })
            : null;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900 text-gray-100 border-zinc-700 rounded-2xl shadow-md">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="text-3xl">{icon}</div>
                  <div className="font-semibold text-lg leading-tight">{title}</div>
                  <p className="text-sm text-gray-400 leading-snug">{description}</p>
                  {isUnlocked && (
                    <>
                      <Badge variant="default" className="w-fit text-xs mt-1">
                        Desbloqueada!
                      </Badge>
                      <p className="text-[11px] text-gray-400 italic">{unlockedAt}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
    </div>
  );
}
