import { useState } from 'react'
import { useHabits } from '../../hooks/useHabits'
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

function HabitsIsland() {
  const {
    habits,
    isLoading,
    loadError,
    actionError,
    refresh,
    createHabit,
    updateHabit,
    removeHabit,
    toggleHabitToday,
    setHabitStatus,
  } = useHabits()
  const [modal, setModal] = useState<ModalState | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const activeCount = habits.filter((habit) => habit.status === 'active').length
  const pausedCount = habits.length - activeCount
  const habitToDelete = habits.find((habit) => habit.id === deleteId) ?? null
  const habitToEdit = modal?.mode === 'edit' ? habits.find((habit) => habit.id === modal.habitId) ?? null : null

  function closeModal() {
    setModal(null)
  }

  async function saveHabit(data: HabitFormData) {
    try {
      if (modal?.mode === 'edit' && modal.habitId) {
        await updateHabit(modal.habitId, {
          title: data.title,
          description: data.description,
          frequency: data.frequency,
          days: data.days,
          color: data.color,
        })
      } else {
        await createHabit({
          title: data.title,
          description: data.description,
          frequency: data.frequency,
          days: data.days,
          color: data.color,
        })
      }
      closeModal()
    } catch {
      // El error queda expuesto en actionError sin cerrar el modal.
    }
  }

  async function toggleToday(id: string) {
    try {
      await toggleHabitToday(id)
    } catch {
      // El error queda expuesto en actionError.
    }
  }

  async function toggleStatus(id: string) {
    const habit = habits.find((entry) => entry.id === id)
    if (!habit) {
      return
    }
    try {
      await setHabitStatus(id, habit.status === 'active' ? 'paused' : 'active')
    } catch {
      // El error queda expuesto en actionError.
    }
  }

  async function confirmDelete() {
    if (deleteId) {
      try {
        await removeHabit(deleteId)
      } catch {
        return
      }
    }
    setDeleteId(null)
  }

  if (isLoading) {
    return (
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HÁBITOS</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Tus hábitos.</h1>
        <p className="mt-8 text-[0.65rem] font-bold tracking-[0.16em] text-black/55" role="status">
          CARGANDO TUS HÁBITOS…
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">HÁBITOS</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Tus hábitos.</h1>
        <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8" role="alert">
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
      {actionError && (
        <p className="mt-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-black/60" role="alert">
          {actionError}
        </p>
      )}
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
                onToggleToday={() => void toggleToday(habit.id)}
                onEdit={() => setModal({ mode: 'edit', habitId: habit.id })}
                onToggleStatus={() => void toggleStatus(habit.id)}
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
          onSave={(data) => void saveHabit(data)}
        />
      )}
      {habitToDelete && (
        <ConfirmDialog
          title="Eliminar hábito"
          description={`¿Seguro que quieres eliminar “${habitToDelete.title}”? Esta acción no se puede deshacer.`}
          cancelLabel="CANCELAR"
          confirmLabel="ELIMINAR"
          onCancel={() => setDeleteId(null)}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </div>
  )
}

export default HabitsIsland
