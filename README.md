# HabitTrack

HabitTrack es una aplicación de seguimiento de hábitos diarios. Presenta componentes reutilizables, props tipadas y estado local de React dentro de una página Astro con diseño editorial y Tailwind CSS v4.

## Objetivo

Demostrar React, TypeScript, props, `useState`, Tailwind CSS v4, Astro y React Islands sin backend, autenticación ni almacenamiento permanente.

## Stack Tecnológico

- Astro
- React y React Islands
- TypeScript estricto
- Tailwind CSS v4 con `@tailwindcss/vite`
- Oxlint
- GitHub y Vercel

## Arquitectura

Astro controla la estructura de la página mediante `Layout.astro` e `index.astro`. Los componentes estáticos React se renderizan en servidor. `HabitTracker` usa `client:load` porque contiene el estado y los eventos del usuario.

## Estructura

```text
src/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── HabitForm.tsx
│   ├── HabitTracker.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   └── UserCard.tsx
├── layouts/
│   └── Layout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css
```

## Componentes y TypeScript

- `Header` y `Hero` son componentes React estáticos.
- `UserCard` recibe `nombre` y `objetivo` mediante `UserCardProps`.
- `Card` recibe las props de cada hábito y usa `HabitVariant` (`blue`, `orange`, `green`).
- `Button` recibe texto y callback tipados.
- `HabitForm` recibe `HabitFormProps` y usa `HabitFormValues` para añadir hábitos.

`HabitTracker` administra un único `useState<Habit[]>`. El contador y el porcentaje de progreso se derivan de ese estado. Los toggles y los nuevos hábitos actualizan el array de forma inmutable.

## React Islands

`src/pages/index.astro` hidrata únicamente:

```astro
<HabitTracker client:load />
```

`Header`, `Hero` y `UserCard` se renderizan sin una directiva `client:*`.

## Estilos

Tailwind CSS v4 es el motor principal. `src/styles/global.css` define las variables `--color-background`, `--color-surface`, `--color-text`, `--color-muted`, `--color-accent` y `--color-border` para mantener la identidad visual.

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

- `feature/habittrack-ui` se integró mediante Pull Request #1.
- `feature/astro-integration` se integró mediante Pull Request #2.
- `feature/final-compliance` reúne los ajustes finales de cumplimiento técnico.

## Despliegue

El proyecto utiliza GitHub para el flujo de código y Vercel para el despliegue.
