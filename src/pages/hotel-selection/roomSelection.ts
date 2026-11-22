import { hotels } from './hotels'
import { getRoomsForHotel, type Room } from './rooms'

export type RoomSelection = { hotelId: string; rooms: { roomId: string; quantity: number }[] }
export type SelectedRoom = { room: Room; quantity: number }

export function readRoomSelection(): RoomSelection | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem('selected-room') || 'null') as {
      hotelId?: string
      roomId?: string
      rooms?: { roomId: string; quantity: number }[]
    } | null
    const hotel = hotels.find((item) => item.id === saved?.hotelId)
    if (!hotel || !saved) return null
    const available = getRoomsForHotel(hotel.price)
    const entries = Array.isArray(saved.rooms)
      ? saved.rooms
      : saved.roomId
        ? [{ roomId: saved.roomId, quantity: 1 }]
        : []
    const unique = new Map<string, number>()
    for (const item of entries) {
      if (
        available.some((room) => room.id === item?.roomId) &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0
      )
        unique.set(item.roomId, item.quantity)
    }
    const rooms = [...unique].map(([roomId, quantity]) => ({ roomId, quantity }))
    return rooms.length ? { hotelId: hotel.id, rooms } : null
  } catch {
    return null
  }
}

export function resolveSelectedRooms(selection: RoomSelection | null): SelectedRoom[] {
  const hotel = hotels.find((item) => item.id === selection?.hotelId)
  if (!hotel || !selection) return []
  const available = getRoomsForHotel(hotel.price)
  return selection.rooms.flatMap(({ roomId, quantity }) => {
    const room = available.find((item) => item.id === roomId)
    return room ? [{ room, quantity }] : []
  })
}

export function getRoomCapacity(rooms: SelectedRoom[]) {
  return rooms.reduce((total, item) => total + item.room.capacity * item.quantity, 0)
}

export function getRoomNightlyTotal(rooms: SelectedRoom[]) {
  return rooms.reduce((total, item) => total + item.room.price * item.quantity, 0)
}

export function getTripPassengerCount() {
  try {
    const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
      passengers?: { adults?: number; children?: number; infants?: number }
    } | null
    if (!search?.passengers) return 1
    const { adults = 0, children = 0, infants = 0 } = search.passengers
    return adults + children + infants
  } catch {
    return 1
  }
}
