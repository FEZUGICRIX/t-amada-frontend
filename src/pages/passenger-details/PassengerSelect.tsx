import { useRef } from 'react'

function PassengerSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const details = useRef<HTMLDetailsElement>(null)
  return (
    <details
      ref={details}
      className="relative min-w-0"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && details.current?.open) {
          details.current.open = false
          details.current.querySelector('summary')?.focus()
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
      }}
    >
      <summary
        id={id}
        aria-label={`${label}: ${value}`}
        className="flex min-h-[58px] cursor-pointer list-none items-center justify-between gap-2 rounded-xl border border-[#dfe2e6] bg-white px-3 py-2 transition hover:border-[#b9c0c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7a600] [&::-webkit-details-marker]:hidden"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs leading-4 text-text-secondary">{label}</span>
          <span className="mt-1 block truncate text-sm leading-5 font-medium" title={value}>
            {value}
          </span>
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
          <path
            d="m5 8 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="absolute inset-x-0 top-full z-20 mt-1 min-w-[200px] rounded-xl border border-[#e1e4e8] bg-white p-1.5 shadow-lg">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              onChange(option)
              if (details.current) details.current.open = false
              details.current?.querySelector('summary')?.focus()
            }}
            className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-[#fff7d6] focus-visible:outline-2 focus-visible:outline-[#c7a600] ${value === option ? 'bg-[#fff8dc] font-semibold' : ''}`}
          >
            <span>{option}</span>
            {value === option && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </details>
  )
}

export default PassengerSelect
