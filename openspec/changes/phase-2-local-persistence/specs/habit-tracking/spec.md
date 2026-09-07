## Purpose

HabitTrack registra hábitos diarios con historial real, calcula rachas y consistencia sobre ocasiones programadas, y conserva el estado del usuario entre navegaciones y recargas usando persistencia local.

## ADDED Requirements

### Requirement: Completar y deshacer el día actual

The system SHALL allow the user to mark any active habit as completed for the current day and to undo that mark. Only the current day can be completed or undone; historical completions cannot be edited and future dates cannot be marked.

#### Scenario: Completar un hábito hoy

- **WHEN** the user marks an active, non-completed habit for today
- **THEN** the habit shows as completed and today's progress count increases by one

#### Scenario: Deshacer el completado de hoy

- **WHEN** the user undoes a habit completed today
- **THEN** the habit returns to pending exactly as if it had never been marked, and today's progress count decreases by one

#### Scenario: Fechas fuera del día actual

- **WHEN** the user attempts to edit a past completion or mark a future date
- **THEN** the system offers no such action (Fase 2 exposes no UI for it)

### Requirement: Persistencia local del estado

The system SHALL persist all habit data locally so that habits, completions, pauses and edits survive page reloads and navigation between routes. On first run with empty storage, the system SHALL seed once with the default habits.

#### Scenario: Recargar conserva el estado

- **WHEN** the user reloads `/app` after completing a habit
- **THEN** the habit still shows as completed and progress is unchanged

#### Scenario: Navegar conserva el estado

- **WHEN** the user creates a habit in `/app/habits` and navigates to `/app`
- **THEN** the new habit appears in the dashboard

### Requirement: Racha por ocasiones programadas

The system SHALL compute each habit's streak as consecutive completed scheduled occasions, not calendar days. Unscheduled days SHALL be ignored: they neither extend nor break the streak. A scheduled past occasion that is pending SHALL keep the visible streak anchored on previous occasions (today pending never breaks the streak; only a past scheduled occasion left uncompleted breaks it).

#### Scenario: Hábito de lunes, miércoles y viernes completado

- **WHEN** a Mon/Wed/Fri habit is completed on all three days of a week
- **THEN** its streak is 3, regardless of Tuesday and Thursday having no completions

#### Scenario: Hoy programado pero pendiente

- **WHEN** today is scheduled for a habit with a streak of 4 and today is still pending
- **THEN** the visible streak remains 4

#### Scenario: Ocasión pasada no completada

- **WHEN** a scheduled past occasion has no completion
- **THEN** the streak counts only occasions after that miss

### Requirement: Pausa conserva historial y limita racha

The system SHALL preserve all completion history when a habit is paused. A paused period SHALL NOT count as non-compliance, and it SHALL act as a streak boundary: the streak MUST stop at the pause and MUST NOT bridge across it to earlier occasions.

#### Scenario: Pausar y reanudar

- **WHEN** a habit with completions on Mon/Tue is paused Wed–Fri and resumed Sat
- **THEN** Mon/Tue completions remain in history, Wed–Fri count as neither completed nor missed, and the current streak does not include Mon/Tue

#### Scenario: Hábito pausado en el dashboard

- **WHEN** a habit is paused
- **THEN** it no longer appears in `/app` but remains listed in `/app/habits` in a visually attenuated state

### Requirement: Consistencia sobre 7 días rodantes

The system SHALL compute consistency as completed occasions divided by valid scheduled occasions within the last 7 rolling days. Dates before the habit's creation day, unscheduled days, and days inside paused periods SHALL be excluded from the denominator. When no valid occasions exist in the window, the system SHALL show a no-data state instead of 0%.

#### Scenario: Hábito nuevo a mitad de ventana

- **WHEN** a Mon/Wed/Fri habit created on Thursday has its Friday occasion completed
- **THEN** its consistency is 1/1 (100%), not 1/7

#### Scenario: Ventana sin ocasiones válidas

- **WHEN** a habit has no valid scheduled occasions in the last 7 days
- **THEN** the UI shows a no-data state, never 0%

### Requirement: Programación actual rige el historial

The system SHALL compute all statistics using the habit's current schedule. Changing a habit's schedule recalculates history with the new schedule; historical schedules are not versioned (known Fase 2 limitation).

#### Scenario: Cambiar días programados

- **WHEN** the user changes a habit from Mon/Wed/Fri to daily
- **THEN** past statistics are recomputed as if the daily schedule had always applied
