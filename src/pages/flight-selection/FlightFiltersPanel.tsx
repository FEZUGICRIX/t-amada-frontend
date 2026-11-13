import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { BaggageFilter, FlightFilters, FlightSort, StopsFilter } from './flightFilters'

type FlightFiltersPanelProps = {
  anchor: HTMLButtonElement | null
  filters: FlightFilters
  airlines: string[]
  onChange: (filters: FlightFilters) => void
  onReset: () => void
  onClose: () => void
}

function formatCurrencyInput(value: number | null) {
  if (value === null) return ''

  return `${value.toLocaleString('ru-RU').replace(/[\u00a0\u202f]/g, ' ')} ₽`
}

function parseCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, '')

  return digits === '' ? null : Number(digits)
}

function FlightFiltersPanel({
  anchor,
  filters,
  airlines,
  onChange,
  onReset,
  onClose,
}: FlightFiltersPanelProps) {
  const [isAirlinesOpen, setIsAirlinesOpen] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    function updatePosition() {
      if (!anchor || window.innerWidth < 1024) {
        setDesktopPosition(null)
        return
      }
      const rect = anchor.getBoundingClientRect()
      setDesktopPosition({
        top: Math.max(
          8,
          Math.min(
            rect.bottom + 8,
            window.innerHeight - Math.min(600, window.innerHeight - 16) - 8,
          ),
        ),
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 428)),
      })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchor])

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null

    closeButtonRef.current?.focus()

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current()
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      previouslyFocusedElement?.focus()
    }
  }, [])

  function updateFilters(changes: Partial<FlightFilters>) {
    onChange({ ...filters, ...changes })
  }

  function toggleAirline(airline: string) {
    updateFilters({
      airlines: filters.airlines.includes(airline)
        ? filters.airlines.filter((selectedAirline) => selectedAirline !== airline)
        : [...filters.airlines, airline],
    })
  }

  function toggleStops(value: Exclude<StopsFilter, 'all'>) {
    updateFilters({ stops: filters.stops === value ? 'all' : value })
  }

  function toggleBaggage(value: Exclude<BaggageFilter, 'all'>) {
    updateFilters({ baggage: filters.baggage === value ? 'all' : value })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return

    const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled])',
    )

    if (!focusableElements || focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  const selectedAirlinesLabel =
    filters.airlines.length > 0 ? filters.airlines.join(', ') : 'Все авиакомпании'

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/25 lg:bg-transparent"
        data-testid="filters-backdrop"
        aria-hidden="true"
        onClick={onClose}
      />

      <section
        id="flight-filters-panel"
        ref={panelRef}
        className="fixed inset-x-0 bottom-0 z-40 max-h-[min(90dvh,600px)] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-[0_-12px_40px_rgb(17_17_17_/_18%)] lg:inset-auto lg:w-[420px] lg:rounded-2xl lg:border lg:border-[#dfe3e8] lg:shadow-[0_12px_40px_rgb(17_17_17_/_12%)]"
        style={
          desktopPosition ? { top: desktopPosition.top, left: desktopPosition.left } : undefined
        }
        role="dialog"
        aria-modal="true"
        aria-label="Фильтры и сортировка"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg leading-6 font-semibold">Фильтры и сортировка</h3>
          <button
            ref={closeButtonRef}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border-0 bg-[#f1f2f3] text-xl leading-none hover:bg-[#e7e9ec] focus-visible:outline-2 focus-visible:outline-offset-2"
            type="button"
            aria-label="Закрыть фильтры"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <fieldset className="mt-3 border-0 p-0">
          <legend className="text-[13px] leading-4 font-semibold">Сортировка</legend>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {(
              [
                ['default', 'По умолчанию'],
                ['price-asc', 'Сначала дешевле'],
                ['price-desc', 'Сначала дороже'],
              ] as const
            ).map(([value, label]) => (
              <button
                className={`min-w-0 min-h-11 rounded-xl border px-1.5 py-2 text-xs leading-[15px] font-medium transition-colors ${
                  filters.sort === value
                    ? 'border-[#d6b500] bg-[#fff7cc]'
                    : 'border-[#dfe3e8] bg-white hover:bg-[#f7f8f9]'
                }`}
                type="button"
                aria-pressed={filters.sort === value}
                key={value}
                onClick={() => updateFilters({ sort: value as FlightSort })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-3 border-0 p-0">
          <legend className="text-[13px] leading-4 font-semibold">Цена</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-3">
            {(
              [
                ['Цена от', 'От', 'minPrice'],
                ['Цена до', 'До', 'maxPrice'],
              ] as const
            ).map(([accessibleName, label, field]) => (
              <label
                className="flex h-14 flex-col justify-center rounded-xl border border-[#dfe3e8] px-3.5 transition-colors focus-within:border-text-primary"
                key={field}
              >
                <span className="block text-[11px] leading-3 text-text-secondary">{label}</span>
                <input
                  className="mt-1 w-full border-0 bg-transparent p-0 text-[15px] leading-5 font-semibold outline-none placeholder:font-normal placeholder:text-[#a4a8ae]"
                  type="text"
                  inputMode="numeric"
                  aria-label={accessibleName}
                  placeholder="Не выбрано"
                  value={formatCurrencyInput(filters[field])}
                  onChange={(event) =>
                    updateFilters({ [field]: parseCurrencyInput(event.target.value) })
                  }
                />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-3 border-0 p-0">
          <legend className="text-[13px] leading-4 font-semibold">Маршрут</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <button
              className={`h-11 rounded-xl border px-3 text-sm font-medium transition-colors ${
                filters.stops === 'direct'
                  ? 'border-[#d6b500] bg-[#fff7cc]'
                  : 'border-[#dfe3e8] bg-white hover:bg-[#f7f8f9]'
              }`}
              type="button"
              aria-pressed={filters.stops === 'direct'}
              onClick={() => toggleStops('direct')}
            >
              Прямой
            </button>
            <button
              className={`h-11 rounded-xl border px-3 text-sm font-medium transition-colors ${
                filters.stops === 'with-stops'
                  ? 'border-[#d6b500] bg-[#fff7cc]'
                  : 'border-[#dfe3e8] bg-white hover:bg-[#f7f8f9]'
              }`}
              type="button"
              aria-pressed={filters.stops === 'with-stops'}
              onClick={() => toggleStops('with-stops')}
            >
              С пересадкой
            </button>
          </div>
        </fieldset>

        <fieldset className="mt-3 border-0 p-0">
          <legend className="text-[13px] leading-4 font-semibold">Багаж</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {(
              [
                ['with', 'С багажом'],
                ['without', 'Без багажа'],
              ] as const
            ).map(([value, label]) => (
              <button
                className={`h-11 rounded-xl border px-3 text-sm font-medium transition-colors ${
                  filters.baggage === value
                    ? 'border-[#d6b500] bg-[#fff7cc]'
                    : 'border-[#dfe3e8] bg-white hover:bg-[#f7f8f9]'
                }`}
                type="button"
                aria-pressed={filters.baggage === value}
                key={value}
                onClick={() => toggleBaggage(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-3">
          <span className="text-[13px] leading-4 font-semibold">Авиакомпании</span>
          <button
            className="mt-2.5 flex h-14 w-full items-center justify-between rounded-xl border border-[#dfe3e8] px-3.5 text-left transition-colors hover:bg-[#f7f8f9]"
            type="button"
            aria-label={`Авиакомпании, выбрано ${filters.airlines.length}`}
            aria-expanded={isAirlinesOpen}
            onClick={() => setIsAirlinesOpen((isOpen) => !isOpen)}
          >
            <span className="min-w-0">
              <span className="block text-[11px] leading-3 text-text-secondary">
                Выбрано {filters.airlines.length}
              </span>
              <span className="mt-1 block truncate text-sm leading-4">{selectedAirlinesLabel}</span>
            </span>
            <span aria-hidden="true">⌄</span>
          </button>

          {isAirlinesOpen && (
            <div className="mt-1 grid gap-1 rounded-xl border border-[#dfe3e8] bg-white p-3">
              {airlines.map((airline) => (
                <label className="flex min-h-8 items-center gap-2.5 text-sm" key={airline}>
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                  />
                  {airline}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-[-16px] -mx-4 mt-3 bg-white px-4 pt-3 pb-4">
          <button
            className="h-11 w-full rounded-xl border-0 bg-[#e7e9ec] text-sm font-semibold transition-colors hover:bg-[#dfe2e6]"
            type="button"
            onClick={onReset}
          >
            Сбросить
          </button>
        </div>
      </section>
    </>
  )
}

export default FlightFiltersPanel
