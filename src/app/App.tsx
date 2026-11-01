import AppHeader from './layout/AppHeader'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main} />
    </div>
  )
}

export default App