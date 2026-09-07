import type { Habit } from '../../types/habit'
import { colorStyles, frequencyLabel } from './habitDisplay'

interface ManageHabitCardProps {
  habit: Habit
  onToggleToday: () => void
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

function ManageHabitCard({ habit, onToggleToday, onEdit, onToggleStatus, onDelete }: ManageHabitCardProps) {
  const paused = habit.status === 'paused'
  const completed = habit.completedToday

  return (
    <article
      className={`flex h-full flex-col justify-between bg-[var(--color-surface)] p-6 sm:p-7 ${
        paused ? 'border border-[var(--color-border)] opacity-60' : 'border border-[var(--color-border)]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 text-[0.6rem] font-bold tracking-[0.16em]">
          <span className="text-black/50">{frequencyLabel(habit)}</span>
          <span className={completed && !paused ? 'flex items-center gap-1.5 text-[var(--color-accent)]' : 'flex items-center gap-1.5 text-black/45'}>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${completed && !paused ? 'bg-[var(--color-accent)]' : colorStyles[habit.color]}`} />
            {paused ? 'PAUSADO' : completed ? 'COMPLETADO' : 'PENDIENTE'}
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
      <div className="mt-10 flex flex-col gap-4 border-t border-black/15 pt-4">
        <button
          className="w-full border border-black/25 px-4 py-2.5 text-[0.6rem] font-bold tracking-[0.14em] text-black/70 transition-colors hover:border-black hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          onClick={onToggleToday}
          disabled={paused}
          aria-pressed={completed}
        >
          {completed ? 'DESHACER HOY' : 'COMPLETAR HOY'}
        </button>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.6rem] font-bold tracking-[0.14em]">
          <button
            className="text-black/55 underline decoration-black/25 underline-offset-4 transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={onEdit}
          >
            EDITAR
          </button>
          <button
            className="text-black/55 underline decoration-black/25 underline-offset-4 transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={onToggleStatus}
          >
            {paused ? 'ACTIVAR' : 'PAUSAR'}
          </button>
          <button
            className="text-black/55 underline decoration-black/25 underline-offset-4 transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={onDelete}
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </article>
  )
}

export default ManageHabitCard
