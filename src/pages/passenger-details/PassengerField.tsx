import type { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & { label: string; error?: string }

function PassengerField({ label, id, error, ...props }: Props) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className={`flex min-h-[58px] min-w-0 flex-col justify-center rounded-xl border bg-white px-3 py-2 transition-colors focus-within:ring-2 ${error ? 'border-red-500 focus-within:ring-red-200' : 'border-[#dfe2e6] hover:border-[#b9c0c7] focus-within:border-[#c7a600] focus-within:ring-[#ffdd2d]/30'}`}
      >
        <span className="text-xs leading-4 text-text-secondary">{label}</span>
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
          className="mt-1 min-w-0 w-full border-0 bg-transparent p-0 text-sm leading-5 font-medium text-text-primary outline-none placeholder:font-normal placeholder:text-[#a4a9b0]"
        />
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs leading-4 text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export default PassengerField
