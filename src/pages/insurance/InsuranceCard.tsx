import { useState } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'
import type { InsurancePlan } from './insurancePlans'
import InsuranceDetailsDialog from './InsuranceDetailsDialog'
import type { InsuranceSearch } from './insuranceTrip'
import type { TripPeriod } from '@/shared/tripPeriodData'
import { getInsurancePrice } from './insurancePrice'
import CardPrice from '@/shared/CardPrice'

function InsuranceCard({
  plan,
  selected,
  onSelect,
  search,
  period,
}: {
  plan: InsurancePlan
  selected: boolean
  onSelect: () => void
  search: InsuranceSearch
  period: TripPeriod
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const totalPrice = getInsurancePrice(plan.price, period, search)
  return (
    <>
      <article
        aria-label={plan.name}
        onClick={onSelect}
        className={`flex min-w-0 cursor-pointer flex-col gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-stretch sm:gap-6 ${selected ? 'border-2 border-text-primary' : 'border-[#e1e4e8]'}`}
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-lg leading-6 font-semibold">{plan.name}</h2>
          <p className="mt-3 text-sm text-text-secondary">
            Медицинские расходы до{' '}
            <strong className="font-semibold text-text-primary">
              {formatPrice(plan.medicalLimit)}
            </strong>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {plan.coverage.map((item) => (
              <span
                key={item}
                className="rounded-md bg-[#fff7db] px-2.5 py-1 text-xs leading-4 text-[#695300]"
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
        <div className="flex items-center justify-between gap-3 border-t border-[#e1e4e8] pt-3 sm:min-w-[180px] sm:flex-col sm:items-end sm:justify-between sm:border-0 sm:pt-0">
          <CardPrice
            price={plan.price}
            unit="в день"
            total={totalPrice}
            totalLabel="за всех"
            align="left"
          />
          {totalPrice === null && (
            <span className="text-xs text-text-secondary">Укажите даты страховки</span>
          )}
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
          period={period}
          onClose={() => setDetailsOpen(false)}
          onSelect={onSelect}
        />
      )}
    </>
  )
}
export default InsuranceCard
