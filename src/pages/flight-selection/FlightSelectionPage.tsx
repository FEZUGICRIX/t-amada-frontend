import { useState } from 'react'
import FlightFiltersPanel from './FlightFiltersPanel'
import FlightList from './FlightList'
import { DEFAULT_FLIGHT_FILTERS, filterAndSortFlights, type FlightFilters } from './flightFilters'
import formatPrice from './formatPrice'
import { outboundFlights, returnFlights } from './mockFlights'

type FlightDirection = 'outbound' | 'return'

const bookingSteps = ['Авиабилет', 'Отель', 'Страховка', 'Трансфер']

function createDefaultFilters(): FlightFilters {
  return { ...DEFAULT_FLIGHT_FILTERS, airlines: [] }
}

function getFlightsCountLabel(count: number) {
  const lastTwoDigits = count % 100
  const lastDigit = count % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} рейсов`
  }

  if (lastDigit === 1) {
    return `${count} рейс`
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} рейса`
  }

  return `${count} рейсов`
}

function getActiveFilterLabels(filters: FlightFilters) {
  const labels: string[] = []

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    if (filters.minPrice !== null && filters.maxPrice !== null) {
      labels.push(
        `${filters.minPrice.toLocaleString('ru-RU')}–${filters.maxPrice.toLocaleString('ru-RU')} ₽`,
      )
    } else if (filters.minPrice !== null) {
      labels.push(`От ${filters.minPrice.toLocaleString('ru-RU')} ₽`)
    } else if (filters.maxPrice !== null) {
      labels.push(`До ${filters.maxPrice.toLocaleString('ru-RU')} ₽`)
    }
  }

  if (filters.stops === 'direct') {
    labels.push('Прямые рейсы')
  }

  if (filters.stops === 'with-stops') {
    labels.push('С пересадками')
  }

  if (filters.baggage === 'with') {
    labels.push('С багажом')
  }

  if (filters.baggage === 'without') {
    labels.push('Без багажа')
  }

  if (filters.airlines.length > 0) {
    labels.push(filters.airlines.join(', '))
  }

  if (filters.sort === 'price-asc') {
    labels.push('Сначала дешевле')
  }

  if (filters.sort === 'price-desc') {
    labels.push('Сначала дороже')
  }

  return labels
}

