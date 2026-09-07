export type HabitColor = 'blue' | 'orange' | 'green'

export type HabitFrequency = 'daily' | 'weekdays' | 'custom'

export type HabitStatus = 'active' | 'paused'

export interface Habit {
  id: string
  title: string
  description?: string
  frequency: HabitFrequency
  days?: number[]
  color: HabitColor
  status: HabitStatus
  completedToday: boolean
}
