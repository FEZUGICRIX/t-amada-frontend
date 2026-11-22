export type TransferOption = {
  id: string
  name: string
  vehicle: string
  capacity: number
  features: string[]
  price: number
}

export const transferOptions: TransferOption[] = [
  {
    id: 'standard',
    name: 'Стандарт',
    vehicle: 'Седан',
    capacity: 3,
    features: ['Кондиционер', 'Место для багажа'],
    price: 1200,
  },
  {
    id: 'minivan',
    name: 'Минивэн',
    vehicle: 'Минивэн',
    capacity: 6,
    features: ['Кондиционер', 'Увеличенный багажник', 'Для большой компании'],
    price: 1900,
  },
]
