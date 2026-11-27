import { useEffect, useState } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'
import BookingBackground from '@/shared/BookingBackground'
import SiteFooter from '@/shared/SiteFooter'
import { readDraft, restoreDraft } from './tripDraft'
import {
  getBookingStatus,
  readBooking,
  readBookings,
  saveBooking,
  type DemoBooking,
} from '@/pages/booking-progress/bookingData'

const statusDetails = {
  pending: { label: 'Бронируем', className: 'bg-[#fff4cf] text-[#806000]', path: '/booking' },
  success: {
    label: 'Забронирована',
    className: 'bg-[#e5f5ea] text-[#168453]',
    path: '/booking/success',
  },
  cancelled: {
    label: 'Отменена',
    className: 'bg-[#fff0ef] text-[#b42318]',
    path: '/booking/cancelled',
  },
} as const

function formatDate(date: string | null | undefined) {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function MyTripsPage() {
  const [draft] = useState(readDraft)
  const draftSearch = draft
    ? (JSON.parse(draft.values['trip-search']!) as {
        origin: string
        destination: string
        departureDate?: string | null
        returnDate?: string | null
      })
    : null
  const [bookings] = useState(() => {
    const history = readBookings()
    const current = readBooking()
    return current && !history.some((booking) => booking.startedAt === current.startedAt)
      ? [current, ...history].sort((a, b) => b.startedAt - a.startedAt)
      : history
  })
  const [now, setNow] = useState(Date.now)
  const hasPending = bookings.some((booking) => getBookingStatus(booking, now) === 'pending')
  useEffect(() => {
    const current = readBooking()
    if (current && !readBookings().some((booking) => booking.startedAt === current.startedAt))
      saveBooking(current)
  }, [])
  useEffect(() => {
    if (!hasPending) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [hasPending])

  function openBooking(booking: DemoBooking) {
    sessionStorage.setItem('demo-booking', JSON.stringify(booking))
  }

  return (
      <section className="relative isolate flex min-h-[calc(100dvh-62px)] flex-col pt-6 md:min-h-[calc(100dvh-70px)] md:pt-10 lg:min-h-[calc(100dvh-76px)]">
        <BookingBackground />
        <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
          <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
            Мои поездки
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Ваши поездки и бронирования в одном месте
          </p>
        </header>
        {bookings.length === 0 && !draft ? (
          <div className="mt-5 rounded-2xl border border-[#e1e4e8] bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Здесь пока нет поездок</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Выберите направление и соберите свою первую поездку.
            </p>
            <a
              href="/"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-text-primary no-underline hover:brightness-95"
            >
              Собрать поездку
            </a>
          </div>
        ) : (
          <div className="mt-5 grid gap-3" aria-label="Список поездок">
            {draft && draftSearch && (
              <article className="rounded-2xl border border-[#e1e4e8] bg-white p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold md:text-xl">
                      {draftSearch.origin} → {draftSearch.destination}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">Поездка ещё не оформлена</p>
                  </div>
                  <span className="rounded-lg bg-[#fff4cf] px-3 py-1.5 text-xs font-semibold text-[#806000]">
                    Планируется
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-text-secondary">
                    {formatDate(draftSearch.departureDate)}
                    {draftSearch.returnDate ? ` - ${formatDate(draftSearch.returnDate)}` : ''}
                  </p>
                  <a
                    href={draft.path}
                    onClick={() => restoreDraft(draft)}
                    className="inline-flex min-h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-text-primary no-underline hover:brightness-95"
                  >
                    Продолжить оформление
                  </a>
                </div>
              </article>
            )}
            {bookings.map((booking) => {
              const status = statusDetails[getBookingStatus(booking, now)]
              const departure = formatDate(booking.trip?.departureDate)
              const arrival = formatDate(booking.trip?.returnDate)
              return (
                <article
                  key={booking.startedAt}
                  className="rounded-2xl border border-[#e1e4e8] bg-white p-4 md:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold md:text-xl">
                        {booking.trip?.origin && booking.trip?.destination
                          ? `${booking.trip.origin} → ${booking.trip.destination}`
                          : 'Поездка'}
                      </h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        Заказ № {String(booking.startedAt).slice(-6)}
                      </p>
                    </div>
                    <span
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-1 text-sm text-text-secondary">
                      {departure && (
                        <p>
                          {departure}
                          {arrival ? ` - ${arrival}` : ''}
                        </p>
                      )}
                      {booking.trip?.hotelName && <p>{booking.trip.hotelName}</p>}
                      <p>{booking.services.map((service) => service.name).join(' · ')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <strong className="whitespace-nowrap text-lg">
                        {formatPrice(booking.total)}
                      </strong>
                      <a
                        href={status.path}
                        onClick={() => openBooking(booking)}
                        className="inline-flex min-h-10 items-center rounded-xl bg-[#f0e8c8] px-4 text-sm font-semibold text-[#544920] no-underline hover:bg-[#e8dbab]"
                      >
                        Открыть
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
        <div className="min-h-10 flex-1" aria-hidden="true" />
        <SiteFooter onLandscape />
      </section>
  )
}

export default MyTripsPage
