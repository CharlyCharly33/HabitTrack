import type { Habit, HabitColor, HabitFrequency, HabitStatus, PausedPeriod } from '../types/habit'
import { todayKey, toggleDate } from './dates'
import { mockHabits } from './habits.mock'

// Clave versionada del almacenamiento local. Cambiar el sufijo permite
// migrar el formato sin mezclar datos de versiones anteriores.
export const HABIT_STORAGE_KEY = 'habittrack:v2:habits'

export interface NewHabitInput {
  title: string
  description?: string
  frequency: HabitFrequency
  days?: number[]
  color: HabitColor
}

export interface UpdateHabitInput {
  title: string
  description?: string
  frequency: HabitFrequency
  days?: number[]
  color: HabitColor
}

// Contrato de la capa de datos. La implementación actual persiste en
// localStorage; una futura implementación Supabase puede cumplir esta misma
// firma sin tocar los componentes.
export interface HabitRepository {
  listHabits(): Promise<Habit[]>
  createHabit(input: NewHabitInput): Promise<Habit[]>
  updateHabit(id: string, input: UpdateHabitInput): Promise<Habit[]>
  removeHabit(id: string): Promise<Habit[]>
  toggleHabitToday(id: string): Promise<Habit[]>
  setHabitStatus(id: string, status: HabitStatus): Promise<Habit[]>
}

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && DATE_KEY_PATTERN.test(value)
}

function normalizeDays(days: unknown): number[] {
  if (!Array.isArray(days)) {
    return []
  }
  const unique = new Set<number>()
  for (const day of days) {
    if (Number.isInteger(day) && (day as number) >= 0 && (day as number) <= 6) {
      unique.add(day as number)
    }
  }
  return [...unique].sort((a, b) => a - b)
}

function isFrequency(value: unknown): value is HabitFrequency {
  return value === 'daily' || value === 'weekdays' || value === 'custom'
}

function isColor(value: unknown): value is HabitColor {
  return value === 'blue' || value === 'orange' || value === 'green'
}

function clonePeriod(period: PausedPeriod): PausedPeriod {
  return { from: period.from, to: period.to }
}

function cloneHabit(habit: Habit): Habit {
  return {
    ...habit,
    days: habit.days ? [...habit.days] : undefined,
    completedDates: [...habit.completedDates],
    pausedPeriods: habit.pausedPeriods.map(clonePeriod),
  }
}

function cloneHabits(habits: Habit[]): Habit[] {
  return habits.map(cloneHabit)
}

function sanitizeHabit(value: unknown): Habit | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }
  const candidate = value as Record<string, unknown>
  if (typeof candidate['id'] !== 'string' || candidate['id'].length === 0) {
    return null
  }
  if (typeof candidate['title'] !== 'string' || candidate['title'].trim().length === 0) {
    return null
  }
  if (!isFrequency(candidate['frequency']) || !isColor(candidate['color'])) {
    return null
  }
  const status: HabitStatus = candidate['status'] === 'paused' ? 'paused' : 'active'
  const createdOn = isDateKey(candidate['createdOn']) ? candidate['createdOn'] : todayKey()
  const completedDates = Array.isArray(candidate['completedDates'])
    ? (candidate['completedDates'] as unknown[]).filter(isDateKey)
    : []
  const pausedPeriods: PausedPeriod[] = Array.isArray(candidate['pausedPeriods'])
    ? (candidate['pausedPeriods'] as unknown[])
        .filter((period): period is PausedPeriod => {
          if (typeof period !== 'object' || period === null) {
            return false
          }
          const entry = period as Record<string, unknown>
          return isDateKey(entry['from']) && (entry['to'] === null || isDateKey(entry['to']))
        })
        .map(clonePeriod)
    : []

  return {
    id: candidate['id'] as string,
    title: (candidate['title'] as string).trim(),
    description:
      typeof candidate['description'] === 'string' && candidate['description'].trim().length > 0
        ? (candidate['description'] as string).trim()
        : undefined,
    frequency: candidate['frequency'] as HabitFrequency,
    days:
      (candidate['frequency'] as HabitFrequency) === 'custom'
        ? normalizeDays(candidate['days'])
        : undefined,
    color: candidate['color'] as HabitColor,
    status,
    createdOn,
    completedDates: [...new Set(completedDates)].sort(),
    pausedPeriods,
  }
}

function buildSeed(): Habit[] {
  // Semilla fresca: mismos tres hábitos del mock, con createdOn del día local
  // actual para que las estadísticas nunca vean una fecha futura.
  return mockHabits.map((habit) => ({
    ...cloneHabit(habit),
    createdOn: todayKey(),
    completedDates: [],
    pausedPeriods: [],
  }))
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function persistHabits(storage: Storage, habits: Habit[]): void {
  try {
    storage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habits))
  } catch {
    throw new Error('No se pudo guardar tus hábitos en este navegador.')
  }
}

