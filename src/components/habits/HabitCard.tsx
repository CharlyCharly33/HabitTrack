import type { Habit } from '../../types/habit'
import { colorStyles, frequencyLabel } from './habitDisplay'

interface HabitCardProps {
  habit: Habit
  onToggle: () => void
}

function HabitCard({ habit, onToggle }: HabitCardProps) {
  const completed = habit.completedToday
  const status = completed ? 'COMPLETADO' : 'PENDIENTE'
  const action = completed ? 'DESHACER' : 'MARCAR COMPLETADO'

  return (
    <article
      className={`flex h-full flex-col justify-between bg-[var(--color-surface)] p-6 transition-colors sm:p-7 ${
        completed ? 'border border-[var(--color-accent)]' : 'border border-[var(--color-border)]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 text-[0.6rem] font-bold tracking-[0.16em]">
          <span className="text-black/50">{frequencyLabel(habit)}</span>
          <span className={completed ? 'flex items-center gap-1.5 text-[var(--color-accent)]' : 'flex items-center gap-1.5 text-black/45'}>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${completed ? 'bg-[var(--color-accent)]' : colorStyles[habit.color]}`} />
            {status}
          </span>
        </div>
        <div className="mt-10 flex items-center gap-2.5">
          <span aria-hidden="true" className={`size-2 rounded-full ${colorStyles[habit.color]}`} />
          <h3 className="text-2xl font-black tracking-[-0.06em]">{habit.title}</h3>
        </div>
        {habit.description && (
          <p className="mt-3 text-sm leading-relaxed text-black/60">{habit.description}</p>
        )}
      </div>
      <div className="mt-10">
        <button
          className="w-full bg-black px-4 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] sm:w-auto"
          type="button"
          onClick={onToggle}
          aria-pressed={completed}
        >
          {action}
        </button>
      </div>
    </article>
  )
}

export default HabitCard
