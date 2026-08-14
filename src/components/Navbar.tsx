const navigationItems = [
  { label: '01 / USER', href: '#user' },
  { label: '02 / HABITS', href: '#habits' },
  { label: '03 / STATE', href: '#state' },
]

function Navbar() {
  return (
    <nav className="border-b border-black/15" aria-label="Navegación principal">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:w-[92%] lg:px-0">
        <a className="text-sm font-black tracking-[-0.04em]" href="#today">HABITTRACK</a>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.65rem] font-bold tracking-[0.14em] text-black/55 sm:gap-x-8">
          {navigationItems.map((item) => (
            <a className="transition-colors hover:text-[#ff5a00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5a00]" href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
