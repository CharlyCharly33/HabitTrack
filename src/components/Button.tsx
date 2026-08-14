interface ButtonProps {
  texto: string
  onClick: () => void
}

function Button({ texto, onClick }: ButtonProps) {
  return (
    <button className="action-button" type="button" onClick={onClick}>
      {texto}
    </button>
  )
}

export default Button
