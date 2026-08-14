import Button from './Button'

export type HabitVariant = 'blue' | 'orange' | 'green'

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
    <article className={`habit-card habit-card--${variant}`} data-variant={variant}>
      <div>
        <p className="eyebrow">{frecuencia}</p>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>
      <div className="habit-card__footer">
        <span className={completado ? 'status status--complete' : 'status'}>{estado}</span>
        <Button texto={textoBoton} onClick={onToggle} />
      </div>
    </article>
  )
}

export default Card
