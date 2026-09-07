interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

function EmptyState({ title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  const buttonClassName = 'mt-8 inline-block bg-black px-6 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]'

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-12">
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">EMPEZAR</p>
      <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-black/60">{description}</p>
      {actionLabel && onAction && (
        <button className={buttonClassName} type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {actionLabel && !onAction && actionHref && (
        <a className={buttonClassName} href={actionHref}>
          {actionLabel}
        </a>
      )}
    </div>
  )
}

export default EmptyState
