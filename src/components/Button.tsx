interface ButtonProps {
  texto: string
  onClick: () => void
}

function Button({ texto, onClick }: ButtonProps) {
  return (
    <button className="w-full bg-black px-4 py-3 text-[0.65rem] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[#ff5a00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a00] sm:w-auto" type="button" onClick={onClick}>
      {texto}
    </button>
  )
}

export default Button
