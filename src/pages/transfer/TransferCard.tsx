import CardPrice from '@/shared/CardPrice'
import type { TransferOption } from './transferOptions'

function TransferCard({
  option,
  selected,
  roundTrip,
  unavailable,
  onSelect,
}: {
  option: TransferOption
  selected: boolean
  roundTrip: boolean
  unavailable: boolean
  onSelect: () => void
}) {
  return (
    <article
      aria-label={option.name}
      onClick={unavailable ? undefined : onSelect}
      className={`flex min-w-0 flex-col gap-4 rounded-xl border bg-white p-4 transition-shadow sm:flex-row sm:items-stretch sm:gap-6 ${unavailable ? 'opacity-60' : 'cursor-pointer hover:shadow-sm'} ${selected ? 'border-2 border-text-primary' : 'border-[#e1e4e8]'}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-lg leading-6 font-semibold">{option.name}</h2>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-text-primary">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="8" r="3" />
            <path d="M3.5 19v-1.5a5.5 5.5 0 0 1 11 0V19M16 5.5a3 3 0 0 1 0 5.8m1.5 2.7a5 5 0 0 1 3 4.6V19" />
          </svg>
          <span>До {option.capacity} пассажиров</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {option.features.map((feature) => (
            <span
              key={feature}
              className="rounded-md bg-[#f2f3f4] px-2.5 py-1 text-xs leading-4 text-text-secondary"
            >
              {feature}
            </span>
          ))}
        </div>
        {unavailable && (
          <p className="mt-1 text-xs text-text-secondary">Недостаточно мест для всех пассажиров</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[#e1e4e8] pt-3 sm:min-w-[180px] sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:pt-0">
        <CardPrice
          price={option.price}
          unit="за поездку"
          total={roundTrip ? option.price * 2 : null}
          totalLabel="туда и обратно"
          align="left"
        />
        <button
          type="button"
          aria-pressed={selected}
          disabled={unavailable}
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
          className={`h-9 rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${selected ? 'bg-accent' : 'bg-[#e7e9ec] enabled:cursor-pointer enabled:hover:bg-[#dfe2e6]'}`}
        >
          {selected ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </article>
  )
}

export default TransferCard
