import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import FocusTimer from './FocusTimer';
import { Button } from '@/components/ui/button';

interface StudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const motivationalQuotes = [
  "📚 Estudar agora é colher amanhã.",
  "🚀 Só melhora quem não para.",
  "🎯 Foque no processo, o resultado vem.",
  "🧠 25 minutos agora valem ouro depois.",
  "🔥 Cada minuto é um passo a mais na direção certa."
];

const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

const StudyModal: React.FC<StudyModalProps> = ({ open, onOpenChange }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (open) {
      setQuote(getRandomQuote());
    }
  }, [open]);

  // Exemplo mockado - idealmente vem de um hook de progresso
  const dailyStudyTime = 90; // em minutos

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 dark:bg-zinc-900 dark:text-zinc-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl mb-1">⏱️ Modo de Estudo</DialogTitle>
          </DialogHeader>

          <div className="text-center text-sm italic text-zinc-500 dark:text-zinc-400 mb-4">
            {quote}
          </div>

          <div className="flex justify-center items-center text-3xl mb-2">
            🐸 <span className="ml-2 text-lg">"Foco ativado, bora brilhar!"</span>
          </div>

          <div className="text-center mb-4 text-sm">
            Você já estudou <strong>{Math.floor(dailyStudyTime / 60)}h {dailyStudyTime % 60}min</strong> hoje!
          </div>

          <FocusTimer onClose={() => onOpenChange(false)} />

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => console.log('+5 minutos')}>
              +5 min
            </Button>
            <Button variant="outline" size="sm" onClick={() => console.log('+10 minutos')}>
              +10 min
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default StudyModal;
