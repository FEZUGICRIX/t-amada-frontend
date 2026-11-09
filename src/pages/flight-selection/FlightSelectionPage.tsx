import { useEffect, useRef, useState } from 'react'

type Flight = {
  id: string
  code: string
  airline: string
  departureTime: string
  arrivalTime: string
  description: string
  price: string
  selected: boolean
  transferAirport?: string
  transferDuration?: string
}

const bookingSteps = ['Авиабилет', 'Отель', 'Страховка', 'Трансфер']

const activeFilters = ['Прямой или с пересадкой', 'С багажом', 'Аэрофлот, S7']

const flightTemplates: Flight[] = [
  {
    id: 'aeroflot',
    code: 'SU',
    airline: 'Аэрофлот',
    departureTime: '10:20',
    arrivalTime: '14:05',
    description: 'прямой рейс · багаж 23 кг · эконом',
    price: '12 440 ₽',
    selected: true,
  },
  {
    id: 'pobeda',
    code: 'DP',
    airline: 'Победа',
    departureTime: '12:45',
    arrivalTime: '16:25',
    description: 'прямой рейс · багаж 23 кг · эконом',
    price: '9 840 ₽',
    selected: false,
  },
  {
    id: 'rossiya-aeroflot',
    code: 'SU',
    airline: 'Россия + Аэрофлот',
    departureTime: '08:10',
    arrivalTime: '14:45',
    description: '1 пересадка · багаж 23 кг · эконом',
    price: '11 980 ₽',
    selected: false,
    transferAirport: 'Москва, SVO',
    transferDuration: '1 ч 35 мин',
  },
]

