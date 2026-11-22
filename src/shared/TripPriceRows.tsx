import formatPrice from '@/pages/flight-selection/formatPrice'
import { getTripFlightDetails, getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { formatFlightPassengers } from './flightPriceDescription'
import type { SelectedRoom } from '@/pages/hotel-selection/roomSelection'

function Row({
  label,
  price,
  details,
}: {
  label: string
  price: string
  details?: string | string[]
}) {
  return (
    <div className="mt-4 text-sm">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold text-text-primary">{label}</span>
        <strong className="shrink-0 whitespace-nowrap">{price}</strong>
      </div>
      {details && (
        <div className="mt-1.5 space-y-1 text-xs leading-4 text-text-secondary">
          {(Array.isArray(details) ? details : [details]).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export function FlightPriceRow() {
  const { outbound, inbound, passengers, passengerCounts } = getTripFlightDetails()
  const parts = [
    outbound && `Туда: ${formatPrice(outbound.price)} × ${passengers}`,
    inbound && `Обратно: ${formatPrice(inbound.price)} × ${passengers}`,
  ].filter((part): part is string => Boolean(part))
  if (parts.length && passengerCounts) parts.push(formatFlightPassengers(passengerCounts))
  return (
    <Row
      label="Авиабилет"
      price={formatPrice(getTripFlightPrice())}
      details={parts.length ? parts : undefined}
    />
  )
}
export function HotelPriceRow({
  nightlyPrice,
  nights,
}: {
  nightlyPrice: number
  nights: number | null
}) {
  return (
    <Row
      label="Отель"
      price={nights ? formatPrice(nightlyPrice * nights) : 'Укажите даты'}
      details={
        nights
          ? `${formatPrice(nightlyPrice)} за ночь × ${nights} ${new Intl.PluralRules('ru').select(nights) === 'one' ? 'ночь' : new Intl.PluralRules('ru').select(nights) === 'few' ? 'ночи' : 'ночей'}`
          : `${formatPrice(nightlyPrice)} за ночь`
      }
    />
  )
}
export function InsurancePriceRow({ price, passengers }: { price: number; passengers: number }) {
  return (
    <Row
      label="Страховка"
      price={formatPrice(price * passengers)}
      details={`${formatPrice(price)} × ${passengers} ${new Intl.PluralRules('ru').select(passengers) === 'one' ? 'пассажир' : new Intl.PluralRules('ru').select(passengers) === 'few' ? 'пассажира' : 'пассажиров'}`}
    />
  )
}

export function HotelRoomsPriceRow({
  rooms,
  nights,
}: {
  rooms: SelectedRoom[]
  nights: number | null
}) {
  const total = rooms.reduce((sum, { room, quantity }) => sum + room.price * quantity, 0)
  return (
    <Row
      label="Отель"
      price={nights ? formatPrice(total * nights) : 'Укажите даты'}
      details={rooms.map(
        ({ room, quantity }) =>
          `${room.name}: ${formatPrice(room.price)} × ${quantity} × ${nights ?? 'укажите даты'}${nights ? ' ноч.' : ''} = ${nights ? formatPrice(room.price * quantity * nights) : 'укажите даты'}`,
      )}
    />
  )
}

export function TransferPriceRow({ price, trips }: { price: number; trips: number }) {
  return (
    <Row
      label="Трансфер"
      price={formatPrice(price * trips)}
      details={
        trips === 1
          ? `В отель: ${formatPrice(price)}`
          : [`В отель: ${formatPrice(price)}`, `В аэропорт: ${formatPrice(price)}`]
      }
    />
  )
}
