import { useState } from 'react'
import Card, { type HabitVariant } from './Card'
import HabitForm, { type HabitFormValues } from './HabitForm'

interface Habit {
  id: number
  titulo: string
  descripcion: string
  frecuencia: string
  completado: boolean
  variant: HabitVariant
}

const initialHabits: Habit[] = [
  { id: 1, titulo: 'HIDRATACIÓN', descripcion: 'Tomar 2 litros de agua', frecuencia: 'DIARIO', completado: false, variant: 'blue' },
  { id: 2, titulo: 'ESTUDIO', descripcion: 'Estudiar desarrollo web durante 45 minutos', frecuencia: 'LUN - VIE', completado: false, variant: 'orange' },
  { id: 3, titulo: 'EJERCICIO', descripcion: 'Realizar entrenamiento en el gimnasio', frecuencia: '5 DÍAS', completado: false, variant: 'green' },
]

function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const completedCount = habits.filter((habit) => habit.completado).length
  const progressPercentage = (completedCount / habits.length) * 100
  const featuredHabit = habits[0]

  function toggleHabit(id: number) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === id ? { ...habit, completado: !habit.completado } : habit,
      ),
    )
  }

  function addHabit(habit: HabitFormValues) {
    setHabits((currentHabits) => [
      ...currentHabits,
      { ...habit, id: Date.now(), completado: false },
    ])
  }

  return (
    <>
      <section className="border-b border-black/15 py-16 sm:py-20" id="habits" aria-labelledby="habits-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">02 / HABITS</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl" id="habits-title">Hábitos como<br />estructura.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-black/60">Una misma estructura presenta contenido distinto según sus props.</p>
        </div>
        <HabitForm onAdd={addHabit} />
        <div className="mt-12 grid gap-px border border-[var(--color-border)] md:grid-cols-2 xl:grid-cols-3">
          {habits.map((habit) => (
            <Card key={habit.id} titulo={habit.titulo} descripcion={habit.descripcion} frecuencia={habit.frecuencia} completado={habit.completado} variant={habit.variant} onToggle={() => toggleHabit(habit.id)} />
          ))}
        </div>
      </section>
      <section className="py-16 sm:py-20" id="state" aria-labelledby="state-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">03 / STATE</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl" id="state-title">Un estado.<br />Una respuesta.</h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-black/60">El estado vive en React y se transmite al componente Card.</p>
          </div>
          <div className="grid gap-px border border-[var(--color-border)] bg-black/20 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <Card titulo={featuredHabit.titulo} descripcion={featuredHabit.descripcion} frecuencia={featuredHabit.frecuencia} completado={featuredHabit.completado} variant={featuredHabit.variant} onToggle={() => toggleHabit(featuredHabit.id)} />
            <aside className="flex flex-col justify-between bg-[var(--color-accent)] p-6 sm:p-7" aria-label="Estado actual">
              <div>
                <p className="text-[0.6rem] font-bold tracking-[0.16em] text-black/60">CURRENT VALUE</p>
                <p className="mt-3 text-3xl font-black tracking-[-0.07em]">{featuredHabit.completado ? 'TRUE' : 'FALSE'}</p>
                <p className="mt-10 text-[0.6rem] font-bold tracking-[0.16em] text-black/60">TODAY / {completedCount} OF {habits.length}</p>
                <p className="mt-2 text-xl font-black">{Math.round(progressPercentage)}%</p>
                <div className="mt-4 h-px bg-black/25" aria-label={`${progressPercentage}% completado`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={progressPercentage} role="progressbar">
                  <div className="h-full bg-black transition-[width] duration-300" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              <button className="mt-12 bg-black px-4 py-3 text-[0.6rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black" type="button" onClick={() => toggleHabit(featuredHabit.id)}>TOGGLE STATE</button>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default HabitTracker
