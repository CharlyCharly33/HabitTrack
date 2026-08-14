interface UserCardProps {
  nombre: string
  objetivo: string
}

function UserCard({ nombre, objetivo }: UserCardProps) {
  return (
    <section className="user-card" aria-label="Información de usuario">
      <p className="eyebrow">TU PERFIL</p>
      <h2>{nombre}</h2>
      <p>Objetivo: {objetivo}</p>
    </section>
  )
}

export default UserCard
