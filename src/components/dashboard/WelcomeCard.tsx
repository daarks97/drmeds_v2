import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeCardProps {
  userName?: string;
  focusTopic?: string;
  onStartStudy?: () => void;
}

const motivationalPhrases = [
  "A consistência é mais forte que a motivação.",
  "Você é mais capaz do que imagina.",
  "Estudar agora é investir no seu futuro.",
  "Pequenos avanços diários constroem grandes vitórias.",
  "Foco. Força. Café. E revisão. ☕"
];

const getRandomPhrase = () =>
  motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "🌞 Bom dia";
  if (hour < 18) return "🌇 Boa tarde";
  return "🌙 Boa noite";
};

const WelcomeCard = ({ userName = "Usuário", focusTopic = "Revisar AVCi", onStartStudy }: WelcomeCardProps) => {
  const greeting = getTimeGreeting();
  const phrase = getRandomPhrase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-zinc-900 via-[#1A1F2C] to-zinc-800 text-white rounded-xl p-6 shadow-md"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-purple-400">
          <AvatarImage src="/placeholder.svg" alt={userName} />
          <AvatarFallback className="bg-purple-700 text-white">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1 flex-1">
          <h2 className="text-xl font-semibold">
            {greeting}, {userName}!
          </h2>
          <p className="text-sm text-zinc-300">
            🎯 Hoje seu foco é: <span className="font-medium text-purple-300">{focusTopic}</span>
          </p>
          <p className="text-xs italic text-zinc-400 mt-1">"{phrase}"</p>
        </div>

        {onStartStudy && (
          <Button
            variant="secondary"
            className="text-xs px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onStartStudy}
          >
            Começar agora
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
