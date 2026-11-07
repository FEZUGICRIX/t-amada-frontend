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

      <nav
        className="flex items-center gap-1 rounded-xl bg-[#f4f5f6] p-1"
        aria-label="Основная навигация"
      >
        <a
          href="/"
          className="hidden h-9 items-center gap-2 rounded-lg bg-accent px-3.5 text-sm leading-5 font-semibold text-text-primary no-underline shadow-[0_1px_3px_rgb(17_17_17_/_12%)] transition-[filter,transform] duration-150 hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary active:translate-y-px md:inline-flex"
          aria-current="page"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Собрать поездку
        </a>
        <a
          href="/trips"
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm leading-5 font-medium text-text-secondary no-underline transition-[background-color,color,transform] duration-150 hover:bg-white hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary active:translate-y-px"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
            <rect width="18" height="13" x="3" y="7" rx="3" />
            <path d="M3 12h18" />
          </svg>
          Мои поездки
        </a>
      </nav>
    </header>
  )
}

export default AppHeader
