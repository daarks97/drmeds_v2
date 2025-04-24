import { startOfWeek, endOfWeek, isSameWeek } from 'date-fns'

// Retorna o início e o fim da semana atual (segunda a domingo)
export const getCurrentWeekDates = () => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  return { weekStart, weekEnd }
}

// Retorna o início e o fim da semana de uma data específica
export const getWeekDates = (date: Date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  return { weekStart, weekEnd }
}

// Verifica se duas datas estão na mesma semana
export const areInSameWeek = (a: Date, b: Date) => {
  return isSameWeek(a, b, { weekStartsOn: 1 })
}
