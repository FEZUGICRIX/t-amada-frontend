const ROW_CLASS_NAME =
  'flex min-h-[58px] items-center justify-between gap-4 border-b border-[#e3e5e8] px-2.5 py-2.5 md:px-3'

const COUNTER_BUTTON_CLASS_NAME =
  'grid size-8 cursor-pointer place-items-center rounded-full border border-[#e3e5e8] bg-[#f5f6f7] p-0 text-lg leading-none text-text-primary enabled:hover:bg-[#eceef0] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:cursor-default disabled:text-[#aeb4bd] disabled:opacity-60'

const CLASS_BUTTON_CLASS_NAME =
  'min-h-[30px] cursor-pointer rounded-lg border-0 bg-transparent px-3 text-[11px] text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent aria-pressed:bg-background-primary aria-pressed:font-semibold aria-pressed:shadow-[0_1px_4px_rgb(17_17_17_/_12%)]'

type TravelClass = 'economy' | 'business'

type PassengerSelection = {
  adults: number
  children: number
  infants: number
  travelClass: TravelClass
}

type PassengerType = 'adults' | 'children' | 'infants'

type PassengerSelectorProps = {
  value: PassengerSelection
  onChange: (value: PassengerSelection) => void
}

const MAX_PASSENGERS = 10

function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const totalPassengers = value.adults + value.children + value.infants

  function changePassengerCount(type: PassengerType, change: 1 | -1) {
    const nextCount = value[type] + change

    if (type === 'adults' && nextCount < 1) {
      return
    }

    if (type !== 'adults' && nextCount < 0) {
      return
    }

    if (change > 0 && totalPassengers >= MAX_PASSENGERS) {
      return
    }

    if (type === 'infants' && change > 0 && value.infants >= value.adults) {
      return
    }

    onChange({
      ...value,
      [type]: nextCount,
    })
  }
  return (
    <div
      className="mt-3 ml-auto w-full overflow-hidden rounded-[14px] border border-[#e3e5e8] bg-background-primary shadow-[0_8px_24px_rgb(17_17_17_/_8%)] md:mt-4 md:w-[294px] lg:mt-3 lg:w-[330px]"
      role="dialog"
      aria-label="Выбор пассажиров и класса"
    >
      <div className={ROW_CLASS_NAME}>
        <div className="flex min-w-0 flex-col">
          <strong className="text-sm leading-5 font-semibold">Взрослые</strong>
          <span className="text-xs leading-4 text-text-secondary">12 лет и старше</span>
        </div>

        <div className="grid flex-none grid-cols-[32px_24px_32px] items-center gap-1">
          <button
            className={COUNTER_BUTTON_CLASS_NAME}
            type="button"
            aria-label="Уменьшить количество взрослых"
            disabled={value.adults <= 1}
            onClick={() => changePassengerCount('adults', -1)}
          >
            −
          </button>

          <span className="text-center text-sm font-semibold">{value.adults}</span>

          <button
            className={COUNTER_BUTTON_CLASS_NAME}
            type="button"
            aria-label="Увеличить количество взрослых"
            disabled={totalPassengers >= MAX_PASSENGERS}
            onClick={() => changePassengerCount('adults', 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className={ROW_CLASS_NAME}>
        <div className="flex min-w-0 flex-col">
          <strong className="text-sm leading-5 font-semibold">Дети</strong>
          <span className="text-xs leading-4 text-text-secondary">2–11 лет</span>
        </div>

        <div className="grid flex-none grid-cols-[32px_24px_32px] items-center gap-1">
          <button
            className={COUNTER_BUTTON_CLASS_NAME}
            type="button"
            aria-label="Уменьшить количество детей"
            disabled={value.children <= 0}
            onClick={() => changePassengerCount('children', -1)}
          >
            −
          </button>

          <span className="text-center text-sm font-semibold">{value.children}</span>

          <button
            className={COUNTER_BUTTON_CLASS_NAME}
            type="button"
            aria-label="Увеличить количество детей"
            disabled={totalPassengers >= MAX_PASSENGERS}
            onClick={() => changePassengerCount('children', 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className={ROW_CLASS_NAME}>
        <div className="flex min-w-0 flex-col">
          <strong className="text-sm leading-5 font-semibold">Младенцы</strong>
          <span className="text-xs leading-4 text-text-secondary">До 2 лет, без места</span>
        </div>

        <div className="grid flex-none grid-cols-[32px_24px_32px] items-center gap-1">
          <button
            className={COUNTER_BUTTON_CLASS_NAME}
            type="button"
            aria-label="Уменьшить количество младенцев"
            disabled={value.infants <= 0}
            onClick={() => changePassengerCount('infants', -1)}
          >
            −
          </button>

          <span className="text-center text-sm font-semibold">{value.infants}</span>

          <button
            className={COUNTER_BUTTON_CLASS_NAME}
            type="button"
            aria-label="Увеличить количество младенцев"
            disabled={totalPassengers >= MAX_PASSENGERS || value.infants >= value.adults}
            onClick={() => changePassengerCount('infants', 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className={`${ROW_CLASS_NAME} min-h-14 border-b-0`}>
        <strong className="text-sm leading-5 font-semibold">Класс</strong>

        <div className="flex rounded-[10px] bg-[#eef0f2] p-[3px]">
          <button
            className={CLASS_BUTTON_CLASS_NAME}
            type="button"
            aria-pressed={value.travelClass === 'economy'}
            onClick={() =>
              onChange({
                ...value,
                travelClass: 'economy',
              })
            }
          >
            Эконом
          </button>

          <button
            className={CLASS_BUTTON_CLASS_NAME}
            type="button"
            aria-pressed={value.travelClass === 'business'}
            onClick={() =>
              onChange({
                ...value,
                travelClass: 'business',
              })
            }
          >
            Бизнес
          </button>
        </div>
      </div>
    </div>
  )
}

export default PassengerSelector
export type { PassengerSelection }
