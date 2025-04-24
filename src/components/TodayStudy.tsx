
import React from 'react';
import { Check, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StudyTopic } from '@/lib/types';

interface TodayStudyProps {
  todayTopic: StudyTopic;
  onMarkCompleted: (id: string) => void;
  onViewTopic: (id: string) => void;
}

const TodayStudy: React.FC<TodayStudyProps> = ({ 
  todayTopic, 
  onMarkCompleted, 
  onViewTopic 
}) => {
  return (
    <Card className="mb-6 border-gray-200 shadow-soft">
      <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50">
        <CardTitle className="text-base font-medium text-study-gray flex items-center gap-2">
          <Book className="h-4 w-4 text-study-blue" /> 
          Tema de hoje: {todayTopic.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => onMarkCompleted(todayTopic.id)}
            className="bg-study-green hover:bg-green-600 gap-1"
            disabled={todayTopic.isCompleted}
          >
            <Check className="h-4 w-4" />
            {todayTopic.isCompleted ? 'Concluído' : 'Marcar como concluído'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onViewTopic(todayTopic.id)}
            className="border-gray-200 hover:bg-gray-50 gap-1"
          >
            <Book className="h-4 w-4" />
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayStudy;
