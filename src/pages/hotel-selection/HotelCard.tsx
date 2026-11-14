import type { Hotel } from './hotels'
import formatPrice from '@/pages/flight-selection/formatPrice'

function HotelCard({
  hotel,
  selected = false,
  onSelect,
}: {
  hotel: Hotel
  selected?: boolean
  onSelect: (hotel: Hotel) => void
}) {
  return (
    <article
      aria-label={`Отель ${hotel.name}`}
      onClick={() => onSelect(hotel)}
      className={`flex min-w-0 cursor-pointer flex-col gap-4 rounded-xl border bg-white p-4 hover:shadow-sm sm:flex-row ${selected ? 'border-2 border-text-primary' : 'border-[#e1e4e8]'}`}
    >
      <img
        src={hotel.image}
        alt="Пример фотографии отеля"
        loading="lazy"
        className="h-36 w-full shrink-0 rounded-lg bg-[#f2f3f4] object-cover sm:h-28 sm:w-40"
      />
      <div className="min-w-0 flex-1">
        <h3 className="break-words text-base font-semibold">{hotel.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">
          {hotel.stars} {hotel.stars >= 2 && hotel.stars <= 4 ? 'звезды' : 'звёзд'} ·{' '}
          {hotel.description}
        </p>
        <p className="mt-2 text-xs text-text-secondary">{hotel.amenities.join(' · ')}</p>
        {(hotel.breakfast || hotel.freeCancellation) && (
          <p className="mt-1 text-xs text-text-secondary">
            {[hotel.breakfast && 'Завтрак включён', hotel.freeCancellation && 'Бесплатная отмена']
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>
      <div className="flex items-end justify-between gap-3 sm:flex-col">
        <div className="text-right">
          <strong className="text-base">от {formatPrice(hotel.price)}</strong>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSelect(hotel)
          }}
          aria-pressed={selected}
          className={`h-9 rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? 'bg-accent' : 'bg-[#e7e9ec] hover:bg-[#dfe2e6]'}`}
        >
          {selected ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </article>
  )
}

export default HotelCard
