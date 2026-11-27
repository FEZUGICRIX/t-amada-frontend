import BookingBackground from '@/shared/BookingBackground'

function ErrorPage({ kind }: { kind: 'notFound' | 'error' }) {
  const notFound = kind === 'notFound'
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-76px)] flex-col items-center px-4 pt-12 pb-48 text-center md:pt-20 md:pb-56">
      <BookingBackground />
      <span
        aria-hidden="true"
        className="select-none text-[72px] leading-none font-semibold tracking-tight text-[#e6d9a5] md:text-[104px]"
      >
        {notFound ? '404' : '!'}
      </span>
      <h1 className="mt-4 text-2xl font-semibold md:text-3xl">
        {notFound ? 'Страница не найдена' : 'Что-то пошло не так'}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary md:text-base">
        {notFound
          ? 'Возможно, адрес изменился или страница больше недоступна.'
          : 'Не удалось открыть страницу. Попробуйте ещё раз или вернитесь на главную.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {!notFound && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-11 cursor-pointer rounded-xl bg-accent px-5 text-sm font-semibold text-text-primary hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Попробовать снова
          </button>
        )}
        <a
          href="/"
          className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-text-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-2 ${notFound ? 'bg-accent hover:brightness-95' : 'bg-[#e7e9ec] hover:bg-[#dfe2e6]'}`}
        >
          На главную
        </a>
      </div>
    </section>
  )
}

export default ErrorPage
