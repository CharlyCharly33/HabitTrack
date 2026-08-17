interface HeroProps {
  description: string
}

function Hero({ description }: HeroProps) {
  return (
    <header className="grid min-h-[50svh] items-end gap-10 border-b border-[var(--color-border)] py-14 sm:min-h-[52svh] sm:py-20 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--color-accent)]">DAILY / HABITS / TRACKER</p>
        <h1 className="mt-7 text-[clamp(5rem,16vw,13rem)] font-black leading-[0.72] tracking-[-0.09em]">HABIT<br /><span className="text-[var(--color-accent)]">TRACK.</span></h1>
      </div>
      <p className="max-w-xs border-l border-black/25 pl-5 text-sm leading-relaxed text-black/65">{description}</p>
    </header>
  )
}

export default Hero
