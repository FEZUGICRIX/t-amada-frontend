type PassengerCounts = { adults: number; children: number; infants: number }

export function formatFlightPassengers(passengers: PassengerCounts): string {
  const plural = new Intl.PluralRules('ru')
  const label = (count: number, one: string, few: string, many: string) => {
    const form = plural.select(count)
    return `${count} ${form === 'one' ? one : form === 'few' ? few : many}`
  }
  const paying = [
    passengers.adults > 0 && label(passengers.adults, 'взрослый', 'взрослых', 'взрослых'),
    passengers.children > 0 && label(passengers.children, 'ребёнок', 'ребёнка', 'детей'),
  ].filter(Boolean)
  const infants =
    passengers.infants > 0
      ? `${label(passengers.infants, 'младенец', 'младенца', 'младенцев')} бесплатно`
      : ''
  return [paying.length ? paying.join(', ') : '', infants].filter(Boolean).join(' · ')
}
