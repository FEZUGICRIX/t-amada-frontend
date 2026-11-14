export type Hotel = {
  id: string
  name: string
  stars: number
  description: string
  details: string
  amenities: string[]
  price: number
  image: string
  breakfast: boolean
  freeCancellation: boolean
}

export const hotels: Hotel[] = [
  {
    id: 'sea-galaxy',
    name: 'Sea Galaxy Hotel Congress & SPA',
    stars: 4,
    description: 'Сочи, рядом с морем',
    details:
      'Отель рядом с морем. Для отдыха гостей предусмотрены бассейн и спа, на территории доступен Wi-Fi.',
    amenities: ['Wi-Fi', 'Бассейн', 'Спа'],
    breakfast: true,
    freeCancellation: true,
    price: 43800,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=480&q=75',
  },
  {
    id: 'pullman',
    name: 'Pullman Sochi Centre',
    stars: 5,
    description: 'Сочи, центр города',
    details:
      'Отель в центре Сочи с рестораном и бассейном. Гости могут пользоваться Wi-Fi и выбрать проживание с завтраком.',
    amenities: ['Wi-Fi', 'Бассейн', 'Ресторан'],
    breakfast: true,
    freeCancellation: false,
    price: 58900,
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=480&q=75',
  },
  {
    id: 'radisson',
    name: 'Radisson Collection Paradise Resort',
    stars: 5,
    description: 'Сочи, рядом с морем',
    details:
      'Отель рядом с морем с бассейном и спа. На территории доступен Wi-Fi, предусмотрена бесплатная отмена.',
    amenities: ['Wi-Fi', 'Бассейн', 'Спа'],
    breakfast: false,
    freeCancellation: true,
    price: 66400,
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=480&q=75',
  },
  {
    id: 'demo-hotel',
    name: 'Отель у моря',
    stars: 3,
    description: 'Сочи',
    details: 'Отель в Сочи с рестораном и Wi-Fi. Подойдёт для отдыха и прогулок по городу.',
    amenities: ['Wi-Fi', 'Ресторан'],
    breakfast: false,
    freeCancellation: false,
    price: 39500,
    image:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=480&q=75',
  },
]
