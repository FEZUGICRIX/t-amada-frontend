function SiteFooter({ onLandscape = false }: { onLandscape?: boolean }) {
  return (
    <footer
      className={`relative ${onLandscape ? 'left-1/2 mt-auto w-screen -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(255,253,246,0.9))] pt-12' : 'border-t border-[#e1e4e8] bg-white'}`}
    >
      <div className={`mx-auto flex max-w-[1296px] flex-col gap-3 py-4 text-sm md:flex-row md:items-center md:justify-between ${onLandscape ? 'w-[calc(100%_-_68px)] md:w-[calc(100%_-_128px)] lg:w-[calc(100%_-_208px)]' : 'w-full'}`}>
        <p className={`text-xs ${onLandscape ? 'text-[#3e4947]' : 'text-[#4e5c5b]'}`}>© {new Date().getFullYear()} · Команда T-AMAD-A</p>
        <nav
          aria-label="Информация о сайте"
          className={`flex flex-wrap gap-x-6 gap-y-2 text-xs ${onLandscape ? 'text-[#3e4947]' : 'text-[#4e5c5b]'}`}
        >
          <a
            className="no-underline transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
            href="/trips"
          >
            Мои поездки
          </a>
          <a
            className="no-underline transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
            href="/privacy"
          >
            Политика конфиденциальности
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default SiteFooter
