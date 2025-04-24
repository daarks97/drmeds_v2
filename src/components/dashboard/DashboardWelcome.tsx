// src/components/dashboard/DashboardWelcome.tsx

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardWelcomeProps {
  userName: string;
  studyTopic?: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ userName, studyTopic }) => {
  const firstInitial = userName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 shadow-md mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-yellow-400/30">
          <AvatarImage src="/placeholder.svg" alt={`Avatar de ${userName}`} />
          <AvatarFallback className="bg-zinc-800 text-yellow-400">
            {firstInitial}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">
            👋 Olá, {userName}! Pronto pra mais um dia de evolução no DrMeds?
          </h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
