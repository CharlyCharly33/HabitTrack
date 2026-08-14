import { useState } from 'react'
import Card, { type HabitVariant } from './Card'

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

  function toggleHabit(id: number) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === id ? { ...habit, completado: !habit.completado } : habit,
      ),
    )
  }

  return (
    <section className="tracker" id="habitos" aria-labelledby="tracker-title">
      <div className="progress-summary" id="progreso">
        <p className="eyebrow" id="tracker-title">PROGRESO DE HOY</p>
        <p className="progress-count">{completedCount} / {habits.length} COMPLETADOS</p>
      </div>
      <div className="habit-list">
        {habits.map((habit) => (
          <Card key={habit.id} titulo={habit.titulo} descripcion={habit.descripcion} frecuencia={habit.frecuencia} completado={habit.completado} variant={habit.variant} onToggle={() => toggleHabit(habit.id)} />
        ))}
      </div>
    </section>
  )
}

export default HabitTracker
