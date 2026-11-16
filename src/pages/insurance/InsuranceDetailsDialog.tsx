import { useEffect, useRef, type KeyboardEvent } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'
import type { InsurancePlan } from './insurancePlans'
import { getInsuranceTripDetails, type InsuranceSearch } from './insuranceTrip'
import type { TripPeriod } from '@/shared/tripPeriodData'
import { getInsurancePassengerCount } from './insurancePrice'

function InsuranceDetailsDialog({
  plan,
  selected,
  onClose,
  onSelect,
  search,
  period,
}: {
  plan: InsurancePlan
  selected: boolean
  onClose: () => void
  onSelect: () => void
  search: InsuranceSearch
  period: TripPeriod
}) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef(onClose)
  const totalPrice = plan.price * getInsurancePassengerCount(search)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [])
  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return
    const items = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
    if (!items?.length) return
    if (event.shiftKey && document.activeElement === items[0]) {
      event.preventDefault()
      items[items.length - 1].focus()
    } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
      event.preventDefault()
      items[0].focus()
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-5"
      onClick={onClose}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insurance-details-title"
        onKeyDown={trapFocus}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:max-w-[620px] sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="insurance-details-title" className="text-xl font-semibold sm:text-2xl">
              {plan.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary sm:text-base">
              {getInsuranceTripDetails(search, period)}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрыть описание страховки"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f1f2f3] text-xl hover:bg-[#e7e9ec] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ×
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#f2f3f4] p-4">
          <span className="text-sm sm:text-base">Стоимость за всех</span>
          <strong className="whitespace-nowrap text-xl sm:text-2xl">
            {formatPrice(totalPrice)}
          </strong>
        </div>
        <h3 className="mt-5 font-semibold">Что покрывает</h3>
        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
          <li className="rounded-lg bg-[#f2f3f4] px-3 py-1.5 text-sm">
            Медицинские расходы до {formatPrice(plan.medicalLimit)}
          </li>
          {plan.detailsCoverage.map((item) => (
            <li key={item} className="rounded-lg bg-[#f2f3f4] px-3 py-1.5 text-sm">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-6 text-text-secondary">{plan.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl bg-[#e7e9ec] px-3 text-sm font-semibold hover:bg-[#dfe2e6] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect()
              onClose()
            }}
            className="min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {selected ? 'Выбрано' : `Выбрать за ${formatPrice(totalPrice)}`}
          </button>
        </div>
      </section>
    </div>
  )
}
export default InsuranceDetailsDialog
