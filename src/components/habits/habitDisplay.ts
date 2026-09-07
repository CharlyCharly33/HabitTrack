import type { Habit, HabitColor } from '../../types/habit'

export const colorStyles: Record<HabitColor, string> = {
  blue: 'bg-[#3478f6]',
  orange: 'bg-[var(--color-accent)]',
  green: 'bg-[#2f9d62]',
}

export function frequencyLabel(habit: Habit): string {
  if (habit.frequency === 'daily') {
    return 'DIARIO'
  }
  if (habit.frequency === 'weekdays') {
    return 'LUN — VIE'
  }
  const days = habit.days?.length ?? 0
  return days > 0 ? `${days} DÍAS` : 'PERSONALIZADO'
}
