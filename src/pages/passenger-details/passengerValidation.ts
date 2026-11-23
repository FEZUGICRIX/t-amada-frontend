import type { PassengerCategory } from './PassengerCard'

export type PassengerData = {
  category: PassengerCategory
  surname: string
  name: string
  birthDate: string
  citizenship: string
  document: string
  documentNumber: string
}
export type BuyerData = { phone: string; email: string }
export type FieldErrors = Record<string, string>

export function emptyPassenger(category: PassengerCategory): PassengerData {
  return {
    category,
    surname: '',
    name: '',
    birthDate: '',
    citizenship: 'Россия',
    document: category === 'взрослый' ? 'Паспорт РФ' : 'Свидетельство о рождении РФ',
    documentNumber: '',
  }
}

export function parseBirthDate(value: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())
  if (!match) return null
  const day = Number(match[1]),
    month = Number(match[2]),
    year = Number(match[3])
  const date = new Date(0)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCFullYear(year, month - 1, day)
  if (
    year < 1900 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null
  return `${match[3]}-${match[2]}-${match[1]}`
}

export function validateContact(buyer: BuyerData): FieldErrors {
  const errors: FieldErrors = {}
  const phone = buyer.phone.trim()
  if (!phone) errors['buyer-phone'] = 'Укажите телефон'
  else if (
    !/^\+?[\d\s()-]+$/.test(phone) ||
    phone.replace(/\D/g, '').length < 10 ||
    phone.replace(/\D/g, '').length > 15
  )
    errors['buyer-phone'] = 'Проверьте номер телефона'
  if (!buyer.email.trim()) errors['buyer-email'] = 'Укажите электронную почту'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim()))
    errors['buyer-email'] = 'Проверьте адрес электронной почты'
  return errors
}

export function validatePassenger(
  passenger: PassengerData,
  index: number,
  departureDate: string | null,
): FieldErrors {
  const prefix = `passenger-${index}`
  const errors: FieldErrors = {}
  for (const [key, value, message] of [
    ['surname', passenger.surname, 'Укажите фамилию'],
    ['name', passenger.name, 'Укажите имя'],
    ['citizenship', passenger.citizenship, 'Укажите гражданство'],
    ['document', passenger.document, 'Укажите документ'],
    ['document-number', passenger.documentNumber, 'Укажите серию и номер документа'],
  ])
    if (!value.trim()) errors[`${prefix}-${key}`] = message
  const birthDate = parseBirthDate(passenger.birthDate)
  if (!passenger.birthDate.trim()) errors[`${prefix}-birth-date`] = 'Укажите дату рождения'
  else if (!birthDate) errors[`${prefix}-birth-date`] = 'Проверьте дату в формате ДД.ММ.ГГГГ'
  else if (departureDate && birthDate > departureDate)
    errors[`${prefix}-birth-date`] = 'Дата рождения не может быть позже даты вылета'
  if (birthDate && departureDate && birthDate <= departureDate) {
    const [year, month, day] = birthDate.split('-').map(Number)
    const [tripYear, tripMonth, tripDay] = departureDate.split('-').map(Number)
    const age =
      tripYear - year - (tripMonth < month || (tripMonth === month && tripDay < day) ? 1 : 0)
    if (
      (passenger.category === 'взрослый' && age < 12) ||
      (passenger.category === 'ребёнок' && (age < 2 || age >= 12)) ||
      (passenger.category === 'младенец' && age >= 2)
    )
      errors[`${prefix}-birth-date`] = 'Возраст на дату вылета не соответствует категории пассажира'
  }
  if (passenger.documentNumber.trim()) {
    const value = passenger.documentNumber.trim()
    if (passenger.document === 'Паспорт РФ' && !/^\d{10}$/.test(value.replace(/\s/g, '')))
      errors[`${prefix}-document-number`] = 'Введите 10 цифр серии и номера паспорта'
    if (
      passenger.document === 'Свидетельство о рождении РФ' &&
      !/^[IVXІ]+[-\s]?[А-ЯЁ]{2}[-\s]?\d{6}$/i.test(value)
    )
      errors[`${prefix}-document-number`] = 'Введите серию и номер, например II-АБ 123456'
  }
  return errors
}
