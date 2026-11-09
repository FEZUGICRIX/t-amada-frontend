import { Outlet } from '@tanstack/react-router'
import AppHeader from './layout/AppHeader'

function App() {
  return (
    <div className="min-h-screen bg-background-primary">
      <AppHeader />
      <main className="mx-auto w-[calc(100%_-_36px)] max-w-[1296px] md:w-[calc(100%_-_64px)] lg:w-[calc(100%_-_144px)]">
        <Outlet />
      </main>
    </div>
  )
}

export default App
