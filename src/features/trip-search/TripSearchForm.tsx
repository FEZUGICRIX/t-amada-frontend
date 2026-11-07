import { useState, type SubmitEvent } from 'react'
import DatePicker, { type SelectionMode } from './DatePicker'
import PassengerSelector, { type PassengerSelection } from './PassengerSelector'

const FIELD_CLASS_NAME =
  'flex h-[60px] min-w-0 flex-col items-start justify-center rounded-xl border border-[#e3e5e8] bg-background-primary p-2 text-left text-text-primary focus-within:border-text-primary focus-visible:border-text-primary focus-visible:outline-none md:h-16 md:px-3 md:py-2.5'

const FIELD_BUTTON_CLASS_NAME = `${FIELD_CLASS_NAME} cursor-pointer`

const FIELD_LABEL_CLASS_NAME =
  'w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] leading-3 text-text-secondary md:text-[10px] md:leading-[14px]'

const FIELD_VALUE_CLASS_NAME =
  'w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-4 font-semibold md:text-sm md:leading-5'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
})

function formatDate(date: Date | null) {
  return date ? dateFormatter.format(date) : 'Выберите дату'
}

function formatPassengerSummary(passengers: PassengerSelection) {
  const total = passengers.adults + passengers.children + passengers.infants

  let passengerWord = 'пассажиров'

  if (total === 1) {
    passengerWord = 'пассажир'
  } else if (total >= 2 && total <= 4) {
    passengerWord = 'пассажира'
  }

  const className = passengers.travelClass === 'economy' ? 'эконом' : 'бизнес'

  return `${total} ${passengerWord}, ${className}`
}

type ActivePanel = 'calendar' | 'passengers' | null

function TripSearchForm() {
  const [isOneWay, setIsOneWay] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('departure')
  const [departureDate, setDepartureDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [passengers, setPassengers] = useState<PassengerSelection>({
    adults: 2,
    children: 0,
    infants: 0,
    travelClass: 'economy',
  })

  function handleSubmit(evt: SubmitEvent<HTMLFormElement>) {
    evt.preventDefault()
  }

  function openDepartureCalendar() {
    setSelectionMode('departure')
    setActivePanel('calendar')
  }

  function openReturnCalendar() {
    setSelectionMode(departureDate ? 'return' : 'departure')
    setActivePanel('calendar')
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
      className="mt-4 w-full rounded-2xl bg-[linear-gradient(180deg,#fffbe2_0%,#fff8cf_100%)] px-4 pt-6 pb-4 md:mt-6 md:rounded-3xl md:p-8 lg:mt-8"
      aria-labelledby="trip-search-title"
    >
      <h1
        className="m-0 text-2xl leading-6 font-semibold md:text-[32px] md:leading-[38px]"
        id="trip-search-title"
      >
        Соберите поездку целиком
      </h1>

      <p className="mt-0.5 mb-6 text-[10px] leading-[14px] text-text-secondary md:text-sm md:leading-5">
        Все нужные услуги — в одном заказе
      </p>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-[1.23fr_1.23fr_1fr_1fr_1.39fr_164px]">
          <label className={FIELD_CLASS_NAME}>
            <span className={FIELD_LABEL_CLASS_NAME}>Откуда</span>
            <input
              className="w-full min-w-0 border-0 bg-transparent p-0 text-xs leading-4 font-semibold text-text-primary outline-0 md:text-sm md:leading-5"
              name="origin"
              defaultValue="Москва"
            />
          </label>

          <label className={FIELD_CLASS_NAME}>
            <span className={FIELD_LABEL_CLASS_NAME}>Куда</span>
            <input
              className="w-full min-w-0 border-0 bg-transparent p-0 text-xs leading-4 font-semibold text-text-primary outline-0 md:text-sm md:leading-5"
              name="destination"
              defaultValue="Екатеринбург"
            />
          </label>

          <button className={FIELD_BUTTON_CLASS_NAME} type="button" onClick={openDepartureCalendar}>
            <span className={FIELD_LABEL_CLASS_NAME}>Когда</span>
            <span className={FIELD_VALUE_CLASS_NAME}>{formatDate(departureDate)}</span>
          </button>

          {!isOneWay && (
            <button className={FIELD_BUTTON_CLASS_NAME} type="button" onClick={openReturnCalendar}>
              <span className={FIELD_LABEL_CLASS_NAME}>Обратно</span>
              <span className={FIELD_VALUE_CLASS_NAME}>{formatDate(returnDate)}</span>
            </button>
          )}

          <button
            className={`${FIELD_BUTTON_CLASS_NAME} col-span-2 ${
              isOneWay ? 'lg:col-start-4 lg:col-end-6' : 'lg:col-start-5 lg:col-end-6'
            }`}
            type="button"
            onClick={() => setActivePanel('passengers')}
          >
            <span className={FIELD_LABEL_CLASS_NAME}>Пассажиры и класс</span>
            <span className={FIELD_VALUE_CLASS_NAME}>{formatPassengerSummary(passengers)}</span>
          </button>

          <button
            className="col-span-2 h-[60px] cursor-pointer rounded-xl border-0 bg-accent px-4 text-xs leading-4 font-semibold text-text-primary hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary md:h-16 md:text-sm md:leading-5 lg:col-span-1"
            type="submit"
          >
            Найти билеты
          </button>
        </div>

        <label className="relative mt-3 flex w-fit cursor-pointer items-center gap-2 text-[10px] leading-[14px] md:text-xs md:leading-4">
          <input
            className="peer absolute h-px w-px opacity-0"
            type="checkbox"
            name="oneWay"
            checked={isOneWay}
            onChange={(evt) => handleOneWayChange(evt.target.checked)}
          />
          <span
            className="relative h-[18px] w-8 flex-none rounded-full bg-[#c7cdd4] transition-colors duration-[160ms] after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:rounded-full after:bg-white after:content-[''] after:transition-transform after:duration-[160ms] peer-checked:bg-accent peer-checked:after:translate-x-3.5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text-primary"
            aria-hidden="true"
          />
          <span>Билет в одну сторону</span>
        </label>
      </form>

      {activePanel === 'calendar' && (
        <DatePicker
          departureDate={departureDate}
          returnDate={returnDate}
          selectionMode={selectionMode}
          onSelect={handleDateSelect}
        />
      )}

      {activePanel === 'passengers' && (
        <PassengerSelector value={passengers} onChange={setPassengers} />
      )}
    </section>
  )
}

export default TripSearchForm
