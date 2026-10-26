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

- Persistencia local mediante `src/data/habitStore.ts` y `src/hooks/useHabits.ts`; todavía sin sincronización remota.
- Sin autenticación real ni backend conectado a los hábitos.
- Rachas e historial de progreso son valores ilustrativos, no cálculos reales.

## Próximos pasos

- Supabase: Auth, PostgreSQL y persistencia real.
- Estadísticas reales calculadas desde el historial.
- Sincronización del estado entre rutas mediante la capa de datos.

## Comandos

### Supabase: foundation

La base técnica usa `@supabase/supabase-js` y el cliente reutilizable de
`src/lib/supabase/client.ts`. Aún no hay tablas, autenticación ni persistencia
remota: los hábitos siguen guardándose en **localStorage** mediante
`src/data/habitStore.ts` y `src/hooks/useHabits.ts`.

Para preparar la configuración local, copia `.env.example` a `.env` y reemplaza
los placeholders:

- `PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase.
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave pública publishable del proyecto (`sb_publishable_...`). Las claves secret/service_role están prohibidas en frontend.

`.env` está ignorado por Git. Las variables `PUBLIC_*` son visibles en el navegador;
no deben contener secretos. Reinicia el servidor de desarrollo después de cambiarlas.
En un despliegue estático se configuran antes de compilar.

El cliente valida ambas variables al importar el módulo y lanza un error claro
si faltan o conservan los placeholders. La UI todavía no lo importa, por lo que
el build actual no requiere credenciales. Las sesiones persistentes, la renovación
de tokens y la detección de callbacks están desactivadas en esta fase.

Validación mínima: `npm run check` comprueba el tipado del módulo y la importación
del SDK; `npm run lint` y `npm run build` verifican la integración técnica.
Estas comprobaciones no validan credenciales ni conectividad con un proyecto remoto
y no realizan consultas a tablas.

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
