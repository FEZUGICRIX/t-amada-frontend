export type InsuranceSearch = {
  destination?: string
  departureDate?: string | null
  returnDate?: string | null
  isOneWay?: boolean
  passengers?: { adults: number; children: number; infants: number }
} | null

import type { TripPeriod } from '@/shared/tripPeriodData'

export function getInsuranceTripDetails(search: InsuranceSearch, period?: TripPeriod): string {
  const parts: string[] = []
  if (search?.passengers) {
    const { adults = 0, children = 0, infants = 0 } = search.passengers
    const labels = new Intl.PluralRules('ru-RU')
    const label = (count: number, forms: Record<string, string>) =>
      `${count} ${forms[labels.select(count)] ?? forms.many}`
    const passengers = [label(adults, { one: 'взрослого', few: 'взрослых', many: 'взрослых' })]
    if (children) passengers.push(label(children, { one: 'ребёнка', few: 'детей', many: 'детей' }))
    if (infants)
      passengers.push(label(infants, { one: 'младенца', few: 'младенцев', many: 'младенцев' }))
    parts.push(`Для ${passengers.join(', ')}`)
  } else parts.push('Пассажиры не выбраны')

  let flights: { outbound?: string; return?: string } | null = null
  try {
    flights = JSON.parse(sessionStorage.getItem('selected-flights') || 'null')
  } catch {
    /* Нет сохранённых рейсов */
  }
  const startValue = period?.start ?? search?.departureDate
  const endValue = period?.end ?? (search?.isOneWay ? null : search?.returnDate)
  const start = startValue && new Date(`${startValue}T00:00:00`)
  const end = endValue && new Date(`${endValue}T00:00:00`)
  if (
    ((search?.isOneWay && period?.start && period.end) ||
      (!search?.isOneWay && flights?.outbound && flights.return)) &&
    start &&
    end &&
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime())
  ) {
    const formatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
    parts.push(`${formatter.format(start)} - ${formatter.format(end)}`)
  } else parts.push('Даты страховки не выбраны')
  return parts.join(' · ')
}