function FlightSelectionPage() {
  const [direction, setDirection] = useState<FlightDirection>('outbound')
  const [selectedOutboundFlightId, setSelectedOutboundFlightId] = useState<string | null>(
    outboundFlights[0]?.id ?? null,
  )
  const [selectedReturnFlightId, setSelectedReturnFlightId] = useState<string | null>(
    returnFlights[0]?.id ?? null,
  )
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<FlightFilters>(createDefaultFilters)
  const [appliedFilters, setAppliedFilters] = useState<FlightFilters>(createDefaultFilters)

  const isOutbound = direction === 'outbound'
  const flights = isOutbound ? outboundFlights : returnFlights
  const filteredFlights = filterAndSortFlights(flights, appliedFilters)
  const airlines = Array.from(new Set(flights.map((flight) => flight.airline)))
  const activeFilterLabels = getActiveFilterLabels(appliedFilters)
  const selectedFlightId = isOutbound ? selectedOutboundFlightId : selectedReturnFlightId
  const selectFlight = isOutbound ? setSelectedOutboundFlightId : setSelectedReturnFlightId
  const selectedOutboundFlight = outboundFlights.find(
    (flight) => flight.id === selectedOutboundFlightId,
  )
  const selectedReturnFlight = returnFlights.find((flight) => flight.id === selectedReturnFlightId)
  const totalPrice = (selectedOutboundFlight?.price ?? 0) + (selectedReturnFlight?.price ?? 0)
  const formattedTotalPrice = formatPrice(totalPrice)

  function handleContinue() {
    if (isOutbound && selectedFlightId !== null) {
      setDirection('return')
    }
  }

  function handleApplyFilters() {
    const normalizedFilters = { ...draftFilters, airlines: [...draftFilters.airlines] }

    if (
      normalizedFilters.minPrice !== null &&
      normalizedFilters.maxPrice !== null &&
      normalizedFilters.minPrice > normalizedFilters.maxPrice
    ) {
      ;[normalizedFilters.minPrice, normalizedFilters.maxPrice] = [
        normalizedFilters.maxPrice,
        normalizedFilters.minPrice,
      ]
    }

    const nextFilteredFlights = filterAndSortFlights(flights, normalizedFilters)

    if (!nextFilteredFlights.some((flight) => flight.id === selectedFlightId)) {
      selectFlight(null)
    }

    setDraftFilters(normalizedFilters)
    setAppliedFilters(normalizedFilters)
    setIsFiltersOpen(false)
  }

  function handleResetFilters() {
    const defaultFilters = createDefaultFilters()

    setDraftFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  return (
    <section className="pt-6 pb-28 md:pt-8 lg:pt-10 lg:pb-10">
      <header>
        <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
          Выберите рейс {isOutbound ? 'туда' : 'обратно'}
        </h1>

        <p className="mt-1.5 text-[13px] leading-5 text-text-secondary md:mt-2 md:text-sm">
          {isOutbound
            ? 'Москва → Сочи · 12 октября · 2 взрослых · эконом'
            : 'Сочи → Москва · 18 октября · 2 взрослых · эконом'}
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
              {getFlightsCountLabel(filteredFlights.length)}
            </h2>

            <span className="inline-flex items-center rounded-full border border-[#dfe3e8] bg-[#f5f6f7] px-3 py-1.5 text-xs leading-4 font-semibold text-text-primary md:text-[13px]">
              {isOutbound ? 'Москва → Сочи' : 'Сочи → Москва'}
            </span>
          </div>

          <div className="relative mt-3 w-fit">
            <button
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#cfd3d8] bg-white px-4 text-sm font-semibold text-text-primary hover:bg-[#f7f8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              type="button"
              aria-expanded={isFiltersOpen}
              aria-controls="flight-filters-panel"
              onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
            >
              Фильтры и сортировка
              {activeFilterLabels.length > 0 && (
                <span className="grid size-5 place-items-center rounded-md bg-[#e7e9ec] text-[11px]">
                  {activeFilterLabels.length}
                </span>
              )}
              <svg
                className={`ml-1 size-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 8 4 4 4-4" />
              </svg>
            </button>

            {isFiltersOpen && (
              <FlightFiltersPanel
                filters={draftFilters}
                airlines={airlines}
                onChange={setDraftFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onClose={() => setIsFiltersOpen(false)}
              />
            )}
          </div>

          {activeFilterLabels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Активные фильтры">
              {activeFilterLabels.map((filter) => (
                <span
                  className="inline-flex items-center gap-1 rounded-lg bg-[#f1f2f3] px-2.5 py-1.5 text-[11px] leading-3 text-text-secondary"
                  key={filter}
                >
                  {filter}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2">
            {filteredFlights.length > 0 ? (
              <FlightList
                key={`${direction}-${JSON.stringify(appliedFilters)}`}
                flights={filteredFlights}
                selectedFlightId={selectedFlightId}
                onSelect={selectFlight}
              />
            ) : (
              <div className="rounded-2xl border border-[#e1e4e8] bg-white px-5 py-12 text-center">
                <h3 className="text-lg font-semibold">Рейсы не найдены</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Измени параметры фильтров или сбрось их.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white py-3 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:mt-[128px] lg:rounded-2xl lg:border lg:p-4 lg:shadow-[0_6px_20px_rgb(17_17_17_/_6%)]">
          <div className="mx-auto flex w-[calc(100%_-_36px)] items-center gap-4 md:w-[calc(100%_-_64px)] lg:block lg:w-auto">
            <h2 className="hidden text-xl leading-7 font-semibold lg:block">Ваша поездка</h2>

            <div className="mt-3 hidden items-center justify-between border-b border-[#e1e4e8] pb-3 text-xs lg:flex">
              <span>Авиабилет</span>
              <strong>{formattedTotalPrice}</strong>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-4 lg:mt-3 lg:block">
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center lg:mb-3 lg:flex-row lg:items-center lg:justify-between">
                <strong className="text-[10px] leading-3 sm:text-sm">Итого</strong>
                <strong className="text-sm leading-5 sm:text-base">{formattedTotalPrice}</strong>
              </div>

              <button
                className="h-10 flex-none cursor-pointer rounded-xl border-0 bg-accent px-5 text-sm font-semibold text-text-primary hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:cursor-not-allowed disabled:bg-[#e7e9ec] disabled:text-text-secondary disabled:hover:brightness-100 lg:w-full"
                type="button"
                disabled={selectedFlightId === null || filteredFlights.length === 0}
                onClick={handleContinue}
              >
                Продолжить
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default FlightSelectionPage
