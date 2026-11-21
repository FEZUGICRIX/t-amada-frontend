import { useState } from 'react'
import DatePicker from '@/features/trip-search/DatePicker'
import { formatTransferDate } from './transferTrip'

function TransferDateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(`${value}T00:00:00`) : null
  return (
    <div className="min-w-0 text-sm">
      <span>{label}</span>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-1 block min-h-11 w-full cursor-pointer rounded-xl border border-[#cfd3d8] px-3 text-left focus-visible:outline-2"
      >
        {value ? formatTransferDate(value) : 'Выберите дату'}
      </button>
      {open && (
        <DatePicker
          embedded
          departureDate={selected}
          returnDate={null}
          selectionMode="departure"
          onSelect={(date) => {
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            onChange(dateString)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default TransferDateField
