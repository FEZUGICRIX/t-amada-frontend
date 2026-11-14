import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import BookingSteps from '@/shared/BookingSteps'
import formatPrice from '@/pages/flight-selection/formatPrice'
import { hotels } from './hotels'
import RoomCard from './RoomCard'
import { getRoomsForHotel, type Room } from './rooms'
import { getTripFlightPrice } from './tripFlightPrice'

function HotelRoomsPage() {
  const { hotelId } = useParams({ from: '/hotels/$hotelId/rooms' })
  const hotel = hotels.find((item) => item.id === hotelId)
  const rooms = hotel ? getRoomsForHotel(hotel.price) : []
  const [capacity, setCapacity] = useState<'all' | '1' | '2'>('all')
  const [suiteOnly, setSuiteOnly] = useState(false)
  const [continued, setContinued] = useState(false)
  const [flightPrice] = useState(getTripFlightPrice)
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('selected-room') || 'null') as {
        hotelId: string
        roomId: string
      } | null
      return saved?.hotelId === hotelId ? saved.roomId : null
    } catch {
      return null
    }
  })
  const filtered = rooms.filter(
    (room) =>
      (capacity === 'all' || room.capacity === Number(capacity)) &&
      (!suiteOnly || room.category === 'suite'),
  )
  const selected = rooms.find((room) => room.id === selectedId)
  function selectRoom(room: Room) {
    setSelectedId(room.id)
    setContinued(false)
    sessionStorage.setItem('selected-room', JSON.stringify({ hotelId, roomId: room.id }))
  }
  const optionClass = (active: boolean) =>
    `min-h-10 rounded-xl border px-4 text-sm font-semibold ${active ? 'border-[#d6b500] bg-[#fff7cc]' : 'border-[#cfd3d8] bg-white hover:bg-[#f7f8f9]'}`
  return (
    <section className="pt-6 pb-48 md:pt-8 lg:pt-10 lg:pb-10">
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
                      selected={selectedId === room.id}
                      onSelect={selectRoom}
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
              className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:col-start-2 lg:row-start-2 lg:mt-3 lg:rounded-2xl lg:border lg:shadow-sm"
            >
              <h2 className="hidden text-xl font-semibold lg:block">Ваша поездка</h2>
              <p className="hidden text-sm text-text-secondary lg:mt-3 lg:block">
                {selected ? `${hotel.name} · ${selected.name}` : 'Номер не выбран'}
              </p>
              <div className="flex items-center justify-between gap-4 lg:mt-3">
                <span className="text-sm">Отель</span>
                <strong>{selected ? formatPrice(selected.price) : 'Не выбран'}</strong>
              </div>
              <div className="mt-2 hidden items-center justify-between text-sm lg:flex">
                <span>Авиабилет</span>
                <strong>{formatPrice(flightPrice)}</strong>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#e1e4e8] pt-3">
                <strong>Итого</strong>
                <strong>{formatPrice(flightPrice + (selected?.price ?? 0))}</strong>
              </div>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setContinued(true)}
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
