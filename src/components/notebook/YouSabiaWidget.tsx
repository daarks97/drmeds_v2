import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock "Você Sabia?" facts
const voceSabiaData: Record<string, { title: string; content: string }> = {
  "hipertensão": {
    title: "Hipertensão Arterial",
    content: "A hipertensão é a principal causa de morte no mundo, responsável por mais de 10 milhões de mortes por ano. Menos de 1 em cada 5 pessoas com hipertensão tem a condição sob controle."
  },
  "diabetes": {
    title: "Diabetes Mellitus",
    content: "O primeiro caso de diabetes foi descrito no Egito Antigo em 1552 a.C. A palavra 'diabetes' significa 'passar através', referindo-se ao aumento do volume urinário."
  },
  "infarto": {
    title: "Infarto do Miocárdio",
    content: "As células cardíacas morrem em apenas 20 minutos após obstrução coronária. A maioria dos infartos ocorre nas primeiras horas da manhã."
  },
  "tuberculose": {
    title: "Tuberculose",
    content: "Uma das doenças mais antigas da humanidade. Múmias egípcias de 5.000 anos já apresentavam sinais da doença."
  },
  "alzheimer": {
    title: "Doença de Alzheimer",
    content: "Alterações cerebrais podem começar 20 anos antes dos sintomas cognitivos. A proteína beta-amiloide já foi achada em jovens de 20 anos."
  }
};

interface YouSabiaWidgetProps {
  keyword?: string;
}

const YouSabiaWidget: React.FC<YouSabiaWidgetProps> = ({ keyword }) => {
  const lowercaseKeyword = keyword?.toLowerCase() || '';
  const matched = Object.entries(voceSabiaData).find(([key]) =>
    lowercaseKeyword.includes(key)
  );

  // If no match, show one random fact
  const fallback = Object.values(voceSabiaData)[
    Math.floor(Math.random() * Object.values(voceSabiaData).length)
  ];

  const info = matched?.[1] || fallback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-amber-50 dark:bg-yellow-900/20 border-amber-200 dark:border-yellow-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-amber-700 dark:text-yellow-300">
            <Lightbulb className="h-5 w-5 mr-2 text-amber-500 dark:text-yellow-300" />
            💡 Você Sabia?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold text-amber-800 dark:text-yellow-200 mb-1">{info.title}</h4>
          <p className="text-sm text-amber-700 dark:text-yellow-100 leading-snug">{info.content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default YouSabiaWidget;
