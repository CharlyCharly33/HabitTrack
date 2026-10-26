export type HabitColor = 'blue' | 'orange' | 'green'

export type HabitFrequency = 'daily' | 'weekdays' | 'custom'

export type HabitStatus = 'active' | 'paused'

export interface PausedPeriod {
  from: string
  to: string | null
}

export interface Habit {
  id: string
  title: string
  description?: string
  frequency: HabitFrequency
  days?: number[]
  color: HabitColor
  status: HabitStatus
  createdOn: string
  completedDates: string[]
  pausedPeriods: PausedPeriod[]
}
