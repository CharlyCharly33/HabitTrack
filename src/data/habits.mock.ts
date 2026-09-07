import type { Habit } from '../types/habit'

// Mock temporal para Fase 1. Sin persistencia, sin backend.
// Migra los 3 hábitos de la demo actual al nuevo modelo Habit.
export const mockHabits: Habit[] = [
  {
    id: 'habit-water',
    title: 'Hidratación',
    description: 'Tomar 2 litros de agua',
    frequency: 'daily',
    color: 'blue',
    status: 'active',
    completedToday: false,
  },
  {
    id: 'habit-study',
    title: 'Estudio',
    description: 'Estudiar desarrollo web durante 45 minutos',
    frequency: 'weekdays',
    days: [1, 2, 3, 4, 5],
    color: 'orange',
    status: 'active',
    completedToday: false,
  },
  {
    id: 'habit-workout',
    title: 'Ejercicio',
    description: 'Realizar entrenamiento en el gimnasio',
    frequency: 'custom',
    days: [1, 2, 3, 4, 5],
    color: 'green',
    status: 'active',
    completedToday: false,
  },
]
