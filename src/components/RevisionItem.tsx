import React from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, X, FileText, Calendar, Brain } from 'lucide-react';
import { Revision } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface RevisionItemProps {
  revision: Revision;
  type: 'today' | 'tomorrow' | 'late' | 'refused';
  onMarkCompleted: (id: string) => void;
  onRefuse?: (id: string) => void;
  onReactivate?: (id: string) => void;
  isLoading?: boolean;
  variant?: 'blue' | 'purple' | 'orange' | 'red';
}

const getVariantStyles = (variant?: string, type?: string) => {
  if (type === 'refused') return 'border-gray-200 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700';

  const base = 'bg-white dark:bg-zinc-900';
  const hover = 'hover:scale-[1.01] hover:shadow-md transition-transform';

  switch (variant) {
    case 'blue':
      return `${base} border-blue-200 dark:border-blue-800 ${hover}`;
    case 'purple':
      return `${base} border-purple-200 dark:border-purple-800 ${hover}`;
    case 'orange':
      return `${base} border-orange-200 dark:border-orange-800 ${hover}`;
    case 'red':
      return `${base} border-red-200 dark:border-red-800 ${hover}`;
    default:
      return `${base} border-zinc-200 dark:border-zinc-700 ${hover}`;
  }
};

const getStatusBadgeStyle = (revision: Revision, variant?: string) => {
  if (revision.is_completed) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  if (revision.is_refused) return 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300';

  switch (variant) {
    case 'blue':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-300';
    case 'purple':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800/40 dark:text-purple-300';
    case 'orange':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800/40 dark:text-orange-300';
    case 'red':
      return 'bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-gray-300';
  }
};

const RevisionItem: React.FC<RevisionItemProps> = ({
  revision,
  type,
  onMarkCompleted,
  onRefuse,
  isLoading = false,
  variant
}) => {
  const { toast } = useToast();

  const handleViewTheme = () => {
    toast({
      title: "📄 Em construção",
      description: "Em breve você poderá acessar seus resumos por aqui.",
    });
  };

  const date = parseISO(revision.revision_date);
  const formattedDate = format(date, "dd 'de' MMM", { locale: ptBR });
  const isRevisaoHoje = isToday(date);

  return (
    <div className={cn(
      "rounded-xl shadow-sm p-4 border transition-all duration-300",
      getVariantStyles(variant, type)
    )}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              {revision.study_plans?.theme || 'Tema não encontrado'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {revision.study_plans?.discipline}
            </p>
          </div>
          <Badge className={cn(
            "rounded-full px-2 text-xs font-medium",
            getStatusBadgeStyle(revision, variant)
          )}>
            {revision.revision_stage}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {formattedDate}
            {isRevisaoHoje && <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">(Hoje)</span>}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewTheme}
                  className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver tema</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            variant="outline"
            size="sm"
            onClick={() => onMarkCompleted(revision.id)}
            className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-800/30"
            disabled={isLoading || revision.is_completed}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Concluir
          </Button>

          {onRefuse && !revision.is_completed && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => onRefuse(revision.id)}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/40"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Recusar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionItem;
