
import React from 'react';
import { Check, Book, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudyTopic, ReviewTopic } from '@/lib/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TodayNotificationsProps {
  todayTopic?: StudyTopic;
  reviewTopic?: ReviewTopic;
  onMarkStudyCompleted: (id: string) => void;
  onViewTopic: (id: string) => void;
  onMarkReviewCompleted: (id: string) => void;
  onRejectReview: (id: string) => void;
}

const TodayNotifications: React.FC<TodayNotificationsProps> = ({
  todayTopic,
  reviewTopic,
  onMarkStudyCompleted,
  onViewTopic,
  onMarkReviewCompleted,
  onRejectReview,
}) => {
  // Se não tiver tema ou revisão para hoje, não exibe nada
  if (!todayTopic && !reviewTopic) return null;

  return (
    <div className="flex items-center gap-3">
      {todayTopic && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <Book className="h-5 w-5 text-study-blue" />
              {!todayTopic.isCompleted && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-study-blue">
                  <span className="sr-only">1 novo tema hoje</span>
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="font-medium text-study-gray flex items-center">
                <Book className="h-4 w-4 mr-2 text-study-blue" />
                Tema de hoje
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 mb-3">{todayTopic.name}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => onMarkStudyCompleted(todayTopic.id)}
                  className="bg-study-green hover:bg-green-600 gap-1"
                  disabled={todayTopic.isCompleted}
                  size="sm"
                >
                  <Check className="h-4 w-4" />
                  {todayTopic.isCompleted ? 'Concluído' : 'Marcar como concluído'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onViewTopic(todayTopic.id)}
                  className="border-gray-200 hover:bg-gray-50 gap-1"
                  size="sm"
                >
                  <Book className="h-4 w-4" />
                  Ver tema
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {reviewTopic && ['pending', 'late'].includes(reviewTopic.status) && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
              <Badge 
                className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center ${
                  reviewTopic.status === 'late' ? 'bg-study-red' : 'bg-amber-500'
                }`}
              >
                <span className="sr-only">1 revisão pendente</span>
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="font-medium text-study-gray flex items-center justify-between">
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 text-gray-600" />
                  Revisão pendente
                </div>
                {reviewTopic.status === 'late' && (
                  <Badge variant="destructive" className="text-[10px]">Atrasada</Badge>
                )}
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 mb-3">{reviewTopic.name}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => onMarkReviewCompleted(reviewTopic.id)}
                  className="bg-study-green hover:bg-green-600 gap-1"
                  size="sm"
                >
                  <Check className="h-4 w-4" />
                  Concluir revisão
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onRejectReview(reviewTopic.id)}
                  className="border-gray-200 hover:bg-gray-50 gap-1"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                  Recusar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default TodayNotifications;
