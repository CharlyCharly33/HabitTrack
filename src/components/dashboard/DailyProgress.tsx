interface DailyProgressProps {
  completed: number
  total: number
}

function DailyProgress({ completed, total }: DailyProgressProps) {
  if (total === 0) {
    return null
  }

  const percentage = Math.round((completed / total) * 100)

  return (
    <div className="border border-[var(--color-border)] bg-black p-6 text-white sm:p-7" aria-label="Progreso de hoy">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.6rem] font-bold tracking-[0.16em] text-white/60">
          {completed} DE {total} COMPLETADOS
        </p>
        <p className="text-4xl font-black tracking-[-0.07em] sm:text-5xl">{percentage}%</p>
      </div>
      <div
        className="mt-5 h-[3px] bg-white/20"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label={`${percentage}% completado`}
      >
        <div className="h-full bg-[var(--color-accent)] transition-[width] duration-300" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default DailyProgress
