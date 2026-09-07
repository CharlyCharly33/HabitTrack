const navigationItems = [
  { label: 'HOY', href: '/app' },
  { label: 'HÁBITOS', href: '/app/habits' },
  { label: 'PROGRESO', href: '/app/progress' },
]

interface MobileNavProps {
  current: string
}

function MobileNav({ current }: MobileNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden"
      aria-label="Navegación principal"
    >
      <div className="grid grid-cols-3">
        {navigationItems.map((item) => {
          const isActive = current === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`relative py-4 text-center text-[0.65rem] font-bold tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                isActive
                  ? 'text-[var(--color-accent)] after:absolute after:inset-x-0 after:top-0 after:h-[2px] after:bg-[var(--color-accent)]'
                  : 'text-black/55 hover:text-black'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
