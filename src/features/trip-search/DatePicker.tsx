import { useState } from 'react'
import styles from './DatePicker.module.css'

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
    <div className={styles.calendar} role="dialog" aria-label="Выбор даты">
      <div className={styles.header}>
        <button
          className={styles.navigationButton}
          type="button"
          aria-label="Предыдущий месяц"
          disabled={isPreviousDisabled}
          onClick={showPreviousMonth}
        >
          ‹
        </button>

        <div className={styles.title}>
          <span>{MONTH_NAMES[month]}</span>
          <select
            className={styles.yearSelect}
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
          className={styles.navigationButton}
          type="button"
          aria-label="Следующий месяц"
          disabled={isNextDisabled}
          onClick={showNextMonth}
        >
          ›
        </button>
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAY_NAMES.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className={styles.days}>
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
            styles.day,
            isOutsideMonth ? styles.outsideMonth : '',
            isToday ? styles.today : '',
            isInRange ? styles.inRange : '',
            isDeparture || isReturn ? styles.rangeEdge : '',
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
