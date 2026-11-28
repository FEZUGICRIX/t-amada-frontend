export type HotelDto = {
  id: string
  name: string
  description?: string | null
  address?: string | null
  city: string
  stars: number
  locationTag?: string | null
  imageUrl?: string | null
  tags: string[]
  hasBreakfast: boolean
  availableRooms: number
  pricePerNight: string
  totalPrice?: string
}

export type HotelRoomDto = {
  id: string
  hotelId: string
  name: string
  imageUrl: string | null
  capacityAdults: number
  capacityChildren: number
  hasBreakfast: boolean
  hasFreeCancellation: boolean
  tags: string[]
  availableRooms: number
  pricePerNight: string
  totalPrice?: string
}

export type SearchHotelsParams = {
  city?: string
  checkIn?: string
  checkOut?: string
  stars?: number[]
  hasBreakfast?: boolean
  hasFreeCancellation?: boolean
  minPrice?: number
  maxPrice?: number
}

export type GetHotelRoomsParams = {
  checkIn?: string
  checkOut?: string
}
