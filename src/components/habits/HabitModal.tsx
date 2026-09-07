import { useEffect, useRef, useState } from 'react'
import type { HabitColor, HabitFrequency } from '../../types/habit'
import { colorStyles } from './habitDisplay'

export interface HabitFormData {
  title: string
  description: string
  frequency: HabitFrequency
  days: number[]
  color: HabitColor
}

interface HabitModalProps {
  mode: 'create' | 'edit'
  initial: HabitFormData
  onClose: () => void
  onSave: (data: HabitFormData) => void
}

const frequencyOptions: Array<{ value: HabitFrequency; label: string }> = [
  { value: 'daily', label: 'DIARIO' },
  { value: 'weekdays', label: 'LUN — VIE' },
  { value: 'custom', label: 'DÍAS ESPECÍFICOS' },
]

const dayOptions: Array<{ value: number; label: string }> = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'X' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
]

const colorOptions: Array<{ value: HabitColor; label: string }> = [
  { value: 'blue', label: 'Azul' },
  { value: 'orange', label: 'Naranja' },
  { value: 'green', label: 'Verde' },
]

function HabitModal({ mode, initial, onClose, onSave }: HabitModalProps) {
  const [form, setForm] = useState<HabitFormData>(initial)
  const titleRef = useRef<HTMLInputElement>(null)
  const heading = mode === 'create' ? 'Nuevo hábito' : 'Editar hábito'
  const submitLabel = mode === 'create' ? 'CREAR HÁBITO' : 'GUARDAR CAMBIOS'
  const canSubmit = form.title.trim().length > 0 && (form.frequency !== 'custom' || form.days.length > 0)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  function toggleDay(value: number) {
    setForm((current) => ({
      ...current,
      days: current.days.includes(value)
        ? current.days.filter((day) => day !== value)
        : [...current.days, value],
    }))
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="max-h-[92svh] w-full max-w-lg overflow-y-auto border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.16em] text-[var(--color-accent)]">
              {mode === 'create' ? 'CREAR' : 'EDITAR'}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]" id="habit-modal-title">{heading}</h2>
          </div>
          <button
            className="shrink-0 border border-black/25 px-3 py-2 text-[0.65rem] font-bold tracking-[0.14em] text-black transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <form
          className="mt-8 flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault()
            if (canSubmit) {
              onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
            }
          }}
        >
          <label className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">
            TÍTULO
            <input
              ref={titleRef}
              className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-base font-medium outline-none focus:border-[var(--color-accent)]"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
              maxLength={60}
            />
          </label>
          <label className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">
            DESCRIPCIÓN <span className="font-medium normal-case tracking-normal text-black/40">(opcional)</span>
            <input
              className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-base font-medium outline-none focus:border-[var(--color-accent)]"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              maxLength={120}
            />
          </label>
          <fieldset>
            <legend className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">FRECUENCIA</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  className={`border px-2 py-3 text-[0.6rem] font-bold tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                    form.frequency === option.value
                      ? 'border-black bg-black text-white'
                      : 'border-black/25 text-black/60 hover:border-black hover:text-black'
                  }`}
                  type="button"
                  onClick={() => setForm({ ...form, frequency: option.value })}
                  aria-pressed={form.frequency === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          {form.frequency === 'custom' && (
            <fieldset>
              <legend className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">DÍAS</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {dayOptions.map((option) => {
                  const selected = form.days.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      className={`flex size-10 items-center justify-center border text-sm font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                        selected
                          ? 'border-black bg-black text-white'
                          : 'border-black/25 text-black/60 hover:border-black hover:text-black'
                      }`}
                      type="button"
                      onClick={() => toggleDay(option.value)}
                      aria-pressed={selected}
                      aria-label={`Día ${option.label}`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}
          <fieldset>
            <legend className="text-[0.6rem] font-bold tracking-[0.14em] text-black/55">COLOR</legend>
            <div className="mt-3 flex gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex items-center gap-2 border px-3 py-2.5 text-[0.6rem] font-bold tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                    form.color === option.value
                      ? 'border-black bg-black text-white'
                      : 'border-black/25 text-black/60 hover:border-black hover:text-black'
                  }`}
                  type="button"
                  onClick={() => setForm({ ...form, color: option.value })}
                  aria-pressed={form.color === option.value}
                >
                  <span aria-hidden="true" className={`size-2.5 rounded-full ${colorStyles[option.value]}`} />
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="border border-black/25 px-4 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-black transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              type="button"
              onClick={onClose}
            >
              CANCELAR
            </button>
            <button
              className="bg-black px-4 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black"
              type="submit"
              disabled={!canSubmit}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitModal
