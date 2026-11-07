import { useState } from 'react'

const NAVIGATION_BUTTON_CLASS_NAME =
  'grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-0 text-2xl leading-none text-text-primary enabled:hover:bg-[#f2f3f5] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:cursor-default disabled:text-[#c7cdd4]'

const DAY_CLASS_NAME =
  'relative h-7 cursor-pointer rounded-lg border-0 p-0 text-[10px] leading-[14px] text-text-primary enabled:hover:bg-[#fff3a3] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-primary disabled:cursor-default disabled:text-[#c7cdd4] md:text-[11px]'

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

const WEEKDAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

type SelectionMode = 'departure' | 'return'

type DatePickerProps = {
  departureDate: Date | null
  returnDate: Date | null
  selectionMode: SelectionMode
  onSelect: (date: Date) => void
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

function getCalendarDates(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const mondayBasedDay = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cellCount = Math.ceil((mondayBasedDay + daysInMonth) / 7) * 7

  return Array.from(
    { length: cellCount },
    (_, index) => new Date(year, month, index - mondayBasedDay + 1),
  )
}

function DatePicker({ departureDate, returnDate, selectionMode, onSelect }: DatePickerProps) {
  const today = startOfDay(new Date())
  const initialDate =
    selectionMode === 'return' && returnDate ? returnDate : (departureDate ?? today)

  const [visibleDate, setVisibleDate] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  )

  const year = visibleDate.getFullYear()
  const month = visibleDate.getMonth()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxYear = today.getFullYear() + 5
  const maxMonth = new Date(maxYear, 11, 1)
  const calendarDates = getCalendarDates(year, month)
  const availableYears = Array.from({ length: 6 }, (_, index) => today.getFullYear() + index)

  const isPreviousDisabled = visibleDate <= currentMonth
  const isNextDisabled = visibleDate >= maxMonth

  function showPreviousMonth() {
    if (isPreviousDisabled) {
      return
    }

    setVisibleDate(
      (currentDate) => new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    )
  }

  function showNextMonth() {
    if (isNextDisabled) {
      return
    }

    setVisibleDate(
      (currentDate) => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    )
  }

  function changeYear(nextYear: number) {
    const nextMonth =
      nextYear === today.getFullYear() && month < today.getMonth() ? today.getMonth() : month

    setVisibleDate(new Date(nextYear, nextMonth, 1))
  }

  return (
    <div
      className="mx-auto mt-3 w-full max-w-[462px] rounded-[14px] border border-[#e3e5e8] bg-background-primary p-3 shadow-[0_8px_24px_rgb(17_17_17_/_8%)] md:mt-5 md:rounded-2xl md:p-4"
      role="dialog"
      aria-label="Выбор даты"
    >
      <div className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center gap-2">
        <button
          className={NAVIGATION_BUTTON_CLASS_NAME}
          type="button"
          aria-label="Предыдущий месяц"
          disabled={isPreviousDisabled}
          onClick={showPreviousMonth}
        >
          ‹
        </button>

        <div className="flex min-w-0 items-center justify-center gap-1.5 text-sm leading-5 font-semibold">
          <span>{MONTH_NAMES[month]}</span>
          <select
            className="cursor-pointer rounded-md border-0 bg-transparent px-1 py-0.5 text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            aria-label="Выберите год"
            value={year}
            onChange={(evt) => changeYear(Number(evt.target.value))}
          >
            {availableYears.map((availableYear) => (
              <option key={availableYear} value={availableYear}>
                {availableYear}
              </option>
            ))}
          </select>
        </div>

        <button
          className={NAVIGATION_BUTTON_CLASS_NAME}
          type="button"
          aria-label="Следующий месяц"
          disabled={isNextDisabled}
          onClick={showNextMonth}
        >
          ›
        </button>
      </div>

      <div
        className="mt-2.5 grid grid-cols-7 gap-0.5 text-center text-[10px] leading-[14px] text-text-secondary md:gap-1"
        aria-hidden="true"
      >
        {WEEKDAY_NAMES.map((weekday) => (
          <span className="grid h-[22px] place-items-center" key={weekday}>
            {weekday}
          </span>
        ))}
      </div>

      <div className="mt-0.5 grid grid-cols-7 gap-0.5 md:gap-1">
        {calendarDates.map((date) => {
          const dateTime = date.getTime()
          const isOutsideMonth = date.getMonth() !== month
          const isToday = isSameDay(date, today)
          const isDeparture = departureDate !== null && isSameDay(date, departureDate)
          const isReturn = returnDate !== null && isSameDay(date, returnDate)
          const isInRange =
            departureDate !== null &&
            returnDate !== null &&
            dateTime > departureDate.getTime() &&
            dateTime < returnDate.getTime()
          const isBeforeDeparture =
            selectionMode === 'return' &&
            departureDate !== null &&
            dateTime < departureDate.getTime()
          const isDisabled =
            dateTime < today.getTime() || isBeforeDeparture || date.getFullYear() > maxYear
          const dayClassName = [
            DAY_CLASS_NAME,
            isOutsideMonth ? 'text-[#aeb4bd]' : '',
            isToday
              ? "after:absolute after:right-2 after:bottom-[3px] after:left-2 after:h-0.5 after:rounded-full after:bg-accent after:content-['']"
              : '',
            isInRange ? 'bg-[#fff3a3]' : '',
            isDeparture || isReturn
              ? 'bg-accent font-semibold enabled:hover:bg-accent enabled:hover:brightness-[0.98]'
              : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              className={dayClassName}
              key={date.toISOString()}
              type="button"
              aria-label={`${date.getDate()} ${MONTH_NAMES_GENITIVE[date.getMonth()]} ${date.getFullYear()}`}
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={isDeparture || isReturn}
              disabled={isDisabled}
              onClick={() => {
                if (isOutsideMonth) {
                  setVisibleDate(new Date(date.getFullYear(), date.getMonth(), 1))
                }

                onSelect(date)
              }}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DatePicker
export type { SelectionMode }
