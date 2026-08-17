interface UserCardProps {
  nombre: string
  objetivo: string
}

function UserCard({ nombre, objetivo }: UserCardProps) {
  const initials = nombre.split(' ').map((part) => part.charAt(0)).join('')

  return (
    <section className="grid border border-[var(--color-border)] bg-[var(--color-surface)] sm:grid-cols-[11rem_1fr]" aria-label="Información de usuario">
      <div className="flex min-h-40 items-end bg-[var(--color-accent)] p-6 text-5xl font-black tracking-[-0.08em] text-black sm:min-h-56 sm:text-6xl">{initials}</div>
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <p className="text-[0.65rem] font-bold tracking-[0.18em] text-black/55">USER / PROFILE</p>
        <div className="mt-14">
          <h2 className="text-3xl font-black tracking-[-0.06em] sm:text-4xl">{nombre}</h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-black/65">{objetivo}</p>
        </div>
      </div>
    </section>
  )
}

export default UserCard
