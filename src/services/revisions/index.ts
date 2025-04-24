// Requisições de busca
export {
    fetchRevisions,
    fetchTodayRevisions,
    fetchTomorrowRevisions,
    fetchLateRevisions,
    fetchRefusedRevisions
  } from './fetchRevisions';
  
  // Criação automática de revisões (individual ou lote)
  export {
    createNextRevision
  } from './createNextRevision';
  
  export {
    createNextRevisions
  } from './createNextRevisions';
  
  // Marcar como concluída ou recusada
  export {
    completeRevision,
    refuseRevision
  } from './manageRevisions';
  