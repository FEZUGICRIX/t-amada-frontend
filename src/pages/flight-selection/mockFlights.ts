import type { Flight } from './types'

export const outboundFlights: Flight[] = [
  {
    id: 'aeroflot-1',
    airline: 'Аэрофлот',
    code: 'SU',
    departure: {
      city: 'Москва',
      airport: 'SVO',
      time: '10:20',
    },
    arrival: {
      city: 'Сочи',
      airport: 'AER',
      time: '14:05',
    },
    duration: '3 ч 45 мин',
    stops: [],
    baggage: '23 кг',
    travelClass: 'economy',
    price: 12440,
  },
  {
    id: 'pobeda-1',
    airline: 'Победа',
    code: 'DP',
    departure: {
      city: 'Москва',
      airport: 'VKO',
      time: '12:45',
    },
    arrival: {
      city: 'Сочи',
      airport: 'AER',
      time: '16:25',
    },
    duration: '3 ч 40 мин',
    stops: [],
    baggage: '10 кг',
    travelClass: 'economy',
    price: 9840,
  },
  {
    id: 'rossiya-1',
    airline: 'Россия + Аэрофлот',
    code: 'FV',
    departure: {
      city: 'Москва',
      airport: 'SVO',
      time: '08:10',
    },
    arrival: {
      city: 'Сочи',
      airport: 'AER',
      time: '14:45',
    },
    duration: '6 ч 35 мин',
    stops: [
      {
        airport: 'LED',
        duration: '1 ч 35 мин',
      },
    ],
    baggage: '23 кг',
    travelClass: 'economy',
    price: 11980,
  },
  {
    id: 's7-1',
    airline: 'S7 Airlines',
    code: 'S7',
    departure: {
      city: 'Москва',
      airport: 'DME',
      time: '06:30',
    },
    arrival: {
      city: 'Сочи',
      airport: 'AER',
      time: '10:15',
    },
    duration: '3 ч 45 мин',
    stops: [],
    baggage: '23 кг',
    travelClass: 'business',
    price: 18750,
  },
  {
    id: 'ural-1',
    airline: 'Уральские авиалинии',
    code: 'U6',
    departure: {
      city: 'Москва',
      airport: 'DME',
      time: '15:40',
    },
    arrival: {
      city: 'Сочи',
      airport: 'AER',
      time: '19:30',
    },
    duration: '3 ч 50 мин',
    stops: [],
    baggage: 'без багажа',
    travelClass: 'economy',
    price: 10290,
  },
  {
    id: 'nordwind-1',
    airline: 'Nordwind Airlines',
    code: 'N4',
    departure: {
      city: 'Москва',
      airport: 'SVO',
      time: '18:20',
    },
    arrival: {
      city: 'Сочи',
      airport: 'AER',
      time: '23:55',
    },
    duration: '5 ч 35 мин',
    stops: [
      {
        airport: 'KZN',
        duration: '1 ч 10 мин',
      },
    ],
    baggage: '20 кг',
    travelClass: 'economy',
    price: 11350,
  },
]

const returnSchedule = [
  { departureTime: '09:15', arrivalTime: '13:05', price: 12790 },
  { departureTime: '11:30', arrivalTime: '15:20', price: 10340 },
  { departureTime: '14:10', arrivalTime: '20:35', price: 12180 },
  { departureTime: '16:40', arrivalTime: '20:30', price: 19250 },
  { departureTime: '18:25', arrivalTime: '22:15', price: 10790 },
  { departureTime: '20:10', arrivalTime: '01:45', price: 11650 },
] as const

export const returnFlights: Flight[] = outboundFlights.map((flight, index) => {
  const schedule = returnSchedule[index]

  return {
    ...flight,
    id: `return-${flight.id}`,
    departure: {
      city: flight.arrival.city,
      airport: flight.arrival.airport,
      time: schedule.departureTime,
    },
    arrival: {
      city: flight.departure.city,
      airport: flight.departure.airport,
      time: schedule.arrivalTime,
    },
    price: schedule.price,
  }
})
