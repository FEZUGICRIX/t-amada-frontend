import { useState } from 'react'
import DatePicker, { type SelectionMode } from '@/features/trip-search/DatePicker'

import { formatTripPeriod, type TripPeriod } from './tripPeriodData'

function TripPeriodPicker({
  label,
  period,
  onChange,
  errorAttempt = 0,
  minimumNights = 0,
}: {
  label: string
  period: TripPeriod
  onChange: (period: TripPeriod) => void
  errorAttempt?: number
  minimumNights?: number
}) {
  const [mode, setMode] = useState<SelectionMode>(() =>
    period.start && !period.end ? 'return' : 'departure',
  )
  const parse = (value: string | null) => (value ? new Date(`${value}T00:00:00`) : null)
  const toString = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return (
    <section
      key={errorAttempt}
      className={`mt-4 rounded-2xl border bg-white p-4 ${errorAttempt ? 'border-red-500 motion-safe:animate-[pulse_0.6s_ease-in-out_2]' : 'border-[#e1e4e8]'}`}
      aria-label={label}
    >
      <h2 className="text-base font-semibold">{label}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('departure')}
          aria-pressed={mode === 'departure'}
          className="min-h-11 cursor-pointer rounded-xl border border-[#cfd3d8] px-4 text-left text-sm hover:bg-[#f5f6f7]"
        >
          Начало:{' '}
          {period.start
            ? formatTripPeriod({ start: period.start, end: period.start }).split(' - ')[0]
            : 'Выберите дату'}
        </button>
        <button
          type="button"
          onClick={() => setMode('return')}
          aria-pressed={mode === 'return'}
          disabled={!period.start}
          className="min-h-11 cursor-pointer rounded-xl border border-[#cfd3d8] px-4 text-left text-sm hover:bg-[#f5f6f7] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Окончание:{' '}
          {period.end
            ? formatTripPeriod({ start: period.end, end: period.end }).split(' - ')[0]
            : 'Выберите дату'}
        </button>
      </div>
      {errorAttempt > 0 && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          Выберите начало и окончание периода
        </p>
      )}
      <p className="mt-3 text-sm text-text-secondary" aria-live="polite">
        {mode === 'departure' ? 'Выберите дату начала' : 'Выберите дату окончания'}
      </p>
      <DatePicker
        departureDate={parse(period.start)}
        returnDate={parse(period.end)}
        selectionMode={mode}
        minimumNights={minimumNights}
        embedded
        onSelect={(date) => {
          const next = toString(date)
          if (mode === 'departure') {
            onChange({
              start: next,
              end:
                period.end && (minimumNights ? period.end > next : period.end >= next)
                  ? period.end
                  : null,
            })
            setMode('return')
          } else {
            if (period.start && next >= period.start) onChange({ ...period, end: next })
            setMode('return')
          }
        }}
      />
    </section>
  )
}
export default TripPeriodPicker
