
import { supabase } from '@/integrations/supabase/client';

export const markRevisionAsCompleted = async (revisionId: string) => {
  const { error } = await supabase
    .from('revisions')
    .update({ is_completed: true })
    .eq('id', revisionId);
  
  if (error) throw error;
};

export const markRevisionAsRefused = async (revisionId: string) => {
  const { error } = await supabase
    .from('revisions')
    .update({ is_refused: true })
    .eq('id', revisionId);
  
  if (error) throw error;
};

export const reactivateRevision = async (revisionId: string) => {
  const { error } = await supabase
    .from('revisions')
    .update({ is_refused: false, is_completed: false })
    .eq('id', revisionId);
  
  if (error) throw error;
};
