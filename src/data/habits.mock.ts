import type { Habit } from '../types/habit'
import { todayKey } from './dates'

// Semilla temporal para el store de Fase 2. Sin persistencia propia ni backend.
// Los 3 hábitos de la demo en el nuevo modelo: historial vacío, creados hoy,
// sin pausas. El store los sembrará una sola vez cuando el storage esté vacío.
export const mockHabits: Habit[] = [
  {
    id: 'habit-water',
    title: 'Hidratación',
    description: 'Tomar 2 litros de agua',
    frequency: 'daily',
    color: 'blue',
    status: 'active',
    createdOn: todayKey(),
    completedDates: [],
    pausedPeriods: [],
  },
  {
    id: 'habit-study',
    title: 'Estudio',
    description: 'Estudiar desarrollo web durante 45 minutos',
    frequency: 'weekdays',
    days: [1, 2, 3, 4, 5],
    color: 'orange',
    status: 'active',
    createdOn: todayKey(),
    completedDates: [],
    pausedPeriods: [],
  },
  {
    id: 'habit-workout',
    title: 'Ejercicio',
    description: 'Realizar entrenamiento en el gimnasio',
    frequency: 'custom',
    days: [1, 2, 3, 4, 5],
    color: 'green',
    status: 'active',
    createdOn: todayKey(),
    completedDates: [],
    pausedPeriods: [],
  },
]
