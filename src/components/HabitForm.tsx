import { useState } from 'react'
import { type HabitVariant } from './Card'

export interface HabitFormValues {
  titulo: string
  descripcion: string
  frecuencia: string
  variant: HabitVariant
}

interface HabitFormProps {
  onAdd: (habit: HabitFormValues) => void
}

function HabitForm({ onAdd }: HabitFormProps) {
  const [values, setValues] = useState<HabitFormValues>({
    titulo: '',
    descripcion: '',
    frecuencia: '',
    variant: 'blue',
  })

  return (
    <form className="mt-8 grid gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:grid-cols-2 sm:p-6" onSubmit={(event) => {
      event.preventDefault()
      onAdd(values)
      setValues({ titulo: '', descripcion: '', frecuencia: '', variant: 'blue' })
    }}>
      <label className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">TÍTULO
        <input className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm font-medium outline-none focus:border-[var(--color-accent)]" onChange={(event) => setValues({ ...values, titulo: event.target.value })} required value={values.titulo} />
      </label>
      <label className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">FRECUENCIA
        <input className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm font-medium outline-none focus:border-[var(--color-accent)]" onChange={(event) => setValues({ ...values, frecuencia: event.target.value })} required value={values.frecuencia} />
      </label>
      <label className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55 sm:col-span-2">DESCRIPCIÓN
        <input className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm font-medium outline-none focus:border-[var(--color-accent)]" onChange={(event) => setValues({ ...values, descripcion: event.target.value })} required value={values.descripcion} />
      </label>
      <label className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">VARIANTE
        <select className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm font-medium outline-none focus:border-[var(--color-accent)]" onChange={(event) => setValues({ ...values, variant: event.target.value as HabitVariant })} value={values.variant}>
          <option value="blue">Azul</option>
          <option value="orange">Naranja</option>
          <option value="green">Verde</option>
        </select>
      </label>
      <button className="self-end bg-black px-4 py-3 text-[0.6rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]" type="submit">AÑADIR HÁBITO</button>
    </form>
  )
}

export default HabitForm
