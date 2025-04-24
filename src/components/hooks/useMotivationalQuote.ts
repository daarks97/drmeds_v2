import { useState, useEffect } from 'react';

const MOTIVATIONAL_QUOTES = [
  "Grandes médicos se constroem nos pequenos hábitos.",
  "Você não precisa estudar o dia todo. Só precisa estudar hoje.",
  "A rotina vence o talento quando o talento não tem rotina."
];

export const useMotivationalQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("motivational_quote");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setQuote(parsed.quote);
        return;
      }
    }

    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    const selectedQuote = MOTIVATIONAL_QUOTES[randomIndex];

    setQuote(selectedQuote);
    localStorage.setItem("motivational_quote", JSON.stringify({ date: today, quote: selectedQuote }));
  }, []);

  return quote;
};
