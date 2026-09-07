function WeeklySummary() {
  return (
    <section className="grid gap-px border border-[var(--color-border)] bg-black/20 sm:grid-cols-2" aria-label="Resumen semanal">
      <div className="bg-[var(--color-surface)] p-6 sm:p-7">
        <p className="text-[0.6rem] font-bold tracking-[0.16em] text-black/50">RACHA ACTUAL</p>
        <p className="mt-4 text-4xl font-black tracking-[-0.07em]">6 <span className="text-xl">DÍAS</span></p>
      </div>
      <div className="bg-[var(--color-surface)] p-6 sm:p-7">
        <p className="text-[0.6rem] font-bold tracking-[0.16em] text-black/50">ESTA SEMANA</p>
        <p className="mt-4 text-4xl font-black tracking-[-0.07em]">82<span className="text-[var(--color-accent)]">%</span></p>
      </div>
    </section>
  )
}

export default WeeklySummary
