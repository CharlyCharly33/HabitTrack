import { useState } from 'react'
import type { Habit } from '../../types/habit'
import { mockHabits } from '../../data/habits.mock'
import DailyProgress from './DailyProgress'
import WeeklySummary from './WeeklySummary'
import HabitGrid from '../habits/HabitGrid'
import EmptyState from '../ui/EmptyState'

interface DashboardIslandProps {
  todayLabel: string
}

function DashboardIsland({ todayLabel }: DashboardIslandProps) {
  const [habits, setHabits] = useState<Habit[]>(mockHabits)
  const activeHabits = habits.filter((habit) => habit.status === 'active')
  const completedCount = activeHabits.filter((habit) => habit.completedToday).length
  const hasHabits = activeHabits.length > 0

  function toggleHabit(id: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit,
      ),
    )
  }

  return (
    <div>
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HOY — {todayLabel}</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Buenos días,<br />Carlos.</h1>
      {hasHabits && (
        <p className="mt-5 text-[0.65rem] font-bold tracking-[0.16em] text-black/55">
          {activeHabits.length} HÁBITOS PARA HOY — {completedCount} COMPLETADOS
        </p>
      )}
      <div className="mt-8">
        {!hasHabits ? (
          <EmptyState
            title="Empieza con tu primer hábito."
            description="Crea una rutina sencilla y empieza a medir tu constancia."
            actionLabel="Crear mi primer hábito"
            actionHref="/app/habits"
          />
        ) : (
          <DailyProgress completed={completedCount} total={activeHabits.length} />
        )}
      </div>
      {hasHabits && (
        <>
          <div className="mt-8">
            <HabitGrid habits={activeHabits} onToggle={toggleHabit} />
          </div>
          <div className="mt-8">
            <WeeklySummary />
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardIsland
