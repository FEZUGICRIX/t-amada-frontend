import { Link } from '@tanstack/react-router'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { Hotel } from './hotels'

function HotelDetailsDialog({ hotel, onClose }: { hotel: Hotel; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef(onClose)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [])
  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return
    const items = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href]',
    )
    if (!items?.length) return
    const first = items[0],
      last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-5"
      onClick={onClose}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotel-details-title"
        onKeyDown={trapFocus}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:max-w-[560px] sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="hotel-details-title" className="break-words text-xl font-semibold">
              {hotel.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {hotel.stars} {hotel.stars >= 2 && hotel.stars <= 4 ? 'звезды' : 'звёзд'} ·{' '}
              {hotel.description}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрыть описание отеля"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f1f2f3] text-xl hover:bg-[#e7e9ec] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ×
          </button>
        </div>
        <img
          src={hotel.image}
          alt="Пример фотографии отеля"
          className="mt-5 h-48 w-full rounded-xl bg-[#f2f3f4] object-cover sm:h-56"
        />
        <h3 className="mt-5 text-base font-semibold">Об отеле</h3>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{hotel.details}</p>
        <h3 className="mt-5 text-base font-semibold">Удобства и услуги</h3>
        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
          {[
            ...hotel.amenities,
            ...(hotel.breakfast ? ['Завтрак включён'] : []),
            ...(hotel.freeCancellation ? ['Бесплатная отмена'] : []),
          ].map((item) => (
            <li key={item} className="rounded-full bg-[#f2f3f4] px-3 py-1.5 text-sm">
              {item}
            </li>
          ))}
        </ul>
        <Link
          to="/hotels/$hotelId/rooms"
          params={{ hotelId: hotel.id }}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-text-primary no-underline hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Выбрать номер
        </Link>
      </section>
    </div>
  )
}
export default HotelDetailsDialog
