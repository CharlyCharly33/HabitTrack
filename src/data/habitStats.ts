import type { Habit } from '../types/habit'
import { todayKey } from './dates'

// Conversión Date <-> clave YYYY-MM-DD en fecha local.
// todayKey() es la única vía para generar claves (nunca toISOString/UTC).
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDaysToKey(key: string, delta: number): string {
  const date = parseDateKey(key)
  date.setDate(date.getDate() + delta)
  return todayKey(date)
}

export function weekdayOfKey(key: string): number {
  return parseDateKey(key).getDay()
}

// Días de semana programados (0 = domingo ... 6 = sábado, igual que getDay()).
// 'weekdays' se normaliza a [1,2,3,4,5]: es un preset de UI sobre custom.
export function scheduledWeekdays(habit: Habit): number[] {
  if (habit.frequency === 'daily') {
    return [0, 1, 2, 3, 4, 5, 6]
  }
  if (habit.frequency === 'weekdays') {
    return [1, 2, 3, 4, 5]
  }
  return habit.days ? [...habit.days] : []
}

export function isScheduledOn(habit: Habit, date: string | Date): boolean {
  const key = date instanceof Date ? todayKey(date) : date
  return scheduledWeekdays(habit).includes(weekdayOfKey(key))
}

// from = primer día pausado; to = primer día nuevamente activo;
// to === null significa pausa vigente. Pausa si date >= from y (to === null o date < to).
export function isPausedOn(habit: Habit, date: string | Date): boolean {
  const key = date instanceof Date ? todayKey(date) : date
  return habit.pausedPeriods.some((period) => key >= period.from && (period.to === null || key < period.to))
}

// Racha = ocasiones programadas consecutivas completadas.
// Hoy programado y pendiente no rompe: se ancla en el día anterior.
// Una ocasión pasada sin completar, una pausa o createdOn detienen la búsqueda.
export function currentStreak(habit: Habit, today: string = todayKey()): number {
  let streak = 0
  let cursor = today

  if (
    cursor >= habit.createdOn
    && !isPausedOn(habit, cursor)
    && isScheduledOn(habit, cursor)
    && !habit.completedDates.includes(cursor)
  ) {
    cursor = addDaysToKey(cursor, -1)
  }

  while (cursor >= habit.createdOn) {
    if (isPausedOn(habit, cursor)) {
      break
    }
    if (!isScheduledOn(habit, cursor)) {
      cursor = addDaysToKey(cursor, -1)
      continue
    }
    if (!habit.completedDates.includes(cursor)) {
      break
    }
    streak += 1
    cursor = addDaysToKey(cursor, -1)
  }

  return streak
}

export interface Consistency {
  completed: number
  total: number
  rate: number | null
}

// Consistencia sobre los últimos 7 días rodantes incluyendo hoy.
// Excluye fechas previas a createdOn, días no programados y días en pausa.
// Sin ocasiones válidas: rate === null (estado sin dato, nunca 0%).
export function consistency7d(habit: Habit, today: string = todayKey()): Consistency {
  let completed = 0
  let total = 0

  for (let offset = 6; offset >= 0; offset -= 1) {
    const key = addDaysToKey(today, -offset)
    if (key < habit.createdOn) {
      continue
    }
    if (!isScheduledOn(habit, key)) {
      continue
    }
    if (isPausedOn(habit, key)) {
      continue
    }
    total += 1
    if (habit.completedDates.includes(key)) {
      completed += 1
    }
  }

  return { completed, total, rate: total === 0 ? null : completed / total }
}
