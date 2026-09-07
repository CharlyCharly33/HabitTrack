const navigationItems = [
  { label: 'HOY', href: '/app' },
  { label: 'HÁBITOS', href: '/app/habits' },
  { label: 'PROGRESO', href: '/app/progress' },
]

interface AppHeaderProps {
  current: string
}

function AppHeader({ current }: AppHeaderProps) {
  return (
    <header className="border-b border-[var(--color-border)]" aria-label="Navegación de la aplicación">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:w-[92%] lg:px-0">
        <a className="text-sm font-black tracking-[-0.04em]" href="/app">HABITTRACK</a>
        <nav className="hidden items-center gap-x-8 text-[0.65rem] font-bold tracking-[0.14em] md:flex" aria-label="Secciones">
          {navigationItems.map((item) => {
            const isActive = current === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] ${
                  isActive
                    ? 'text-[var(--color-accent)] after:absolute after:inset-x-0 after:-bottom-[3px] after:h-[2px] after:bg-[var(--color-accent)]'
                    : 'text-black/55 hover:text-[var(--color-accent)]'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            className="bg-black px-4 py-2.5 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            href="/app/habits"
          >
            + NUEVO
          </a>
          <span className="flex items-center gap-2.5" aria-label="Carlos">
            <span aria-hidden="true" className="flex size-8 items-center justify-center bg-[var(--color-accent)] text-xs font-black tracking-[-0.04em] text-black">CC</span>
            <span className="hidden text-[0.65rem] font-bold tracking-[0.14em] text-black/70 lg:inline">CARLOS</span>
          </span>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
