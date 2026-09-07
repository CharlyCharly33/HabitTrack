import type { Habit } from '../../types/habit'
import HabitCard from './HabitCard'

interface HabitGridProps {
  habits: Habit[]
  onToggle: (id: string) => void
}

function HabitGrid({ habits, onToggle }: HabitGridProps) {
  const ordered = [...habits].sort((a, b) => Number(a.completedToday) - Number(b.completedToday))

  return (
    <div className="grid gap-px border border-[var(--color-border)] bg-black/20 sm:grid-cols-2 xl:grid-cols-3">
      {ordered.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onToggle={() => onToggle(habit.id)} />
      ))}
    </div>
  )
}

export default HabitGrid
