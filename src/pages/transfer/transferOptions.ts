export type TransferOption = {
  id: string
  name: string
  vehicle: string
  capacity: number
  description: string
  price: number
}

export const transferOptions: TransferOption[] = [
  {
    id: 'standard',
    name: 'Стандарт',
    vehicle: 'Седан',
    capacity: 3,
    description: 'Комфортная поездка до отеля',
    price: 1200,
  },
  {
    id: 'minivan',
    name: 'Минивэн',
    vehicle: 'Минивэн',
    capacity: 6,
    description: 'Увеличенный багажник',
    price: 1900,
  },
]
