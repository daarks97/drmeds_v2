import React from "react";
import { useAchievements } from "@/hooks/useAchievements";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function AchievementsPanel() {
  const { achievements, isLoading } = useAchievements();

  // Lista completa com conquistas conhecidas (mesmo as ainda bloqueadas)
  const ALL_ACHIEVEMENTS = [
    "streak", "volume", "marathon", "revision", "focus", "first", "noturno"
  ];

  const unlockedTypes = achievements.map((a) => a.achievement_type);

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
                    <Badge variant="default" className="w-fit text-xs mt-1">
                      Desbloqueada!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
    </div>
  );
}
