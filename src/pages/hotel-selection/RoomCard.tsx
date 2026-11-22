import CardPrice from '@/shared/CardPrice'
import type { Room } from './rooms'

function RoomCard({
  room,
  quantity,
  onChange,
  nights,
}: {
  room: Room
  quantity: number
  onChange: (room: Room, quantity: number) => void
  nights?: number | null
}) {
  return (
    <article
      aria-label={room.name}
      onClick={() => {
        if (!quantity) onChange(room, 1)
      }}
      className={`flex min-w-0 flex-col gap-4 rounded-xl border bg-white p-4 hover:shadow-sm sm:flex-row ${quantity ? 'border-2 border-text-primary' : 'cursor-pointer border-[#e1e4e8]'}`}
    >
      <img
        src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=480&q=75"
        alt="Пример номера"
        loading="lazy"
        className="h-36 w-full shrink-0 rounded-lg bg-[#f2f3f4] object-cover sm:h-28 sm:w-40"
      />
      <div className="min-w-0 flex-1">
        <h3 className="break-words text-base font-semibold">{room.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">
          До {room.capacity} {room.capacity === 1 ? 'гостя' : 'гостей'}
        </p>
        <p className="mt-2 text-xs text-text-secondary">{room.amenities.join(' · ')}</p>
      </div>
      <div className="flex items-end justify-between gap-3 sm:flex-col">
        <CardPrice
          price={room.price}
          unit="за ночь"
          total={nights && nights > 1 ? room.price * nights : null}
          totalLabel="за проживание"
        />
        {quantity > 0 ? (
          <div className="flex items-center gap-3" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label={`Уменьшить количество: ${room.name}`}
              onClick={() => onChange(room, quantity - 1)}
              className="grid size-9 cursor-pointer place-items-center rounded-xl bg-[#e7e9ec] text-lg font-semibold hover:bg-[#dfe2e6] focus-visible:outline-2"
            >
              −
            </button>
            <span
              aria-label={`Количество: ${room.name}`}
              className="min-w-5 text-center text-sm font-semibold"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Увеличить количество: ${room.name}`}
              onClick={() => onChange(room, quantity + 1)}
              className="grid size-9 cursor-pointer place-items-center rounded-xl bg-accent text-lg font-semibold hover:brightness-95 focus-visible:outline-2"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-pressed={false}
            onClick={(event) => {
              event.stopPropagation()
              onChange(room, 1)
            }}
            className="h-9 cursor-pointer rounded-xl bg-[#e7e9ec] px-4 text-sm font-semibold hover:bg-[#dfe2e6] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Выбрать
          </button>
        )}
      </div>
    </article>
  )
}
export default RoomCard
