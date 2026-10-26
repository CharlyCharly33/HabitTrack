import { isCompletedToday, todayKey } from '../../data/dates'
import { isPausedOn, isScheduledOn } from '../../data/habitStats'
import { useHabits } from '../../hooks/useHabits'
import DailyProgress from './DailyProgress'
import WeeklySummary from './WeeklySummary'
import HabitGrid from '../habits/HabitGrid'
import EmptyState from '../ui/EmptyState'

interface DashboardIslandProps {
  todayLabel: string
}

function DashboardIsland({ todayLabel }: DashboardIslandProps) {
  const { habits, isLoading, loadError, actionError, toggleHabitToday, refresh } = useHabits()
  const today = todayKey()
  const todaysHabits = habits.filter(
    (habit) => habit.status === 'active' && isScheduledOn(habit, today) && !isPausedOn(habit, today),
  )
  const completedCount = todaysHabits.filter((habit) => isCompletedToday(habit, today)).length
  const hasHabits = todaysHabits.length > 0

  async function handleToggle(id: string) {
    try {
      await toggleHabitToday(id)
    } catch {
      // El error de la acción ya queda expuesto en actionError.
    }
  }

  if (isLoading) {
    return (
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HOY — {todayLabel}</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Buenos días,<br />Carlos.</h1>
        <p className="mt-8 text-[0.65rem] font-bold tracking-[0.16em] text-black/55" role="status">
          CARGANDO TUS HÁBITOS…
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HOY — {todayLabel}</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Buenos días,<br />Carlos.</h1>
        <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7" role="alert">
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-black/55">NO SE PUDO CARGAR</p>
          <p className="mt-3 text-sm leading-relaxed text-black/60">{loadError}</p>
          <button
            className="mt-5 bg-black px-6 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={() => {
              void refresh()
            }}
          >
            REINTENTAR
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HOY — {todayLabel}</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Buenos días,<br />Carlos.</h1>
      {hasHabits && (
        <p className="mt-5 text-[0.65rem] font-bold tracking-[0.16em] text-black/55">
          {todaysHabits.length} HÁBITOS PARA HOY — {completedCount} COMPLETADOS
        </p>
      )}
      {actionError && (
        <p className="mt-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-black/60" role="alert">
          {actionError}
        </p>
      )}
      <div className="mt-8">
        {!hasHabits ? (
          habits.length === 0 ? (
            <EmptyState
              title="Empieza con tu primer hábito."
              description="Crea una rutina sencilla y empieza a medir tu constancia."
              actionLabel="Crear mi primer hábito"
              actionHref="/app/habits"
            />
          ) : (
            <EmptyState
              title="Nada programado para hoy."
              description="Tus hábitos están guardados. Crea uno para hoy o revisa tu lista."
              actionLabel="Ver mis hábitos"
              actionHref="/app/habits"
            />
          )
        ) : (
          <DailyProgress completed={completedCount} total={todaysHabits.length} />
        )}
      </div>
      {hasHabits && (
        <>
          <div className="mt-8">
            <HabitGrid habits={todaysHabits} onToggle={(id) => void handleToggle(id)} />
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
