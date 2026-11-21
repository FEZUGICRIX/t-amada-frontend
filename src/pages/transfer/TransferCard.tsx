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
      className={`grid grid-cols-[44px_minmax(0,1fr)] gap-3 rounded-xl border bg-white p-4 transition-shadow md:grid-cols-[44px_minmax(0,1fr)_auto] ${unavailable ? 'opacity-60' : 'cursor-pointer hover:shadow-sm'} ${selected ? 'border-2 border-text-primary' : 'border-[#e1e4e8]'}`}
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-lg bg-[#f2f3f4] font-semibold"
      >
        Т
      </span>
      <div className="min-w-0 self-center">
        <h2 className="text-base font-semibold">{option.name}</h2>
        <p className="mt-1 text-xs leading-5 text-text-secondary">
          {option.vehicle} · до {option.capacity} пассажиров
        </p>
        <p className="text-xs leading-5 text-text-secondary">{option.description}</p>
        {unavailable && (
          <p className="mt-1 text-xs text-text-secondary">Недостаточно мест для всех пассажиров</p>
        )}
      </div>
      <div className="col-span-2 flex items-center justify-between gap-3 border-t border-[#e1e4e8] pt-3 md:col-span-1 md:flex-col md:items-end md:border-0 md:pt-0">
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
