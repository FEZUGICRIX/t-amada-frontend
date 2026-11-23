import PassengerField from './PassengerField'

export type PassengerCategory = 'взрослый' | 'ребёнок' | 'младенец'

function PassengerCard({ index, category }: { index: number; category: PassengerCategory }) {
  const prefix = `passenger-${index}`
  return (
    <fieldset className="min-w-0 rounded-2xl border border-[#e1e4e8] bg-white p-4 md:p-5">
      <legend className="sr-only">
        Пассажир {index} · {category}
      </legend>
      <h2 className="text-lg leading-6 font-semibold md:text-xl">
        Пассажир {index} · {category}
      </h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 md:grid-cols-3">
        <PassengerField
          id={`${prefix}-surname`}
          name={`${prefix}-surname`}
          label="Фамилия"
          autoComplete="off"
        />
        <PassengerField
          id={`${prefix}-name`}
          name={`${prefix}-name`}
          label="Имя"
          autoComplete="off"
        />
        <PassengerField
          id={`${prefix}-birth-date`}
          name={`${prefix}-birth-date`}
          label="Дата рождения"
          placeholder="ДД.ММ.ГГГГ"
          inputMode="numeric"
          autoComplete="off"
        />
        <PassengerField
          id={`${prefix}-citizenship`}
          name={`${prefix}-citizenship`}
          label="Гражданство"
          autoComplete="off"
        />
        <PassengerField
          id={`${prefix}-document`}
          name={`${prefix}-document`}
          label="Документ"
          autoComplete="off"
        />
        <PassengerField
          id={`${prefix}-document-number`}
          name={`${prefix}-document-number`}
          label="Серия и номер"
          autoComplete="off"
        />
      </div>
    </fieldset>
  )
}

export default PassengerCard
