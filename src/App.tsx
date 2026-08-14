import HabitTracker from './components/HabitTracker'
import Navbar from './components/Navbar'
import UserCard from './components/UserCard'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main id="today">
        <header className="page-header">
          <p className="eyebrow">SEGUIMIENTO DIARIO</p>
          <h1>HabitTrack</h1>
          <p>Seguimiento diario de hábitos</p>
        </header>
        <UserCard nombre="Carlos Cerda" objetivo="Construir mejores hábitos" />
        <HabitTracker />
      </main>
    </div>
  )
}

export default App
