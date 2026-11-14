type FilterTriggerProps = {
  open: boolean
  count: number
  onClick: () => void
  setAnchor?: (element: HTMLButtonElement | null) => void
  controls?: string
}

function FilterTrigger({ open, count, onClick, setAnchor, controls }: FilterTriggerProps) {
  return (
    <button
      ref={setAnchor}
      className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#cfd3d8] bg-white px-4 text-sm font-semibold text-text-primary hover:bg-[#f7f8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      Фильтры и сортировка
      {count > 0 && (
        <span className="grid size-5 place-items-center rounded-md bg-[#e7e9ec] text-[11px]">
          {count}
        </span>
      )}
      <svg
        className={`ml-1 size-4 transition-transform ${open ? 'rotate-180' : ''}`}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 8 4 4 4-4" />
      </svg>
    </button>
  )
}

export default FilterTrigger