function FlightSelectionPage() {
  const [loadedPages, setLoadedPages] = useState(1)
  const loaderRef = useRef<HTMLDivElement>(null)

  const visibleFlights = Array.from({ length: loadedPages }, (_, pageIndex) =>
    flightTemplates.map((flight) => ({
      ...flight,
      id: `${flight.id}-${pageIndex}`,
      selected: pageIndex === 0 && flight.selected,
    })),
  ).flat()

  useEffect(() => {
    const loader = loaderRef.current

    if (!loader || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadedPages((currentPages) => currentPages + 1)
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(loader)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="pt-6 pb-28 md:pt-8 md:pb-28 lg:pt-10 lg:pb-10">
      <header>
        <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
          Выберите рейс туда
        </h1>

        <p className="mt-1.5 text-[13px] leading-5 text-text-secondary md:mt-2 md:text-sm">
          Москва → Сочи · 12 октября · 2 взрослых · эконом
        </p>

        <ol
          className="mt-4 flex list-none items-center gap-2 overflow-x-auto p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Этапы бронирования"
        >
          {bookingSteps.map((step, index) => (
            <li
              className={
                index === 0
                  ? 'shrink-0 rounded-full bg-text-primary px-3 py-1.5 text-[13px] leading-4 text-white'
                  : 'shrink-0 rounded-full bg-[#e7e9ec] px-3 py-1.5 text-[13px] leading-4 text-text-secondary'
              }
              key={step}
            >
              {index + 1}. {step}
            </li>
          ))}
        </ol>
      </header>

      <div className="mt-3 grid gap-8 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl leading-7 font-semibold md:text-[22px] md:leading-8">
              27 рейсов
            </h2>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfe3e8] bg-[#f5f6f7] px-3 py-1.5 text-xs leading-4 font-semibold text-text-primary md:text-[13px]">
              <svg
                className="size-4 text-text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m21 16-8-4V5.5a1.5 1.5 0 0 0-3 0V12l-8 4v2l8-2.5V20l-2 1.5V23l3.5-1 3.5 1v-1.5L13 20v-4.5l8 2.5Z" />
              </svg>
              Москва → Сочи
            </span>
          </div>

          <button
            className="mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#cfd3d8] bg-white px-4 text-sm font-semibold text-text-primary hover:bg-[#f7f8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
            type="button"
          >
            Фильтры и сортировка
            <span className="grid size-5 place-items-center rounded-md bg-[#e7e9ec] text-[11px]">
              3
            </span>
            <span className="ml-1 text-xs" aria-hidden="true">
              ˅
            </span>
          </button>

          <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Активные фильтры">
            {activeFilters.map((filter) => (
              <span
                className="inline-flex items-center gap-1 rounded-lg bg-[#f1f2f3] px-2.5 py-1.5 text-[11px] leading-3 text-text-secondary"
                key={filter}
              >
                {filter}

                <span aria-hidden="true">×</span>
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-2" aria-label="Список рейсов">
            {visibleFlights.map((flight) => (
              <article
                className={`grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 rounded-xl bg-white p-4 md:grid-cols-[44px_minmax(0,1fr)_auto] md:gap-x-4 ${
                  flight.selected ? 'border-2 border-text-primary' : 'border border-[#e1e4e8]'
                }`}
                key={flight.id}
                aria-label={`Рейс ${flight.airline}`}
              >
                <div
                  className={`grid size-10 place-items-center rounded-lg border border-[#e1e4e8] text-[13px] font-semibold md:size-11 ${
                    flight.code === 'DP' ? 'text-[#7a32c7]' : 'text-[#1769c2]'
                  }`}
                  aria-hidden="true"
                >
                  {flight.code}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base leading-5 font-semibold">{flight.airline}</h3>

                  <div className="mt-0.5 flex items-center gap-2">
                    <strong className="text-lg leading-6">{flight.departureTime}</strong>

                    <span
                      className="relative h-px w-8 bg-[#aeb4bd] after:absolute after:top-1/2 after:right-0 after:size-1 after:-translate-y-1/2 after:rounded-full after:bg-[#7d858f] after:content-['']"
                      aria-hidden="true"
                    />

                    <strong className="text-lg leading-6">{flight.arrivalTime}</strong>
                  </div>

                  <p className="mt-1 text-xs leading-4 text-text-secondary">{flight.description}</p>

                  {flight.transferAirport && (
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[#f2f3f4] px-2.5 py-1.5 text-[11px] leading-4">
                      <span>{flight.transferAirport}</span>
                      <strong>{flight.transferDuration}</strong>
                    </div>
                  )}
                </div>

                <div className="col-span-2 mt-3 flex items-end justify-between gap-3 border-t border-[#e1e4e8] pt-3 md:col-span-1 md:mt-0 md:min-w-[120px] md:flex-col md:items-end md:gap-2 md:border-0 md:pt-0">
                  <div className="md:text-right">
                    <strong className="text-lg leading-6">{flight.price}</strong>

                    <p className="mt-1 text-[11px] leading-4 text-text-secondary">
                      за 2 пассажиров
                    </p>
                  </div>

                  <button
                    className={`h-9 cursor-pointer rounded-xl border-0 px-4 text-[13px] font-semibold text-text-primary hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary ${
                      flight.selected ? 'bg-accent' : 'bg-[#e7e9ec]'
                    }`}
                    type="button"
                  >
                    {flight.selected ? 'Выбрано' : 'Выбрать'}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div
            className="mt-5 flex items-center justify-center gap-2 py-2 text-xs text-text-secondary"
            ref={loaderRef}
            role="status"
            aria-label="Загружаем ещё рейсы"
          >
            <span
              className="size-4 animate-spin rounded-full border-2 border-[#d9dde2] border-t-text-secondary"
              aria-hidden="true"
            />

            <span>Загружаем ещё рейсы</span>
          </div>
        </div>

        <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white px-4 py-3 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:mt-[128px] lg:rounded-2xl lg:border lg:p-4 lg:shadow-[0_6px_20px_rgb(17_17_17_/_6%)]">
          <h2 className="hidden text-xl leading-7 font-semibold lg:block">Ваша поездка</h2>

          <div className="mt-3 hidden items-center justify-between border-b border-[#e1e4e8] pb-3 text-xs lg:flex">
            <span>Авиабилет</span>
            <strong>25 640 ₽</strong>
          </div>

          <div className="flex items-center gap-4 lg:mt-3 lg:block">
            <div className="flex min-w-0 flex-1 items-center justify-between lg:mb-3">
              <strong className="text-[10px] leading-3 sm:text-sm">Итого</strong>

              <strong className="text-sm leading-5 sm:text-base">25 640 ₽</strong>
            </div>

            <button
              className="h-10 flex-none cursor-pointer rounded-xl border-0 bg-accent px-5 text-sm font-semibold text-text-primary hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary lg:w-full"
              type="button"
            >
              Продолжить
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default FlightSelectionPage
