import { useState } from 'react'
import FlightList from './FlightList'
import formatPrice from './formatPrice'
import { outboundFlights, returnFlights } from './mockFlights'

type FlightDirection = 'outbound' | 'return'

const bookingSteps = ['Авиабилет', 'Отель', 'Страховка', 'Трансфер']

const activeFilters = ['Прямой или с пересадкой', 'С багажом', 'Аэрофлот, S7']

function FlightSelectionPage() {
  const [direction, setDirection] = useState<FlightDirection>('outbound')
  const [selectedOutboundFlightId, setSelectedOutboundFlightId] = useState<string | null>(
    outboundFlights[0]?.id ?? null,
  )
  const [selectedReturnFlightId, setSelectedReturnFlightId] = useState<string | null>(
    returnFlights[0]?.id ?? null,
  )

  const isOutbound = direction === 'outbound'
  const flights = isOutbound ? outboundFlights : returnFlights
  const selectedFlightId = isOutbound ? selectedOutboundFlightId : selectedReturnFlightId
  const selectFlight = isOutbound ? setSelectedOutboundFlightId : setSelectedReturnFlightId
  const selectedOutboundFlight = outboundFlights.find(
    (flight) => flight.id === selectedOutboundFlightId,
  )
  const selectedReturnFlight = returnFlights.find((flight) => flight.id === selectedReturnFlightId)
  const totalPrice = (selectedOutboundFlight?.price ?? 0) + (selectedReturnFlight?.price ?? 0)
  const formattedTotalPrice = formatPrice(totalPrice)

  function handleContinue() {
    if (isOutbound) {
      setDirection('return')
    }
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
              {flights.length} рейсов
            </h2>

            <span className="inline-flex items-center rounded-full border border-[#dfe3e8] bg-[#f5f6f7] px-3 py-1.5 text-xs leading-4 font-semibold text-text-primary md:text-[13px]">
              {isOutbound ? 'Москва → Сочи' : 'Сочи → Москва'}
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

          <div className="mt-2">
            <FlightList
              key={direction}
              flights={flights}
              selectedFlightId={selectedFlightId}
              onSelect={selectFlight}
            />
          </div>
        </div>

        <aside className="fixed right-[18px] bottom-0 left-[18px] z-20 border-t border-[#e1e4e8] bg-white px-4 py-3 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] md:right-8 md:left-8 lg:static lg:mt-[128px] lg:rounded-2xl lg:border lg:p-4 lg:shadow-[0_6px_20px_rgb(17_17_17_/_6%)]">
          <h2 className="hidden text-xl leading-7 font-semibold lg:block">Ваша поездка</h2>

          <div className="mt-3 hidden items-center justify-between border-b border-[#e1e4e8] pb-3 text-xs lg:flex">
            <span>Авиабилет</span>
            <strong>{formattedTotalPrice}</strong>
          </div>

          <div className="flex items-center gap-4 lg:mt-3 lg:block">
            <div className="flex min-w-0 flex-1 flex-col items-start justify-center lg:mb-3 lg:flex-row lg:items-center lg:justify-between">
              <strong className="text-[10px] leading-3 sm:text-sm">Итого</strong>

              <strong className="text-sm leading-5 sm:text-base">{formattedTotalPrice}</strong>
            </div>

            <button
              className="h-10 flex-none cursor-pointer rounded-xl border-0 bg-accent px-5 text-sm font-semibold text-text-primary hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary lg:w-full"
              type="button"
              onClick={handleContinue}
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
