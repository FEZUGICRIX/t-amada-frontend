import type { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & { label: string }

function PassengerField({ label, id, ...props }: Props) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[58px] min-w-0 flex-col justify-center rounded-xl border border-[#dfe2e6] bg-white px-3 py-2 transition-colors hover:border-[#b9c0c7] focus-within:border-[#c7a600] focus-within:ring-2 focus-within:ring-[#ffdd2d]/30"
    >
      <span className="text-xs leading-4 text-text-secondary">{label}</span>
      <input
        id={id}
        {...props}
        className="mt-1 min-w-0 w-full border-0 bg-transparent p-0 text-sm leading-5 font-medium text-text-primary outline-none placeholder:font-normal placeholder:text-[#a4a9b0]"
      />
    </label>
  )
}

export default PassengerField
