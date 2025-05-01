import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type Props = {
  name: string;
  xp: number;
  level: number;
  minutesToday: number;
};

export default function UserOverview({ name, xp, level, minutesToday }: Props) {
  const nextLevelXP = Math.pow((level + 1) * 10, 2);
  const progressPercent = Math.min(100, Math.floor((xp / nextLevelXP) * 100));

  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-md">
      <Avatar className="h-16 w-16 border border-border">
        <AvatarImage src="/placeholder.svg" alt={name} />
        <AvatarFallback className="bg-muted text-yellow-400">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-yellow-400">Olá, {name}!</p>
        <p className="text-sm text-muted-foreground">Nível {level} – Evoluindo no seu ritmo</p>
        <Progress value={progressPercent} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          XP: {xp} / {nextLevelXP} • Hoje: {minutesToday} min de estudo
        </p>
      </div>
    </div>
  );
}
