
// Funções auxiliares para datas no formato brasileiro

/**
 * Obtém a data atual no formato brasileiro (UTC-3) com adição opcional de dias
 * @param days Número de dias para adicionar à data atual
 * @returns String de data no formato YYYY-MM-DD
 */
export const getBrazilDatePlusDays = (days: number = 0): string => {
  const now = new Date();
  // Ajuste para o fuso horário brasileiro (UTC-3)
  const date = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

/**
 * Formata uma data no padrão de exibição brasileiro
 * @param dateString String de data no formato YYYY-MM-DD ou objeto Date
 * @returns Data formatada como DD/MM/YYYY
 */
export const formatBrazilDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Verifica se uma data é hoje
 * @param dateString String de data no formato YYYY-MM-DD
 * @returns Boolean indicando se a data é hoje
 */
export const isToday = (dateString: string): boolean => {
  const today = getBrazilDatePlusDays(0);
  return dateString === today;
};

/**
 * Calcula diferença em dias entre duas datas
 * @param dateA Primeira data (YYYY-MM-DD)
 * @param dateB Segunda data (YYYY-MM-DD)
 * @returns Número de dias entre as datas
 */
export const daysBetween = (dateA: string, dateB: string): number => {
  const a = new Date(dateA);
  const b = new Date(dateB);
  
  const diffTime = Math.abs(b.getTime() - a.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
};
