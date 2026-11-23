import { Link, useNavigate } from '@tanstack/react-router'
import formatPrice from '@/pages/flight-selection/formatPrice'
import type { Flight } from '@/pages/flight-selection/types'
import { getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { getRoomNightlyTotal } from '@/pages/hotel-selection/roomSelection'
import {
  formatTransferDate,
  getArrivalDate,
  getDefaultPickupTime,
  getDefaultReturnTime,
  readTransferTrip,
} from '@/pages/transfer/transferTrip'
import { readTransferSelection } from '@/pages/transfer/transferSelection'
import { transferOptions } from '@/pages/transfer/transferOptions'
import { readTripPeriod } from '@/shared/tripPeriodData'
import {
  FlightPriceRow,
  HotelRoomsPriceRow,
  InsurancePriceRow,
  TransferPriceRow,
} from '@/shared/TripPriceRows'

const SERVICE_FEE = 667

function saveDemoBooking(services: { id: string; name: string; price: number }[], total: number) {
  sessionStorage.setItem('demo-booking', JSON.stringify({ services, total, startedAt: Date.now() }))
}

function FlightInfo({ flight, date }: { flight: Flight; date?: string | null }) {
  const arrivalDate = getArrivalDate(date, flight)
  return (
    <div className="mt-2">
      <p className="font-semibold">
        {flight.departure.city} → {flight.arrival.city}
      </p>
      <p className="text-text-secondary">
        {formatTransferDate(date)} · {flight.departure.time} –{' '}
        {arrivalDate && arrivalDate !== date ? `${formatTransferDate(arrivalDate)} · ` : ''}
        {flight.arrival.time}
      </p>
      <p className="text-text-secondary">
        {flight.airline} · {flight.code} ·{' '}
        {flight.stops.length ? `пересадок: ${flight.stops.length}` : 'прямой рейс'}
      </p>
      <p className="text-text-secondary">
        {flight.travelClass === 'economy' ? 'Эконом' : 'Бизнес'} · {flight.baggage}
      </p>
    </div>
  )
}

function TripReviewPage() {
  const navigate = useNavigate()
  const trip = readTransferTrip()
  const flightKey = JSON.stringify([
    trip.outbound?.id,
    trip.inbound?.id,
    trip.search?.departureDate,
    trip.search?.returnDate,
  ])
  const transfer = readTransferSelection(trip.hotel?.id, trip.passengers, flightKey).selection
  const option = transferOptions.find((item) => item.id === transfer?.optionId)
  const hotelPeriod = readTripPeriod('hotel-period', trip.search)
  const insurancePeriod = readTripPeriod('insurance-period', trip.search)
  let schedule: {
    outboundDate?: string
    outboundTime?: string
    returnDate?: string
    returnTime?: string
    hotelId?: string
    outboundFlight?: string
    inboundFlight?: string
    departureDate?: string
    flightReturnDate?: string
  } | null
  try {
    schedule = JSON.parse(sessionStorage.getItem('transfer-schedule') || 'null')
    if (
      schedule &&
      (schedule.hotelId !== trip.hotel?.id ||
        schedule.outboundFlight !== trip.outbound?.id ||
        schedule.inboundFlight !== trip.inbound?.id ||
        schedule.departureDate !== trip.search?.departureDate ||
        schedule.flightReturnDate !== trip.search?.returnDate)
    )
      schedule = null
  } catch {
    schedule = null
  }
  const outboundDate =
    schedule?.outboundDate || getArrivalDate(trip.search?.departureDate, trip.outbound)
  const outboundTime = schedule?.outboundTime || getDefaultPickupTime(trip.outbound?.arrival.time)
  const returnDate = schedule?.returnDate || trip.search?.returnDate
  const returnTime = schedule?.returnTime || getDefaultReturnTime(trip.inbound?.departure.time)
  const total =
    getTripFlightPrice() +
    getRoomNightlyTotal(trip.rooms) * (trip.nights ?? 0) +
    (trip.insurance?.price ?? 0) * trip.passengers +
    (option?.price ?? 0) * (transfer?.roundTrip ? 2 : 1) +
    SERVICE_FEE
  const hasIncompleteHotel = trip.rooms.length > 0 && !trip.nights
  const totalLabel = hasIncompleteHotel ? 'Укажите даты' : formatPrice(total)
  function startBooking() {
    if (!trip.outbound || hasIncompleteHotel) return
    const services = [
      { id: 'flight', name: 'Авиабилет', price: getTripFlightPrice() },
      ...(trip.rooms.length
        ? [
            {
              id: 'hotel',
              name: 'Отель',
              price: getRoomNightlyTotal(trip.rooms) * (trip.nights ?? 0),
            },
          ]
        : []),
      ...(trip.insurance
        ? [{ id: 'insurance', name: 'Страховка', price: trip.insurance.price * trip.passengers }]
        : []),
      ...(option && transfer
        ? [{ id: 'transfer', name: 'Трансфер', price: option.price * (transfer.roundTrip ? 2 : 1) }]
        : []),
    ]
    saveDemoBooking(services, total)
    void navigate({ to: '/booking' })
  }
  const editClass =
    'shrink-0 text-sm font-semibold underline hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2'
  const cardClass = 'rounded-2xl border border-[#e1e4e8] bg-white p-4 md:p-5'
  return (
    <section className="pt-6 pb-28 md:pt-8 md:pb-10 lg:pt-10">
      <Link
        to="/passengers"
        className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold hover:bg-[#f5f6f7]"
      >
        Назад
      </Link>
      <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
        <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
          Проверьте поездку
        </h1>
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          Нажмите «Изменить», чтобы вернуться к нужному этапу. Остальные выбранные услуги
          сохранятся, если не зависят от изменённых данных.
        </p>
      </header>
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div className="space-y-3">
          {trip.outbound && (
            <article className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">Авиабилеты</h2>
                <Link to="/flights" className={editClass}>
                  Изменить
                </Link>
              </div>
              <div className="text-sm leading-6">
                <FlightInfo flight={trip.outbound} date={trip.search?.departureDate} />
                {trip.inbound && (
                  <FlightInfo flight={trip.inbound} date={trip.search?.returnDate} />
                )}
              </div>
            </article>
          )}
          {trip.hotel && trip.rooms.length > 0 && (
            <article className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">Отель</h2>
                <Link to="/hotels" className={editClass}>
                  Изменить
                </Link>
              </div>
              <div className="mt-2 text-sm leading-6">
                <p className="font-semibold">{trip.hotel.name}</p>
                <p className="text-text-secondary">
                  {formatTransferDate(hotelPeriod.start)} – {formatTransferDate(hotelPeriod.end)} ·{' '}
                  {trip.nights ? `${trip.nights} ноч.` : 'Укажите даты проживания'}
                </p>
                <p className="text-text-secondary">
                  {trip.hotel.breakfast ? 'Завтрак доступен' : 'Без завтрака'} ·{' '}
                  {trip.hotel.freeCancellation ? 'Бесплатная отмена' : 'Условия отмены уточняйте'}
                </p>
                {trip.rooms.map(({ room, quantity }) => (
                  <p key={room.id}>
                    {room.name} · {quantity} шт.
                  </p>
                ))}
              </div>
            </article>
          )}
          {trip.insurance && (
            <article className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">Страховка</h2>
                <Link to="/insurance" className={editClass}>
                  Изменить
                </Link>
              </div>
              <p className="mt-2 text-sm font-semibold">{trip.insurance.name}</p>
              <p className="mt-1 text-sm text-text-secondary">
                {trip.passengers} пассажиров · {formatTransferDate(insurancePeriod.start)} –{' '}
                {formatTransferDate(insurancePeriod.end)}
              </p>
            </article>
          )}
          {option && transfer && trip.hotel && (
            <article className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">Трансфер</h2>
                <Link to="/transfer" className={editClass}>
                  Изменить
                </Link>
              </div>
              <div className="mt-2 text-sm leading-6">
                <p className="font-semibold">
                  {trip.outbound?.arrival.city
                    ? `Аэропорт ${trip.outbound.arrival.city}`
                    : 'Аэропорт'}{' '}
                  → {trip.hotel.name}
                </p>
                <p className="text-text-secondary">
                  {formatTransferDate(outboundDate)} · {outboundTime || 'время не выбрано'}
                </p>
                {transfer.roundTrip && (
                  <>
                    <p className="mt-2 font-semibold">
                      {trip.hotel.name} →{' '}
                      {trip.inbound?.departure.city || trip.outbound?.arrival.city
                        ? `Аэропорт ${trip.inbound?.departure.city || trip.outbound?.arrival.city}`
                        : 'аэропорт'}
                    </p>
                    <p className="text-text-secondary">
                      {formatTransferDate(returnDate)} · {returnTime || 'время не выбрано'}
                    </p>
                  </>
                )}
                <p className="text-text-secondary">
                  {option.name} · {trip.hotel.address}
                </p>
              </div>
            </article>
          )}
          <div className="rounded-2xl border border-[#f1d45c] bg-[#fff8d9] p-4 text-sm leading-6 text-[#655000]">
            <strong>Единое бронирование</strong>
            <p>Услуги подтверждаются по очереди. При изменении цены потребуется подтверждение.</p>
          </div>
        </div>
        <aside className="rounded-2xl border border-[#e1e4e8] bg-white p-4 shadow-sm md:p-5">
          <h2 className="text-xl font-semibold">Ваша поездка</h2>
          {trip.outbound && <FlightPriceRow />}
          {trip.rooms.length > 0 && <HotelRoomsPriceRow rooms={trip.rooms} nights={trip.nights} />}
          {trip.insurance && (
            <InsurancePriceRow price={trip.insurance.price} passengers={trip.passengers} />
          )}
          {option && transfer && (
            <TransferPriceRow price={option.price} trips={transfer.roundTrip ? 2 : 1} />
          )}
          <div className="mt-4 flex justify-between gap-3 text-sm">
            <span>Сервисный сбор</span>
            <strong>{formatPrice(SERVICE_FEE)}</strong>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#e1e4e8] pt-4 font-semibold">
            <span>Итого</span>
            <span>{totalLabel}</span>
          </div>
          <button
            type="button"
            onClick={startBooking}
            disabled={!trip.outbound || hasIncompleteHotel}
            className="mt-4 hidden min-h-11 w-full rounded-xl bg-accent px-6 text-sm font-semibold hover:brightness-95 md:block"
          >
            Продолжить
          </button>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-[#e1e4e8] bg-white p-4 shadow-lg md:hidden">
        <div>
          <p className="text-xs text-text-secondary">Итого</p>
          <p className="font-semibold">{totalLabel}</p>
        </div>
        <button
          type="button"
          onClick={startBooking}
          disabled={!trip.outbound || hasIncompleteHotel}
          className="min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold"
        >
          Продолжить
        </button>
      </div>
    </section>
  )
}
export default TripReviewPage
