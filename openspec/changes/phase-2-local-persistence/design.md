## Context

Fase 1 dejó dos islas React (`DashboardIsland`, `HabitsIsland`) con `useState(mockHabits)` independientes: dos fuentes de verdad que se pierden al navegar. El modelo `Habit` usa `completedToday: boolean`, que no puede representar historial. Ver proposal.md (Why) para la motivación. Los requisitos de comportamiento están en `specs/habit-tracking/spec.md`.

## Goals / Non-Goals

**Goals:**

- Una sola fuente de verdad compartida entre ambas islas, persistida en `localStorage`.
- Modelo capaz de historial, rachas y consistencia reales según las reglas aprobadas.
- Interfaz de la capa de datos con semántica async desde el día uno, para que Supabase la implemente después sin tocar la UI.

**Non-Goals:**

- Supabase, auth, rutas protegidas, sincronización entre pestañas, versionado de programas, gráficos nuevos, rediseño visual.

## Decisions

### 1. `completedDates: string[]` reemplaza `completedToday`

Fechas locales `YYYY-MM-DD`; presencia = completado, ausencia = no completado. Elegido sobre `Record<fecha, boolean>` porque la ausencia tiene un solo significado (sin dilema `delete` vs `false` huérfano), deshacer es quitar el elemento, y migra a una tabla relacional canónica (`habit_completions(habit_id, completed_on)`). Ver exploración previa en la conversación del change. Derivación `isCompletedToday = dates.includes(todayKey())`; duplicados imposibles mediante guarda `includes` antes de insertar.

### 2. `createdOn: string` (día, no timestamp)

Fecha local `YYYY-MM-DD` fijada al crear. Se usa `createdOn` y no `createdAt` porque las reglas consumen días, no instantes. Excluye fechas previas del denominador de consistencia y detiene la racha hacia atrás. Migra a `timestamptz` en Supabase sin fricción.

### 3. `pausedPeriods: Array<{ from: string; to: string | null }>`

`from` = primer día pausado, `to` = primer día nuevamente activo, `null` = pausa vigente. Se escribe un intervalo al pausar (`to: null`) y se cierra al reanudar. Alternativa descartada: solo `status` actual — imposibilita la regla "la pausa no une rachas" porque al reanudar se pierde cuándo empezó la pausa. El historial (`completedDates`) nunca se borra al pausar.

### 4. `todayKey()` centralizado en `src/data/`

Una única utilidad construye la clave con componentes locales (`getFullYear/getMonth/getDate`); prohibido `toISOString()` para claves (bug de día equivocado en UTC-X). Corte a medianoche local; sin manejo de zonas ni corte 3–4am en Fase 2 (decisión de producto documentada).

### 5. Store único con semántica async, `localStorage` encapsulado

Un módulo en `src/data/` expone `listHabits, toggleToday, createHabit, updateHabit, removeHabit, setStatus` como funciones async aunque resuelvan síncrono hoy. Ningún `.tsx` importa `localStorage`. Las islas consumen vía hook con suscripción (p. ej. `useSyncExternalStore`, cero dependencias). `HabitFormData` sigue viviendo junto al modal. Siembra única con `mockHabits` migrados cuando el storage está vacío.

### 6. `weekdays` se normaliza, no se elimina

El enum `daily | weekdays | custom` se mantiene por la UI del modal, pero todo cálculo pasa por `scheduledWeekdays(habit)`: `daily → todos`, `weekdays → [1,2,3,4,5]`, `custom → habit.days`. Una sola rama de verdad; `weekdays` es preset.

### 7. Racha y consistencia como funciones puras del modelo

`currentStreak(habit, today)`: anclar en hoy (si programado+pendiente, empezar ayer); caminar atrás saltando no-programados; detenerse ante fallo real, pausa o `createdOn`. `consistency7d`: completadas / ocasiones válidas en ventana rodante excluyendo pre-`createdOn`, no-programados y pausas; denominador 0 → sin-dato. Sin estado adicional, testeables sin React, reutilizables por el futuro servicio Supabase.

## Risks / Trade-offs

- [Riesgo] Cambiar el programa recalcula el pasado con el programa nuevo (historial "reescrito") → Mitigación: limitación documentada en spec y README; programas versionados quedan para Fase 3+ si el producto lo pide.
- [Riesgo] `localStorage` lleno o corrupto (JSON inválido) → Mitigación: parse defensivo con fallback a siembra inicial; sin datos del usuario real aún, el costo es bajo.
- [Riesgo] Viajes entre zonas horarias recalculan "hoy" → Mitigación: aceptado y documentado; el formato `date` de PostgreSQL hereda la misma semántica.
- [Trade-off] Firma async con implementación síncrona añade `await`s hoy a cambio de cero churn en la UI cuando llegue Supabase. Se acepta conscientemente.

## Migration Plan

Despliegue: solo frontend estático, sin migraciones. Siembra una vez si storage vacío; hábitos del mock obtienen `createdOn` = día de siembra y `completedDates: []`. Rollback: borrar la clave de `localStorage` restaura el estado inicial. Sin pasos de servidor.

## Open Questions

Ninguna que cambie specs, enfoque o tareas. Detalle menor diferible: nombre exacto de la clave `localStorage` (p. ej. `habittrack:v1:habits`) y política de versionado de esquema local — se fija al implementar, sin impacto en el diseño.
