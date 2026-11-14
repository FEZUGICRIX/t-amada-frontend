export type Room = {
  id: string
  name: string
  capacity: number
  category: 'standard' | 'suite'
  amenities: string[]
  price: number
}
export const rooms: Room[] = [
  {
    id: 'standard-single',
    name: 'Стандарт одноместный',
    capacity: 1,
    category: 'standard',
    amenities: ['Wi-Fi', 'Кондиционер', 'Ванная комната'],
    price: 15000,
  },
  {
    id: 'standard-double',
    name: 'Стандарт двухместный',
    capacity: 2,
    category: 'standard',
    amenities: ['Wi-Fi', 'Кондиционер', 'Двуспальная кровать'],
    price: 24000,
  },
  {
    id: 'suite-double',
    name: 'Люкс двухместный',
    capacity: 2,
    category: 'suite',
    amenities: ['Wi-Fi', 'Гостиная', 'Завтрак'],
    price: 39000,
  },
]

export function getRoomsForHotel(basePrice: number): Room[] {
  return rooms.map((room) => ({ ...room, price: basePrice + room.price - 15000 }))
}
