import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Mascot from '@/components/ui/mascot'; // ⬅️ Criamos um componente visual simples pro avatar

const quotes = [
  "A disciplina é a ponte entre metas e conquistas.",
  "Você não precisa ser perfeito, só precisa começar.",
  "Estudar hoje é o sucesso de amanhã.",
  "A constância é o que separa os bons dos excelentes.",
  "Mesmo devagar, você está à frente de quem não começou."
];

const getRandomQuote = (exclude?: string) => {
  const options = quotes.filter(q => q !== exclude);
  return options[Math.floor(Math.random() * options.length)];
};

const MotivationalQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const handleNewQuote = () => {
    const newQuote = getRandomQuote(quote);
    setQuote(newQuote);
  };

  return (
    <motion.div
      className="text-center py-6 px-4 sm:px-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-center items-center gap-4 mb-4">
        <Mascot />
        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-300 max-w-xl mx-auto">
          <Quote className="w-5 h-5 opacity-70" />
          <p className="text-lg sm:text-xl italic font-medium">
            “{quote}”
          </p>
          <Quote className="w-5 h-5 rotate-180 opacity-70" />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNewQuote}
        className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
      >
        <RefreshCw className="w-4 h-4 mr-1" /> Nova frase
      </Button>
    </motion.div>
  );
};

export default MotivationalQuote;
