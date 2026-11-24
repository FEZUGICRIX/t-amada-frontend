import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'
import BookingTripDetails from '@/pages/booking-progress/BookingTripDetails'
import { readBooking, STEP_MS } from '@/pages/booking-progress/bookingData'

const reasons: Record<string, string> = {
  flight: 'Авиабилет не подтвердил бронирование',
  hotel: 'Отель не подтвердил бронирование',
  insurance: 'Страховка не подтвердилась',
  transfer: 'Трансфер не подтвердился',
}
const failedLabels: Record<string, string> = {
  flight: 'Не подтверждён',
  hotel: 'Не подтверждён',
  insurance: 'Не подтверждена',
  transfer: 'Не подтверждён',
}
const pendingLabels: Record<string, string> = {
  flight: 'Не оформлен',
  hotel: 'Не оформлен',
  insurance: 'Не оформлена',
  transfer: 'Не оформлен',
}

function BookingCancelledPage() {
  const [booking] = useState(readBooking)
  const [openedAt] = useState(Date.now)
  const failedIndex =
    booking?.services.findIndex((service) => service.id === booking.failedServiceId) ?? -1
  if (!booking || failedIndex < 0)
    return (
      <section className="py-10">
        <h1 className="text-2xl font-semibold">Отменённый заказ не найден</h1>
        <Link
          to="/review"
          className="mt-4 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold"
        >
          К проверке поездки
        </Link>
      </section>
    )
  if (openedAt < booking.startedAt + (failedIndex + 1) * STEP_MS)
    return (
      <section className="py-10">
        <h1 className="text-2xl font-semibold">Бронирование ещё не завершено</h1>
        <Link
          to="/booking"
          className="mt-4 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold"
        >
          Посмотреть статус
        </Link>
      </section>
    )
  const failed = booking.services[failedIndex]
  const reason = reasons[failed.id] ?? `${failed.name}: бронирование не подтверждено`
  const time = (value: number) =>
    new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  return (
    <section className="py-6 sm:py-10">
      <header className="flex items-start gap-4 border-b border-[#e1e4e8] pb-6 sm:items-center">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0ef] text-2xl font-semibold text-[#c32d21]"
        >
          !
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">Заказ отменён</h1>
          <p className="mt-1 text-sm text-text-secondary">{reason}</p>
        </div>
        <p className="hidden text-sm font-semibold sm:block">Заказ отменён</p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e1e4e8] sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:rounded-none sm:border-0">
        {booking.services.map((service, index) => {
          const status =
            index === failedIndex
              ? (failedLabels[service.id] ?? 'Не подтверждена')
              : index < failedIndex
                ? 'Отменён'
                : (pendingLabels[service.id] ?? 'Не оформлена')
          return (
            <div
              key={service.id}
              className="flex min-h-16 items-start justify-between gap-3 border-b border-[#e1e4e8] bg-white px-4 py-4 last:border-b-0 sm:rounded-2xl sm:border sm:p-5"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{service.name}</h2>
                <BookingTripDetails trip={booking.trip} service={service} />
                <p className="mt-1 hidden text-sm text-text-secondary sm:block">
                  {formatPrice(service.price)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${index <= failedIndex ? 'bg-[#fff0ef] text-[#bd291f]' : 'bg-[#f0f1f3] text-text-primary'}`}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>
      {booking.paymentStatus === 'not_charged' && (
        <div className="mt-4 rounded-2xl bg-[#f3f4f5] p-4 text-sm leading-6 text-text-secondary">
          <strong>Списание не выполнено</strong>
          <p>Деньги за поездку не будут списаны с карты.</p>
        </div>
      )}
      <div className="mt-4 hidden rounded-2xl border border-[#e1e4e8] p-5 sm:block">
        <h2 className="text-xl font-semibold">История заказа</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-text-secondary">{time(booking.startedAt)}</span>
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#188a52]" />
            Заказ создан
          </li>
          <li className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-text-secondary">
              {time(booking.startedAt + (failedIndex + 1) * STEP_MS)}
            </span>
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#bd291f]" />
            {reason}
          </li>
          {failedIndex > 0 && (
            <li className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-text-secondary">
                {time(booking.startedAt + (failedIndex + 1) * STEP_MS)}
              </span>
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#188a52]" />
              Подтверждённые услуги отменены
            </li>
          )}
        </ul>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <Link
          to="/"
          className="flex min-h-11 items-center justify-center rounded-xl bg-[#e7e9ec] px-3 text-center text-sm font-semibold sm:px-6"
        >
          На главную
        </Link>
        <Link
          to="/"
          className="flex min-h-11 items-center justify-center rounded-xl bg-accent px-3 text-center text-sm font-semibold sm:px-6"
        >
          Собрать заново
        </Link>
      </div>
    </section>
  )
}
export default BookingCancelledPage
