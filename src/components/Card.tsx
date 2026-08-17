import Button from './Button'

export type HabitVariant = 'blue' | 'orange' | 'green'

const variantStyles: Record<HabitVariant, string> = {
  blue: 'bg-[#3478f6]',
  orange: 'bg-[var(--color-accent)]',
  green: 'bg-[#2f9d62]',
}

interface CardProps {
  titulo: string
  descripcion: string
  frecuencia: string
  completado: boolean
  variant: HabitVariant
  onToggle: () => void
}

function Card({ titulo, descripcion, frecuencia, completado, variant, onToggle }: CardProps) {
  const estado = completado ? 'COMPLETADO' : 'PENDIENTE'
  const textoBoton = completado ? 'MARCAR COMO PENDIENTE' : 'MARCAR COMO COMPLETADO'

  return (
    <article className={`flex h-full flex-col justify-between border bg-[var(--color-surface)] p-6 transition-colors sm:p-7 ${completado ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'}`} data-variant={variant}>
      <div>
        <div className="flex items-center justify-between gap-3 text-[0.6rem] font-bold tracking-[0.16em]">
          <span className="text-black/50">HABIT / CARD</span>
          <span className={completado ? 'flex items-center gap-1.5 text-[var(--color-accent)]' : 'flex items-center gap-1.5 text-black/45'}>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${completado ? 'bg-[var(--color-accent)]' : variantStyles[variant]}`} />
            {completado ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <div className="mt-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className={`size-2 rounded-full ${variantStyles[variant]}`} />
            <h3 className="text-2xl font-black tracking-[-0.06em]">{titulo}</h3>
          </div>
          <p className="shrink-0 text-[0.6rem] font-bold tracking-[0.14em] text-black/45">{frecuencia}</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-black/60">{descripcion}</p>
      </div>
      <div className="mt-12 flex flex-col gap-4 border-t border-black/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className={completado ? 'text-[0.65rem] font-bold tracking-[0.14em] text-[var(--color-accent)]' : 'text-[0.65rem] font-bold tracking-[0.14em] text-black/45'}>
          {estado}
        </span>
        <Button texto={textoBoton} onClick={onToggle} />
      </div>
    </article>
  )
}

export default Card
