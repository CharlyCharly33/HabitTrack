## Why

Fase 1 dejó HabitTrack con UI real pero datos mock en memoria: el estado se pierde al navegar o recargar, y rachas y estadísticas son valores ilustrativos. Sin persistencia local, nada de lo construido es usable de verdad. Esta fase lo resuelve sin backend, sin autenticación y sin dependencias nuevas, y deja el modelo listo para migrar a Supabase después.

## What Changes

- El modelo `Habit` reemplaza `completedToday: boolean` por `completedDates: string[]` (fechas locales `YYYY-MM-DD).
- Se añaden `createdOn: string` y `pausedPeriods: Array<{ from: string; to: string | null }>` al modelo.
- Nueva capa de datos en `src/data/`: un único store persistido en `localStorage` que comparten `DashboardIsland` y `HabitsIsland`. Ningún componente importa `localStorage` directamente.
- Rachas y consistencia se calculan desde datos reales con las reglas aprobadas: ocasiones programadas consecutivas, días no programados ignorados, hoy pendiente no rompe racha, pausa como límite de racha, consistencia 7 días rodantes con estado sin-dato.
- Si el `localStorage` está vacío, se siembra una vez con `mockHabits` migrados al nuevo modelo.
- **BREAKING** (solo interno, sin usuarios reales): el shape de `Habit` cambia; `completedToday` desaparece.

## Capabilities

### New Capabilities

- `habit-tracking`: comportamiento del dominio de hábitos con persistencia local — completar/deshacer solo el día actual, racha por ocasiones programadas consecutivas, consistencia sobre 7 días rodantes, pausas que conservan historial y actúan como límite de racha, y persistencia del estado entre navegaciones y recargas.

### Modified Capabilities

- Ninguna (no existen specs previas).

## Impact

- Afectados: `src/types/habit.ts`, `src/data/`, `DashboardIsland`, `HabitsIsland`, `DailyProgress`, `WeeklySummary`, `ProgressSummary` (valores reales en vez de mock). La UI de Fase 1 no se rediseña; los componentes visuales (`HabitCard`, `ManageHabitCard`, `HabitModal`) no cambian salvo props ya existentes.
- Sin dependencias nuevas, sin Supabase, sin auth, sin cambios de rutas ni navegación.
