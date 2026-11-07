import AppHeader from './layout/AppHeader'
import styles from './App.module.css'
import TripSearchForm from '@/features/trip-search/TripSearchForm'

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <TripSearchForm />
      </main>
    </div>
  )
}

export default App
