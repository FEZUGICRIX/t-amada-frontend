import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import BookingSteps from '@/shared/BookingSteps'
import formatPrice from '@/pages/flight-selection/formatPrice'
import { hotels } from './hotels'
import RoomCard from './RoomCard'
import { getRoomsForHotel, type Room } from './rooms'
import { getTripFlightPrice } from './tripFlightPrice'
import { readHotelNights } from '@/shared/tripPeriodData'
import { FlightPriceRow, HotelRoomsPriceRow } from '@/shared/TripPriceRows'
import TripBackground from '@/shared/TripBackground'
import { clearTransfer } from '@/pages/transfer/transferSelection'
import {
  getRoomCapacity,
  getRoomNightlyTotal,
  getTripPassengerCount,
  readRoomSelection,
  resolveSelectedRooms,
  type RoomSelection,
} from './roomSelection'

function HotelRoomsPage({ onContinue }: { onContinue?: () => void }) {
  const { hotelId } = useParams({ from: '/hotels/$hotelId/rooms' })
  const hotel = hotels.find((item) => item.id === hotelId)
  const rooms = hotel ? getRoomsForHotel(hotel.price) : []
  const [capacity, setCapacity] = useState<'all' | '1' | '2'>('all')
  const [suiteOnly, setSuiteOnly] = useState(false)
  const [continued, setContinued] = useState(false)
  const [flightPrice] = useState(getTripFlightPrice)
  const [nights] = useState(readHotelNights)
  const [selection, setSelection] = useState<RoomSelection | null>(() => {
    const saved = readRoomSelection()
    return saved?.hotelId === hotelId ? saved : null
  })
  const filtered = rooms.filter(
    (room) =>
      (capacity === 'all' || room.capacity === Number(capacity)) &&
      (!suiteOnly || room.category === 'suite'),
  )
  const selected = resolveSelectedRooms(selection)
  const passengerCount = getTripPassengerCount()
  const totalCapacity = getRoomCapacity(selected)
  const nightlyTotal = getRoomNightlyTotal(selected)
  const enoughCapacity = totalCapacity >= passengerCount
  function changeRoom(room: Room, quantity: number) {
    try {
      const previous = JSON.parse(sessionStorage.getItem('selected-room') || 'null') as {
        hotelId?: string
      } | null
      if (previous?.hotelId && previous.hotelId !== hotelId && clearTransfer())
        sessionStorage.setItem('transfer-removed-notice', '1')
    } catch {
      clearTransfer()
    }
    const nextRooms = [
      ...(selection?.rooms ?? []).filter((item) => item.roomId !== room.id),
      ...(quantity > 0 ? [{ roomId: room.id, quantity }] : []),
    ]
    const next = nextRooms.length ? { hotelId, rooms: nextRooms } : null
    setSelection(next)
    setContinued(false)
    if (next) sessionStorage.setItem('selected-room', JSON.stringify(next))
    else {
      sessionStorage.removeItem('selected-room')
      if (clearTransfer()) sessionStorage.setItem('transfer-removed-notice', '1')
    }
  }
  const optionClass = (active: boolean) =>
    `min-h-10 rounded-xl border px-4 text-sm font-semibold ${active ? 'border-[#d6b500] bg-[#fff7cc]' : 'border-[#cfd3d8] bg-white hover:bg-[#f7f8f9]'}`
  return (
    <section className="relative isolate pt-6 pb-48 md:pt-8 lg:pt-10 lg:pb-10">
      <TripBackground />
      <Link
        to="/hotels"
        className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7]"
      >
        Назад
      </Link>
      {hotel ? (
        <>
          <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
            <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
              Выберите номер
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              {hotel.name} · {hotel.stars} звёзд · {hotel.description}
            </p>
            <BookingSteps current={1} />
          </header>
          <div className="mt-4 grid gap-x-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
            <div className="min-w-0 lg:contents">
              <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                <h2 className="text-xl font-semibold">
                  {filtered.length}{' '}
                  {filtered.length === 1
                    ? 'номер'
                    : filtered.length >= 2 && filtered.length <= 4
                      ? 'номера'
                      : 'номеров'}
                </h2>
                <div aria-label="Фильтры номеров" className="mt-3 flex flex-wrap gap-2">
                  {(
                    [
                      ['all', 'Все'],
                      ['1', 'Одноместный'],
                      ['2', 'Двухместный'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={capacity === value}
                      className={optionClass(capacity === value)}
                      onClick={() => setCapacity(value)}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-pressed={suiteOnly}
                    className={optionClass(suiteOnly)}
                    onClick={() => setSuiteOnly((value) => !value)}
                  >
                    Люкс
                  </button>
                </div>
              </div>
              <div className="min-w-0 lg:col-start-1 lg:row-start-2">
                <div className="mt-3 flex flex-col gap-2" aria-label="Список номеров">
                  {filtered.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      nights={nights}
                      quantity={
                        selection?.rooms.find((item) => item.roomId === room.id)?.quantity ?? 0
                      }
                      onChange={changeRoom}
                    />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="mt-3 rounded-xl border border-[#e1e4e8] p-8 text-center">
                    <p>Номера не найдены</p>
                    <button
                      type="button"
                      className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold"
                      onClick={() => {
                        setCapacity('all')
                        setSuiteOnly(false)
                      }}
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                )}
              </div>
            </div>
            <aside
              aria-label="Выбранный номер"
              className="fixed inset-x-0 bottom-0 z-20 max-h-[55dvh] overflow-y-auto border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:col-start-2 lg:row-start-2 lg:mt-3 lg:max-h-none lg:rounded-2xl lg:border lg:shadow-sm"
            >
              <h2 className="hidden text-xl font-semibold lg:block">Ваша поездка</h2>
              <p className="hidden text-sm text-text-secondary lg:mt-3 lg:block">
                {selected.length ? hotel.name : 'Номер не выбран'}
              </p>
              <details className="lg:hidden">
                <summary className="cursor-pointer text-sm font-semibold">Состав поездки</summary>
                {selected.length > 0 && <HotelRoomsPriceRow rooms={selected} nights={nights} />}
                <FlightPriceRow />
              </details>
              <div className="hidden lg:block">
                {selected.length > 0 && <HotelRoomsPriceRow rooms={selected} nights={nights} />}
                <FlightPriceRow />
              </div>
              {selected.length > 0 && !enoughCapacity && (
                <div
                  role="alert"
                  className="mt-3 flex gap-2.5 rounded-xl bg-[#fff7db] px-3 py-2.5 text-sm leading-5 text-[#594600]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#f5d75e] text-xs font-bold leading-none"
                  >
                    !
                  </span>
                  <div>
                    <p className="font-semibold">Недостаточно мест</p>
                    <p className="mt-0.5 text-xs leading-4">
                      Выбрано {totalCapacity} из {passengerCount}. Добавьте номера.
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-[#e1e4e8] pt-3">
                <strong>Итого</strong>
                <strong>
                  {selected.length > 0 && !nights
                    ? 'Укажите даты'
                    : formatPrice(flightPrice + nightlyTotal * (nights ?? 0))}
                </strong>
              </div>
              <button
                type="button"
                disabled={!selected.length || !nights || !enoughCapacity}
                onClick={() => (onContinue ? onContinue() : setContinued(true))}
                className="mt-3 h-10 w-full rounded-xl bg-accent text-sm font-semibold disabled:cursor-not-allowed disabled:bg-[#e7e9ec] disabled:text-text-secondary"
              >
                Продолжить
              </button>
              {continued && (
                <p role="status" className="mt-2 text-sm text-text-secondary">
                  Следующий этап пока недоступен.
                </p>
              )}
            </aside>
          </div>
        </>
      ) : (
        <h1 className="mt-6 text-2xl font-semibold">Отель не найден</h1>
      )}
    </section>
  )
}
export default HotelRoomsPage
