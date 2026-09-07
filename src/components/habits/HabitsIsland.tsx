import { useState } from 'react'
import type { Habit } from '../../types/habit'
import { mockHabits } from '../../data/habits.mock'
import HabitModal, { type HabitFormData } from './HabitModal'
import ManageHabitCard from './ManageHabitCard'
import EmptyState from '../ui/EmptyState'
import ConfirmDialog from '../ui/ConfirmDialog'

interface ModalState {
  mode: 'create' | 'edit'
  habitId: string | null
}

const emptyForm: HabitFormData = {
  title: '',
  description: '',
  frequency: 'daily',
  days: [],
  color: 'orange',
}

function newHabitId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `habit-${Math.random().toString(36).slice(2)}`
}

function HabitsIsland() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const activeCount = habits.filter((habit) => habit.status === 'active').length
  const pausedCount = habits.length - activeCount
  const habitToDelete = habits.find((habit) => habit.id === deleteId) ?? null
  const habitToEdit = modal?.mode === 'edit' ? habits.find((habit) => habit.id === modal.habitId) ?? null : null

  function closeModal() {
    setModal(null)
  }

  function saveHabit(data: HabitFormData) {
    if (modal?.mode === 'edit' && modal.habitId) {
      const habitId = modal.habitId
      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === habitId
            ? { ...habit, title: data.title, description: data.description || undefined, frequency: data.frequency, days: data.frequency === 'custom' ? [...data.days].sort() : undefined, color: data.color }
            : habit,
        ),
      )
    } else {
      setHabits((currentHabits) => [
        ...currentHabits,
        {
          id: newHabitId(),
          title: data.title,
          description: data.description || undefined,
          frequency: data.frequency,
          days: data.frequency === 'custom' ? [...data.days].sort() : undefined,
          color: data.color,
          status: 'active',
          completedToday: false,
        },
      ])
    }
    closeModal()
  }

  function toggleToday(id: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit,
      ),
    )
  }

  function toggleStatus(id: string) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === id ? { ...habit, status: habit.status === 'active' ? 'paused' : 'active' } : habit,
      ),
    )
  }

  function confirmDelete() {
    if (deleteId) {
      const id = deleteId
      setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id))
    }
    setDeleteId(null)
  }

  return (
    <div>
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HÁBITOS</p>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Tus hábitos.</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-black/60">Organiza lo que quieres mantener.</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-black/55">
          {activeCount} ACTIVOS — {pausedCount} PAUSADOS
        </p>
        <button
          className="bg-black px-6 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] sm:w-auto"
          type="button"
          onClick={() => setModal({ mode: 'create', habitId: null })}
        >
          + NUEVO HÁBITO
        </button>
      </div>
      <div className="mt-8">
        {habits.length === 0 ? (
          <EmptyState
            title="Tus hábitos empiezan aquí."
            description="Crea el primero y empieza a construir constancia."
            actionLabel="Crear hábito"
            onAction={() => setModal({ mode: 'create', habitId: null })}
          />
        ) : (
          <div className="grid gap-px border border-[var(--color-border)] bg-black/20 sm:grid-cols-2 xl:grid-cols-3">
            {habits.map((habit) => (
              <ManageHabitCard
                key={habit.id}
                habit={habit}
                onToggleToday={() => toggleToday(habit.id)}
                onEdit={() => setModal({ mode: 'edit', habitId: habit.id })}
                onToggleStatus={() => toggleStatus(habit.id)}
                onDelete={() => setDeleteId(habit.id)}
              />
            ))}
          </div>
        )}
      </div>
      {modal && (
        <HabitModal
          key={modal.mode === 'edit' ? modal.habitId ?? 'create' : 'create'}
          mode={modal.mode}
          initial={
            habitToEdit
              ? {
                  title: habitToEdit.title,
                  description: habitToEdit.description ?? '',
                  frequency: habitToEdit.frequency,
                  days: habitToEdit.days ? [...habitToEdit.days] : [],
                  color: habitToEdit.color,
                }
              : emptyForm
          }
          onClose={closeModal}
          onSave={saveHabit}
        />
      )}
      {habitToDelete && (
        <ConfirmDialog
          title="Eliminar hábito"
          description={`¿Seguro que quieres eliminar “${habitToDelete.title}”? Esta acción no se puede deshacer.`}
          cancelLabel="CANCELAR"
          confirmLabel="ELIMINAR"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}

export default HabitsIsland
