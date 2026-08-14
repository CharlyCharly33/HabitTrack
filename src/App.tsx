import HabitTracker from './components/HabitTracker'
import Navbar from './components/Navbar'
import UserCard from './components/UserCard'

function App() {
  return (
    <div className="min-h-screen bg-[#efede6] font-sans text-[#111111]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 sm:px-8" id="today">
        <header className="grid min-h-[60svh] items-end gap-10 border-b border-black/15 py-14 sm:py-20 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#ff5a00]">DAILY / HABITS / TRACKER</p>
            <h1 className="mt-7 text-[clamp(5rem,16vw,13rem)] font-black leading-[0.72] tracking-[-0.09em]">HABIT<br /><span className="text-[#ff5a00]">TRACK.</span></h1>
          </div>
          <p className="max-w-xs border-l border-black/25 pl-5 text-sm leading-relaxed text-black/65">Un espacio visual para seguir hábitos, props y estado desde una interfaz simple.</p>
        </header>
        <section className="grid gap-8 border-b border-black/15 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16" id="user" aria-labelledby="user-title">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#ff5a00]">01 / USER</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl" id="user-title">Perfil enviado<br />por props.</h2>
          </div>
          <div>
            <p className="mb-7 max-w-md text-sm leading-relaxed text-black/60">Datos enviados a un componente reutilizable mediante props.</p>
          <UserCard nombre="Carlos Cerda" objetivo="Construir mejores hábitos" />
          </div>
        </section>
        <div className="pb-20">
          <HabitTracker />
        </div>
        <footer className="flex flex-col gap-2 border-t border-black/15 py-7 text-[0.65rem] font-bold tracking-[0.16em] text-black/50 sm:flex-row sm:justify-between">
          <span>HABITTRACK / 2026</span>
          <span>REACT / TYPESCRIPT / TAILWIND</span>
        </footer>
      </main>
    </div>
  )
}

export default App
