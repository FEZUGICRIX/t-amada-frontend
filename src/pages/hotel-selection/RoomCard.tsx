import formatPrice from '@/pages/flight-selection/formatPrice'
import type { Room } from './rooms'

function RoomCard({
  room,
  selected,
  onSelect,
}: {
  room: Room
  selected: boolean
  onSelect: (room: Room) => void
}) {
  return (
    <article
      aria-label={room.name}
      onClick={() => onSelect(room)}
      className={`flex min-w-0 cursor-pointer flex-col gap-4 rounded-xl border bg-white p-4 hover:shadow-sm sm:flex-row ${selected ? 'border-2 border-text-primary' : 'border-[#e1e4e8]'}`}
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
        <strong className="shrink-0 whitespace-nowrap text-base">{formatPrice(room.price)}</strong>
        <button
          type="button"
          aria-pressed={selected}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(room)
          }}
          className={`h-9 rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? 'bg-accent' : 'bg-[#e7e9ec] hover:bg-[#dfe2e6]'}`}
        >
          {selected ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </article>
  )
}
export default RoomCard
