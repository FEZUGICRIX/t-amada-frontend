function AppHeader() {
  return (
    <header className="flex h-[62px] w-full items-center justify-between bg-background-primary px-5 md:h-[70px] md:px-9 lg:h-[76px] lg:px-[72px]">
      <a
        className="flex items-center gap-3 text-text-primary no-underline"
        href="/"
        aria-label="T-AMAD-A - на главную"
      >
        <span
          className="flex size-8 items-center justify-center rounded-[9px] bg-accent text-[11px] font-semibold"
          aria-hidden="true"
        >
          TA
        </span>
        <span className="text-xl leading-6 font-semibold">T-AMAD-A</span>
      </a>

      <nav className="flex items-center gap-6" aria-label="Основная навигация">
        <a href="/" className="hidden text-sm leading-5 text-text-primary no-underline md:block">
          Собрать поездку
        </a>
        <a href="/trips" className="text-sm leading-5 text-text-secondary no-underline">
          Мои поездки
        </a>
      </nav>
    </header>
  )
}

export default AppHeader
