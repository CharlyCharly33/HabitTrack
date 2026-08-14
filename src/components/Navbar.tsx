const navigationItems = [
  { label: 'HOY', href: '#today' },
  { label: 'HÁBITOS', href: '#habitos' },
  { label: 'PROGRESO', href: '#progreso' },
]

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <a className="brand" href="#today">
        <span>HABITTRACK</span>
        <small>BUILD BETTER DAYS.</small>
      </a>
      <div className="nav-links">
        {navigationItems.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
