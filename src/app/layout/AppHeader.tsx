import styles from './AppHeader.module.css'

function AppHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="T-AMAD-A - на главную">
        <span className={styles.logo} aria-hidden="true">
          TA
        </span>
        <span className={styles.brandName}>T-AMAD-A</span>
      </a>

      <nav className={styles.navigation} aria-label="Основная навигация">
        <a href="/" className={`${styles.link} ${styles.primaryLink}`}>
          Собрать поездку
        </a>
        <a href="/trips" className={`${styles.link} ${styles.secondaryLink}`}>
          Мои поездки
        </a>
      </nav>
    </header>
  )
}

export default AppHeader
