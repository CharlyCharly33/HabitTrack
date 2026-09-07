import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmDialog({ title, description, cancelLabel, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        className="w-full max-w-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
      >
        <p className="text-[0.6rem] font-bold tracking-[0.16em] text-[var(--color-accent)]">CONFIRMAR</p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.06em]" id="confirm-title">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/60" id="confirm-description">{description}</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            className="border border-black/25 px-4 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-black transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className="bg-black px-4 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
