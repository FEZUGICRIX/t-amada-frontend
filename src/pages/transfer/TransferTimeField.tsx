function TransferTimeField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block min-w-0 text-sm">
      {label}
      <span className="relative mt-1 block">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="ЧЧ:ММ"
          value={value}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
            onChange(digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits)
          }}
          className="h-11 w-full rounded-xl border border-[#cfd3d8] bg-white px-3 pr-10 text-sm font-semibold placeholder:font-normal placeholder:text-text-secondary hover:border-[#aeb4bb] focus-visible:outline-2 focus-visible:outline-accent"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  )
}

export default TransferTimeField
