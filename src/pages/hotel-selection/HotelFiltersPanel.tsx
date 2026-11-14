import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { HotelFilters } from './hotelFilters'

function HotelFiltersPanel({
  filters,
  onChange,
  onReset,
  onClose,
  anchor,
}: {
  anchor?: HTMLButtonElement | null
  filters: HotelFilters
  onChange: (filters: HotelFilters) => void
  onReset: () => void
  onClose: () => void
}) {
  const closeRef = useRef(onClose)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  useEffect(() => {
    function updatePosition() {
      if (!anchor || window.innerWidth < 1024) {
        setPosition(null)
        return
      }
      const rect = anchor.getBoundingClientRect()
      setPosition({
        top: Math.max(
          8,
          Math.min(
            rect.bottom + 8,
            window.innerHeight -
              Math.min(panelRef.current?.offsetHeight ?? 600, window.innerHeight - 16) -
              8,
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
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [])
  function update(values: Partial<HotelFilters>) {
    onChange({ ...filters, ...values })
  }
  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return
    const elements = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled])',
    )
    if (!elements?.length) return
    const first = elements[0],
      last = elements[elements.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
  const buttonClass = (active: boolean) =>
    `rounded-xl border px-3 py-2 text-sm font-medium ${active ? 'border-[#d6b500] bg-[#fff7cc]' : 'border-[#dfe3e8] bg-white hover:bg-[#f7f8f9]'}`
  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/25 lg:bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        id="hotel-filters-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Фильтры и сортировка отелей"
        onKeyDown={handleKeyDown}
        style={position ? { top: position.top, left: position.left } : undefined}
        className="fixed inset-x-0 bottom-0 z-40 max-h-[min(90dvh,600px)] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-[0_-12px_40px_rgb(17_17_17_/_18%)] lg:inset-auto lg:w-[420px] lg:rounded-2xl lg:border lg:border-[#dfe3e8] lg:shadow-[0_12px_40px_rgb(17_17_17_/_12%)]"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Фильтры и сортировка</h3>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрыть фильтры"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl bg-[#f1f2f3] text-xl"
          >
            ×
          </button>
        </div>
        <fieldset className="mt-4 border-0 p-0">
          <legend className="text-sm font-semibold">Сортировка</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                ['default', 'По умолчанию'],
                ['cheap', 'Сначала дешевле'],
                ['expensive', 'Сначала дороже'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`min-h-11 min-w-0 rounded-xl border px-1.5 py-2 text-xs leading-[15px] font-medium transition-colors ${filters.sort === value ? 'border-[#d6b500] bg-[#fff7cc]' : 'border-[#dfe3e8] bg-white hover:bg-[#f7f8f9]'}`}
                aria-pressed={filters.sort === value}
                onClick={() => update({ sort: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-4 border-0 p-0">
          <legend className="text-sm font-semibold">Цена</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ['minPrice', 'Цена от'],
                ['maxPrice', 'Цена до'],
              ] as const
            ).map(([field, label]) => (
              <label
                key={field}
                className="flex h-14 flex-col justify-center rounded-xl border border-[#dfe3e8] px-3.5 text-[11px] leading-3 text-text-secondary focus-within:border-text-primary"
              >
                {label}
                <input
                  aria-label={label}
                  inputMode="numeric"
                  value={
                    filters[field] === null
                      ? ''
                      : `${filters[field].toLocaleString('ru-RU').replace(/[\u00a0\u202f]/g, ' ')} ₽`
                  }
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '')
                    update({ [field]: digits ? Number(digits) : null })
                  }}
                  placeholder="Не выбрано"
                  className="mt-1 w-full border-0 bg-transparent p-0 text-[15px] leading-5 font-semibold text-text-primary outline-none placeholder:font-normal placeholder:text-[#a4a8ae]"
                />
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-4 border-0 p-0">
          <legend className="text-sm font-semibold">Условия</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ['stars', '4-5 звёзд'],
                ['breakfast', 'Завтрак включён'],
                ['freeCancellation', 'Бесплатная отмена'],
              ] as const
            ).map(([field, label]) => (
              <button
                key={field}
                type="button"
                className={buttonClass(filters[field])}
                aria-pressed={filters[field]}
                onClick={() => update({ [field]: !filters[field] })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 h-11 w-full rounded-xl bg-[#e7e9ec] text-sm font-semibold hover:bg-[#dfe2e6]"
        >
          Сбросить
        </button>
      </section>
    </>
  )
}

export default HotelFiltersPanel
