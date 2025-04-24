
import React from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReviewTopic } from '@/lib/types';

interface TodayReviewProps {
  reviewTopic: ReviewTopic;
  onMarkCompleted: (id: string) => void;
  onReject: (id: string) => void;
}

const TodayReview: React.FC<TodayReviewProps> = ({ 
  reviewTopic, 
  onMarkCompleted, 
  onReject 
}) => {
  const getStatusDisplay = () => {
    switch (reviewTopic.status) {
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
      case 'late':
        return <Badge variant="destructive">Atrasada</Badge>;
      case 'completed':
        return <Badge className="bg-study-green">Concluída</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Recusada</Badge>;
      default:
        return null;
    }
  };

  const isActionable = ['pending', 'late'].includes(reviewTopic.status);

  return (
    <Card className="mb-6 border-gray-200 shadow-soft">
      <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-study-gray flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-study-blue" /> 
            Revisão: {reviewTopic.name}
          </CardTitle>
          {getStatusDisplay()}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => onMarkCompleted(reviewTopic.id)}
            className="bg-study-green hover:bg-green-600 gap-1"
            disabled={!isActionable}
          >
            <Check className="h-4 w-4" />
            Marcar como concluída
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onReject(reviewTopic.id)}
            className="border-gray-200 hover:bg-gray-50 gap-1"
            disabled={!isActionable}
          >
            <X className="h-4 w-4" />
            Recusar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayReview;
