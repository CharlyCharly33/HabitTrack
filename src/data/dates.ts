import type { Habit } from '../types/habit'

// Clave de fecha local YYYY-MM-DD para completedDates, createdOn y pausedPeriods.
// Usa componentes locales del dispositivo; nunca UTC/toISOString, para que
// "hoy" sea el día local real con corte a medianoche (decisión Fase 2).
export function todayKey(from: Date = new Date()): string {
  const year = from.getFullYear()
  const month = String(from.getMonth() + 1).padStart(2, '0')
  const day = String(from.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isCompletedToday(habit: Habit, today: string = todayKey()): boolean {
  return habit.completedDates.includes(today)
}

// Completar = añadir la clave si no existe; deshacer = eliminarla.
// Sin duplicados por construcción.
export function toggleDate(dates: string[], key: string): string[] {
  return dates.includes(key) ? dates.filter((date) => date !== key) : [...dates, key]
}