// Distingue clave ausente (null → sembrar una vez) de arreglo vacío
// existente ([] → respetar la decisión del usuario y no resembrar).
function loadCurrent(storage: Storage): Habit[] {
  let raw: string | null = null
  try {
    raw = storage.getItem(HABIT_STORAGE_KEY)
  } catch {
    throw new Error('No se pudo leer tus hábitos guardados.')
  }

  if (raw === null) {
    const seed = buildSeed()
    persistHabits(storage, seed)
    return seed
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    const seed = buildSeed()
    persistHabits(storage, seed)
    return seed
  }

  if (!Array.isArray(parsed)) {
    const seed = buildSeed()
    persistHabits(storage, seed)
    return seed
  }

  if (parsed.length === 0) {
    return []
  }

  const valid = parsed
    .map(sanitizeHabit)
    .filter((habit): habit is Habit => habit !== null)
  if (valid.length === 0) {
    const seed = buildSeed()
    persistHabits(storage, seed)
    return seed
  }
  return valid
}

function requireStorage(): Storage {
  const storage = getStorage()
  if (!storage) {
    throw new Error('El almacenamiento no está disponible en este momento.')
  }
  return storage
}

function newHabitId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `habit-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
}

function normalizeCustomDays(frequency: HabitFrequency, days: unknown): number[] | undefined {
  if (frequency !== 'custom') {
    return undefined
  }
  return normalizeDays(days)
}

export async function listHabits(): Promise<Habit[]> {
  const storage = requireStorage()
  return cloneHabits(loadCurrent(storage))
}

export async function createHabit(input: NewHabitInput): Promise<Habit[]> {
  const title = input.title.trim()
  if (title.length === 0) {
    throw new Error('El hábito necesita un título.')
  }
  const days = normalizeCustomDays(input.frequency, input.days)
  if (input.frequency === 'custom' && (!days || days.length === 0)) {
    throw new Error('Elige al menos un día para un hábito personalizado.')
  }
  const storage = requireStorage()
  const current = loadCurrent(storage)
  const habit: Habit = {
    id: newHabitId(),
    title,
    description: input.description?.trim() ? input.description.trim() : undefined,
    frequency: input.frequency,
    days,
    color: input.color,
    status: 'active',
    createdOn: todayKey(),
    completedDates: [],
    pausedPeriods: [],
  }
  const next = [...current.map(cloneHabit), habit]
  persistHabits(storage, next)
  return cloneHabits(next)
}

export async function updateHabit(id: string, input: UpdateHabitInput): Promise<Habit[]> {
  const title = input.title.trim()
  if (title.length === 0) {
    throw new Error('El hábito necesita un título.')
  }
  const days = normalizeCustomDays(input.frequency, input.days)
  if (input.frequency === 'custom' && (!days || days.length === 0)) {
    throw new Error('Elige al menos un día para un hábito personalizado.')
  }
  const storage = requireStorage()
  const current = loadCurrent(storage)
  // El historial se conserva: solo cambian título, descripción, programación y color.
  // Los cambios de programación recalculan posteriormente las estadísticas
  // utilizando el programa actual.
  const next = current.map((habit) =>
    habit.id === id
      ? {
          ...cloneHabit(habit),
          title,
          description: input.description?.trim() ? input.description.trim() : undefined,
          frequency: input.frequency,
          days,
          color: input.color,
        }
      : cloneHabit(habit),
  )
  persistHabits(storage, next)
  return cloneHabits(next)
}

export async function removeHabit(id: string): Promise<Habit[]> {
  const storage = requireStorage()
  const current = loadCurrent(storage)
  const next = current.filter((habit) => habit.id !== id).map(cloneHabit)
  persistHabits(storage, next)
  return cloneHabits(next)
}

export async function toggleHabitToday(id: string): Promise<Habit[]> {
  const today = todayKey()
  const storage = requireStorage()
  const current = loadCurrent(storage)
  const next = current.map((habit) =>
    habit.id === id
      ? { ...cloneHabit(habit), completedDates: toggleDate(habit.completedDates, today) }
      : cloneHabit(habit),
  )
  persistHabits(storage, next)
  return cloneHabits(next)
}

export async function setHabitStatus(id: string, status: HabitStatus): Promise<Habit[]> {
  const today = todayKey()
  const storage = requireStorage()
  const current = loadCurrent(storage)
  const next = current.map((habit) => {
    if (habit.id !== id) {
      return cloneHabit(habit)
    }
    const copy = cloneHabit(habit)
    if (status === 'paused') {
      // Solo abre un periodo si no existe otro abierto.
      const hasOpen = copy.pausedPeriods.some((period) => period.to === null)
      if (!hasOpen) {
        copy.pausedPeriods = [...copy.pausedPeriods, { from: today, to: null }]
      }
      copy.status = 'paused'
      return copy
    }
    // Cierra el periodo abierto en el día actual. Como isPausedOn() trata `to`
    // como primer día nuevamente activo (date < to), el día de reactivación
    // queda incluido y la pausa cubre [from, to).
    copy.pausedPeriods = copy.pausedPeriods.map((period, index) =>
      index === copy.pausedPeriods.length - 1 && period.to === null
        ? { ...period, to: today }
        : period,
    )
    copy.status = 'active'
    return copy
  })
  persistHabits(storage, next)
  return cloneHabits(next)
}

export const habitStore: HabitRepository = {
  listHabits,
  createHabit,
  updateHabit,
  removeHabit,
  toggleHabitToday,
  setHabitStatus,
}
