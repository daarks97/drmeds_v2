import React from 'react';
import { Eye } from 'lucide-react';
import { Revision } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import RevisionItem from '@/components/RevisionItem';
import { motion } from 'framer-motion';

interface RefusedRevisionsPopoverProps {
  revisions: Revision[];
  onReactivate: (id: string) => void;
  onMarkCompleted: (id: string) => void;
}

const RefusedRevisionsPopover: React.FC<RefusedRevisionsPopoverProps> = ({
  revisions,
  onReactivate,
  onMarkCompleted,
}) => {
  if (revisions.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          ⚠️ Revisões Recusadas
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 ml-1">
            {revisions.length}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
        <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">
          Revisões Recusadas
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">
          Toda pendência é uma chance de consolidar melhor o conteúdo!
        </p>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {revisions.map((revision, index) => (
            <motion.div
              key={revision.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <RevisionItem
                revision={revision}
                type="refused"
                onMarkCompleted={onMarkCompleted}
                onReactivate={onReactivate}
              />
            </motion.div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RefusedRevisionsPopover;
