import formatPrice from '@/pages/flight-selection/formatPrice'

function CardPrice({
  price,
  unit,
  total,
  totalLabel,
  from = false,
  align = 'right',
}: {
  price: number
  unit: string
  total?: number | null
  totalLabel?: string
  from?: boolean
  align?: 'left' | 'right' | 'container'
}) {
  return (
    <div
      className={`min-w-0 ${align === 'right' ? 'text-right' : align === 'container' ? 'text-left @min-[650px]:text-right' : 'text-left md:text-right'}`}
    >
      <div
        className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 ${align === 'right' ? 'justify-end' : align === 'container' ? '@min-[650px]:justify-end' : 'md:justify-end'}`}
      >
        <strong className="whitespace-nowrap text-lg leading-6 text-text-primary">
          {from ? 'от ' : ''}
          {formatPrice(price)}
        </strong>
        <span className="text-xs leading-4 text-text-secondary">{unit}</span>
      </div>
      {total != null && (
        <p className="mt-1 inline-flex max-w-full flex-wrap items-baseline justify-end gap-x-1 rounded-lg bg-[#fff7d6] px-2 py-1 text-xs leading-4 text-text-primary">
          <span className="font-semibold">
            {from ? 'от ' : ''}
            {formatPrice(total)}
          </span>{' '}
          <span>{totalLabel}</span>
        </p>
      )}
    </div>
  )
}
export default CardPrice
