export type InsuranceSearch = {
  destination?: string
  departureDate?: string | null
  returnDate?: string | null
  isOneWay?: boolean
  passengers?: { adults: number; children: number; infants: number }
} | null

const russianCities = new Set([
  'екатеринбург',
  'москва',
  'санкт-петербург',
  'казань',
  'нижний новгород',
  'сочи',
  'самара',
  'уфа',
  'пермь',
  'челябинск',
])

export function getInsuranceTripDetails(search: InsuranceSearch): string {
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
  const start = search?.departureDate && new Date(`${search.departureDate}T00:00:00`)
  const end = search?.returnDate && new Date(`${search.returnDate}T00:00:00`)
  if (
    !search?.isOneWay &&
    flights?.outbound &&
    flights.return &&
    start &&
    end &&
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime())
  ) {
    const formatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
    parts.push(`${formatter.format(start)} - ${formatter.format(end)}`)
  } else parts.push('Даты страховки не выбраны')
  if (search?.destination?.trim()) {
    const destination = search.destination.trim()
    parts.push(russianCities.has(destination.toLocaleLowerCase('ru-RU')) ? 'Россия' : destination)
  } else parts.push('Направление не выбрано')
  return parts.join(' · ')
}
