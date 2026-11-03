import { useState, type SubmitEvent } from 'react'
import DatePicker, { type SelectionMode } from './DatePicker'
import styles from './TripSearchForm.module.css'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
})

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : 'Выберите дату'
}

function TripSearchForm() {
  const [isOneWay, setIsOneWay] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectionMode, setSelectionMode] =
    useState<SelectionMode>('departure')
  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)

  function handleSubmit(evt: SubmitEvent<HTMLFormElement>) {
    evt.preventDefault()
  }

  function openDepartureCalendar() {
    setSelectionMode('departure')
    setIsCalendarOpen(true)
  }

  function openReturnCalendar() {
    setSelectionMode(departureDate ? 'return' : 'departure')
    setIsCalendarOpen(true)
  }

  function handleDateSelect(date: Date) {
    if (selectionMode === 'departure') {
      setDepartureDate(date)
      setReturnDate(null)

      if (!isOneWay) {
        setSelectionMode('return')
      }

      return
    }

    if (departureDate && date >= departureDate) {
      setReturnDate(date)
    }
  }

  function handleOneWayChange(isChecked: boolean) {
    setIsOneWay(isChecked)
    setSelectionMode('departure')

    if (isChecked) {
      setReturnDate(null)
    }
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="trip-search-title"
    >
      <h1 className={styles.heading} id="trip-search-title">
        Соберите поездку целиком
      </h1>

      <p className={styles.subtitle}>
        Все нужные услуги — в одном заказе
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div
          className={`${styles.fields} ${
            isOneWay ? styles.oneWayFields : ''
          }`}
        >
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Откуда</span>
            <input
              className={styles.input}
              name="origin"
              defaultValue="Москва"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Куда</span>
            <input
              className={styles.input}
              name="destination"
              defaultValue="Екатеринбург"
            />
          </label>

          <button
            className={styles.field}
            type="button"
            onClick={openDepartureCalendar}
          >
            <span className={styles.fieldLabel}>Когда</span>
            <span className={styles.fieldValue}>
              {formatDate(departureDate)}
            </span>
          </button>

          {!isOneWay && (
            <button
              className={styles.field}
              type="button"
              onClick={openReturnCalendar}
            >
              <span className={styles.fieldLabel}>Обратно</span>
              <span className={styles.fieldValue}>
                {formatDate(returnDate)}
              </span>
            </button>
          )}

          <button
            className={`${styles.field} ${styles.passengersField}`}
            type="button"
          >
            <span className={styles.fieldLabel}>
              Пассажиры и класс
            </span>
            <span className={styles.fieldValue}>
              2 пассажира, эконом
            </span>
          </button>

          <button className={styles.submitButton} type="submit">
            Найти билеты
          </button>
        </div>

        <label className={styles.oneWay}>
          <input
            className={styles.checkbox}
            type="checkbox"
            name="oneWay"
            checked={isOneWay}
            onChange={(evt) => handleOneWayChange(evt.target.checked)}
          />
          <span className={styles.switch} aria-hidden="true" />
          <span>Билет в одну сторону</span>
        </label>
      </form>

      {isCalendarOpen && (
        <DatePicker
          departureDate={departureDate}
          returnDate={returnDate}
          selectionMode={selectionMode}
          onSelect={handleDateSelect}
        />
      )}
    </section>
  )
}

export default TripSearchForm
