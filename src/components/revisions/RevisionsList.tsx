import React from "react";
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { Revision } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RevisionItem from "@/components/RevisionItem";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RevisionsListProps {
  revisions: Revision[];
  type: 'today' | 'tomorrow' | 'late';
  onMarkCompleted: (id: string) => void;
  onRefuse: (id: string) => void;
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: unknown;
  variant?: 'blue' | 'purple' | 'orange' | 'red';
}

const getVariantStyles = (variant?: string) => {
  switch (variant) {
    case 'blue':
      return 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800';
    case 'purple':
      return 'border-purple-200 bg-purple-50/50 dark:bg-purple-900/20 dark:border-purple-800';
    case 'orange':
      return 'border-orange-200 bg-orange-50/50 dark:bg-orange-900/20 dark:border-orange-800';
    case 'red':
      return 'border-red-200 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800';
    default:
      return 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900';
  }
};

const RevisionsList: React.FC<RevisionsListProps> = ({
  revisions,
  type,
  onMarkCompleted,
  onRefuse,
  title,
  description,
  isLoading,
  error,
  variant
}) => {
  const allCompleted =
    type === 'today' && revisions.length > 0 &&
    revisions.every((revision) => revision.is_completed);

  if (isLoading) {
    return (
      <Card className={cn("mt-4", getVariantStyles(variant))}>
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
          <p className="text-lg text-zinc-700 dark:text-zinc-300">Carregando revisões...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("mt-4", getVariantStyles(variant))}>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <CardTitle className="flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Erro ao carregar revisões
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Não foi possível carregar as revisões. Tente novamente mais tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!revisions || revisions.length === 0) return null;

  return (
    <Card className={cn("mt-4", getVariantStyles(variant))}>
      <CardHeader className="pb-3 border-b border-zinc-200 dark:border-zinc-700">
        <CardTitle className="text-xl text-zinc-800 dark:text-white">{title}</CardTitle>
        {description && (
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        {allCompleted && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              ✅ Todas as revisões de hoje estão em dia. Você está no controle! 💪
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revisions.map((revision, index) => (
            <motion.div
              key={revision.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <RevisionItem
                revision={revision}
                type={type}
                onMarkCompleted={onMarkCompleted}
                onRefuse={onRefuse}
                isLoading={isLoading}
                variant={variant}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisionsList;
