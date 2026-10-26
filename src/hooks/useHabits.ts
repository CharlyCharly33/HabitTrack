import { useCallback, useEffect, useState } from 'react'
import type { Habit } from '../types/habit'
import {
  createHabit as storeCreateHabit,
  listHabits as storeListHabits,
  removeHabit as storeRemoveHabit,
  setHabitStatus as storeSetHabitStatus,
  toggleHabitToday as storeToggleHabitToday,
  updateHabit as storeUpdateHabit,
  type NewHabitInput,
  type UpdateHabitInput,
} from '../data/habitStore'
import type { HabitStatus } from '../types/habit'

type LoadStatus = 'loading' | 'ready' | 'error'

function toMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }
  return 'Ocurrió un problema con tus hábitos guardados.'
}

// Hook compartido por DashboardIsland y HabitsIsland. Es la única vía por la
// que los componentes leen y escriben hábitos; localStorage queda encapsulado
// en habitStore.ts y nunca se toca desde la interfaz.
export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const loaded = await storeListHabits()
      setHabits(loaded)
      setStatus('ready')
    } catch (cause) {
      setError(toMessage(cause))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const loaded = await storeListHabits()
        if (active) {
          setHabits(loaded)
          setStatus('ready')
        }
      } catch (cause) {
        if (active) {
          setError(toMessage(cause))
          setStatus('error')
        }
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  const runMutation = useCallback(async (mutation: () => Promise<Habit[]>) => {
    try {
      const next = await mutation()
      setHabits(next)
      setStatus('ready')
      setError(null)
    } catch (cause) {
      setError(toMessage(cause))
      throw cause
    }
  }, [])

  const createHabit = useCallback(
    (input: NewHabitInput) => runMutation(() => storeCreateHabit(input)),
    [runMutation],
  )

  const updateHabit = useCallback(
    (id: string, input: UpdateHabitInput) => runMutation(() => storeUpdateHabit(id, input)),
    [runMutation],
  )

  const removeHabit = useCallback(
    (id: string) => runMutation(() => storeRemoveHabit(id)),
    [runMutation],
  )

  const toggleHabitToday = useCallback(
    (id: string) => runMutation(() => storeToggleHabitToday(id)),
    [runMutation],
  )

  const setHabitStatus = useCallback(
    (id: string, nextStatus: HabitStatus) => runMutation(() => storeSetHabitStatus(id, nextStatus)),
    [runMutation],
  )

  return {
    habits,
    isLoading: status === 'loading',
    loadError: status === 'error' ? error : null,
    actionError: status === 'ready' ? error : null,
    refresh,
    createHabit,
    updateHabit,
    removeHabit,
    toggleHabitToday,
    setHabitStatus,
  }
}
