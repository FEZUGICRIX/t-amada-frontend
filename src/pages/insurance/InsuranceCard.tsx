import { useState } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'
import type { InsurancePlan } from './insurancePlans'
import InsuranceDetailsDialog from './InsuranceDetailsDialog'
import type { InsuranceSearch } from './insuranceTrip'

function InsuranceCard({
  plan,
  selected,
  onSelect,
  search,
}: {
  plan: InsurancePlan
  selected: boolean
  onSelect: () => void
  search: InsuranceSearch
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  return (
    <>
      <article
        aria-label={plan.name}
        onClick={onSelect}
        className={`grid cursor-pointer grid-cols-[44px_minmax(0,1fr)] gap-3 rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm md:grid-cols-[44px_minmax(0,1fr)_auto] ${selected ? 'border-2 border-text-primary' : 'border-[#e1e4e8]'}`}
      >
        <span
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-lg bg-[#f2f3f4] font-semibold"
        >
          С
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{plan.name}</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Медицинские расходы до {formatPrice(plan.medicalLimit)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {plan.coverage.map((item) => (
              <span
                key={item}
                className="rounded-md bg-[#f2f3f4] px-2 py-1 text-xs text-text-secondary"
              >
                {item}
              </span>
            ))}
          </div>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => {
              event.stopPropagation()
              setDetailsOpen(true)
            }}
            className="mt-2 cursor-pointer text-xs font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Подробнее о покрытии
          </button>
        </div>
        <div className="col-span-2 flex items-center justify-between gap-3 border-t border-[#e1e4e8] pt-3 md:col-span-1 md:flex-col md:items-end md:border-0 md:pt-0">
          <strong className="whitespace-nowrap">{formatPrice(plan.price)}</strong>
          <button
            type="button"
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation()
              onSelect()
            }}
            className={`h-9 rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? 'bg-accent' : 'bg-[#e7e9ec] hover:bg-[#dfe2e6]'}`}
          >
            {selected ? 'Выбрано' : 'Выбрать'}
          </button>
        </div>
      </article>
      {detailsOpen && (
        <InsuranceDetailsDialog
          plan={plan}
          selected={selected}
          search={search}
          onClose={() => setDetailsOpen(false)}
          onSelect={onSelect}
        />
      )}
    </>
  )
}
export default InsuranceCard
