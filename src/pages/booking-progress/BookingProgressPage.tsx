import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'

import { readBooking, STEP_MS } from './bookingData'
import BookingTripDetails from './BookingTripDetails'

function BookingProgressPage() {
  const navigate = useNavigate()
  const [booking] = useState(readBooking)
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!booking) return
    const update = () => {
      const time = Date.now()
      setNow(time)
      if (time >= booking.startedAt + booking.services.length * STEP_MS)
        void navigate({ to: '/booking/success', replace: true })
    }
    update()
    const timer = window.setInterval(update, 500)
    return () => window.clearInterval(timer)
  }, [booking, navigate])
  if (!booking)
    return (
      <section className="py-10">
        <h1 className="text-2xl font-semibold">Заказ не найден</h1>
        <p className="mt-2 text-text-secondary">
          Вернитесь к проверке поездки, чтобы начать оформление.
        </p>
        <Link
          to="/review"
          className="mt-4 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold"
        >
          К проверке поездки
        </Link>
      </section>
    )
  const current = Math.min(
    Math.floor(Math.max(0, now - booking.startedAt) / STEP_MS),
    booking.services.length,
  )
  const finished = current === booking.services.length
  const time = (timestamp: number) =>
    new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
      new Date(timestamp),
    )
  const badge = (index: number) =>
    index < current
      ? { text: 'Подтверждён', style: 'bg-[#e7f6ec] text-[#13864c]' }
      : index === current
        ? { text: 'Подтверждаем', style: 'bg-[#fff3cc] text-[#966000]' }
        : { text: 'Ожидает', style: 'bg-[#f0f1f3] text-text-primary' }
  return (
    <section className="py-6 md:py-10">
      <header className="mt-5 flex items-start gap-4 border-b border-[#e1e4e8] pb-5 md:items-center">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff3c4] text-xl text-[#a36c00]"
        >
          {finished ? (
            <span className="text-lg">✓</span>
          ) : (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d7b653]/40 border-t-[#a36c00] motion-reduce:animate-none" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold md:text-3xl">Бронируем поездку</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Заказ № {booking.startedAt.toString().slice(-6)} · {formatPrice(booking.total)}
          </p>
          <p className="mt-2 text-sm font-semibold md:hidden">
            {finished
              ? 'Все услуги подтверждены'
              : `Шаг ${current + 1} из ${booking.services.length}`}
          </p>
        </div>
        <p className="hidden shrink-0 text-sm font-semibold md:block">
          {finished
            ? 'Все услуги подтверждены'
            : `Шаг ${current + 1} из ${booking.services.length}`}
        </p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e1e4e8] md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:rounded-none md:border-0">
        {booking.services.map((service, index) => {
          const state = badge(index)
          return (
            <div
              key={service.id}
              className="flex min-h-16 items-start justify-between gap-3 border-b border-[#e1e4e8] bg-white px-4 py-4 last:border-b-0 md:rounded-2xl md:border md:p-5"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{service.name}</h2>
                <BookingTripDetails trip={booking.trip} service={service} />
                <p className="mt-1 hidden text-sm text-text-secondary md:block">
                  {formatPrice(service.price)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${state.style}`}
              >
                {state.text}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 rounded-2xl bg-[#f3f4f5] p-4 text-sm leading-6 text-text-secondary md:hidden">
        <strong>Можно закрыть страницу</strong>
        <p>
          Поездка сохранится в разделе «Мои поездки». Мы продолжим бронирование и покажем результат.
        </p>
      </div>
      <div className="mt-4 hidden rounded-2xl border border-[#e1e4e8] p-5 md:block">
        <h2 className="text-xl font-semibold">История заказа</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-text-secondary">{time(booking.startedAt)}</span>
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#188a52]" /> Заказ
            создан
          </li>
          {booking.services.slice(0, current).map((service, index) => (
            <li key={service.id} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-text-secondary">
                {time(booking.startedAt + (index + 1) * STEP_MS)}
              </span>
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#188a52]" />
              {service.name}: подтверждён
            </li>
          ))}
          {!finished && (
            <li className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-text-secondary">
                {time(booking.startedAt + current * STEP_MS)}
              </span>
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#92979f]" />
              Подтверждаем: {booking.services[current].name}
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
export default BookingProgressPage
