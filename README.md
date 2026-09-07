# HabitTrack 2.0 — Fase 1: Productización UI/UX

HabitTrack es una aplicación personal para seguir hábitos diarios y construir constancia. Su objetivo de producto: responder en segundos qué hábitos tienes hoy, cuántos completaste y cómo evoluciona tu constancia, con una identidad editorial propia (crema, negro, naranja).

## Stack

- Astro
- React + React Islands
- TypeScript estricto
- Tailwind CSS v4 con `@tailwindcss/vite`
- Oxlint
- GitHub y Vercel

## Arquitectura: Astro + React Islands

Astro controla la estructura y las rutas. Solo las pantallas con interacción usan islas React con `client:load`:

- `/app` hidrata `DashboardIsland` (completar/deshacer hábitos del día).
- `/app/habits` hidrata `HabitsIsland` (crear, editar, eliminar, pausar, completar).
- `/`, `/login`, `/register` y `/app/progress` son esencialmente estáticas.

Los layouts comparten la base `Layout.astro`: `MarketingLayout` para la zona pública y `AppLayout` (con `AppHeader` y `MobileNav`) para la zona privada. Los tipos del dominio viven en `src/types/habit.ts` y los datos temporales en `src/data/habits.mock.ts`.

## Rutas

```text
/                Landing pública
/login           Inicio de sesión (visual)
/register        Registro (visual)
/app             Dashboard: hábitos de hoy, progreso diario, racha y semana
/app/habits      Gestión: listar, crear, editar, eliminar, pausar/activar
/app/progress    Progreso: consistencia, rachas, últimos 14 días
```

No existe `/app/profile` en el MVP: el perfil es un bloque mínimo integrado en el header.

## Estructura

```text
src/
├── components/
│   ├── dashboard/    DashboardIsland, DailyProgress, WeeklySummary, ProgressSummary
│   ├── habits/       HabitsIsland, HabitModal, HabitCard, HabitGrid, ManageHabitCard
│   ├── navigation/   AppHeader, MobileNav
│   └── ui/           EmptyState, ConfirmDialog
├── data/             habits.mock.ts (mock temporal)
├── layouts/          Layout, MarketingLayout, AppLayout
├── pages/            index, login, register, app/
├── styles/           global.css (tokens: crema, negro, naranja)
└── types/            habit.ts (Habit, HabitColor, HabitFrequency, HabitStatus)
```

## Estado actual: Fase 1 completada

- Landing pública real con hero, cómo funciona, ejemplo visual y CTA.
- Dashboard funcional con estado local: completar/deshacer, progreso diario, resumen semanal.
- Gestión completa de hábitos con modal único de crear/editar y confirmación propia de eliminado.
- Progreso con datos ilustrativos y navegación desktop + móvil con estado activo.

## Limitaciones actuales

- Datos mock en memoria (`src/data/habits.mock.ts`): al navegar entre rutas el estado se reinicia.
- Sin persistencia, sin autenticación real, sin backend.
- Rachas e historial de progreso son valores ilustrativos, no cálculos reales.

## Próximos pasos

- Supabase: Auth, PostgreSQL y persistencia real.
- Estadísticas reales calculadas desde el historial.
- Sincronización del estado entre rutas mediante la capa de datos.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run lint
npm run build
npm run preview
```

## Git Workflow

- `feature/productization-ui` concentra la Fase 1: base de arquitectura, landing, app shell, dashboard, gestión de hábitos y progreso.
