import PassengerField from './PassengerField'
import PassengerSelect from './PassengerSelect'
import { formatBirthDate } from './passengerFormatting'
import type { FieldErrors, PassengerData } from './passengerValidation'

export type PassengerCategory = 'взрослый' | 'ребёнок' | 'младенец'

function PassengerCard({
  index,
  passenger,
  errors,
  onChange,
}: {
  index: number
  passenger: PassengerData
  errors: FieldErrors
  onChange: (value: PassengerData) => void
}) {
  const category = passenger.category
  const prefix = `passenger-${index}`
  const field = (
    name: keyof Omit<PassengerData, 'category'>,
    label: string,
    suffix: string,
    extra?: { placeholder?: string; inputMode?: 'numeric' },
  ) => (
    <PassengerField
      id={`${prefix}-${suffix}`}
      name={`${prefix}-${suffix}`}
      label={label}
      autoComplete="off"
      value={passenger[name]}
      onChange={(event) =>
        onChange({
          ...passenger,
          [name]: name === 'birthDate' ? formatBirthDate(event.target.value) : event.target.value,
        })
      }
      error={errors[`${prefix}-${suffix}`]}
      {...extra}
    />
  )
  return (
    <fieldset className="min-w-0 rounded-2xl border border-[#e1e4e8] bg-white p-4 md:p-5">
      <legend className="sr-only">
        Пассажир {index} · {category}
      </legend>
      <h2 className="text-lg leading-6 font-semibold md:text-xl">
        Пассажир {index} · {category}
      </h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 md:grid-cols-3">
        {field('surname', 'Фамилия', 'surname')}
        {field('name', 'Имя', 'name')}
        {field('birthDate', 'Дата рождения', 'birth-date', {
          placeholder: 'ДД.ММ.ГГГГ',
          inputMode: 'numeric',
        })}
        <PassengerSelect
          id={`${prefix}-citizenship`}
          label="Гражданство"
          value={passenger.citizenship}
          options={['Россия', 'Другое']}
          onChange={(citizenship) => {
            if (citizenship !== passenger.citizenship)
              onChange({
                ...passenger,
                citizenship,
                document:
                  citizenship === 'Россия'
                    ? category === 'взрослый'
                      ? 'Паспорт РФ'
                      : 'Свидетельство о рождении РФ'
                    : 'Иностранный документ',
                documentNumber: '',
              })
          }}
        />
        <PassengerSelect
          id={`${prefix}-document`}
          label="Документ"
          value={passenger.document}
          options={
            passenger.citizenship === 'Россия'
              ? ['Паспорт РФ', 'Свидетельство о рождении РФ']
              : ['Иностранный документ']
          }
          onChange={(document) => {
            if (document !== passenger.document)
              onChange({ ...passenger, document, documentNumber: '' })
          }}
        />
        {field('documentNumber', 'Серия и номер', 'document-number')}
      </div>
    </fieldset>
  )
}

export default PassengerCard
