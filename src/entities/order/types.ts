export type OrderStatus = 'NEW' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLING' | 'CANCELLED'

export type BookingType = 'FLIGHT' | 'HOTEL' | 'INSURANCE' | 'TRANSFER'

export type BookingStatus =
  'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED' | 'CANCELLING' | 'CANCELLED'

export interface HotelRoomPayload {
  category: string
  tariff: string
  price: number
  stayConditions?: string
}

export interface CreateBookingStepPayload {
  type: BookingType
  resourceId: string
  price?: number
  roomsCount?: number
  rooms?: HotelRoomPayload[]
}

export interface PassengerPayload {
  firstName: string
  lastName: string
  middleName?: string
  birthDate: string
  documentNumber: string
  passengerType?: 'ADULT' | 'CHILD' | 'INFANT'
}

export interface CustomerContactPayload {
  email: string
  phone: string
}

export interface CreateOrderPayload {
  bookings: CreateBookingStepPayload[]
  passengers?: PassengerPayload[]
  customerContact?: CustomerContactPayload
}

export interface BookingStepDto {
  id: string
  type: BookingType
  resourceId: string
  status: BookingStatus
  externalId: string | null
  price: number
  roomsCount?: number | null
  rooms?: HotelRoomPayload[]
  errorCode?: string | null
  errorMessage?: string | null
  userMessage?: string | null
  cancellationReason?: string | null
}

export interface OrderOperationHistoryDto {
  id: string
  operationType: string
  stepType?: BookingType | null
  message: string
  createdAt: string
}

export interface OrderDto {
  id: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  basePrice: number
  serviceFee: number
  totalPrice: number
  bookingSteps: BookingStepDto[]
  passengers?: PassengerPayload[]
  customerContact?: CustomerContactPayload | null
  failureReason?: string | null
  userMessage?: string | null
  operationHistory?: OrderOperationHistoryDto[]
}

export interface ReplaceHotelPayload {
  resourceId: string
  price?: number
  roomsCount?: number
  rooms?: HotelRoomPayload[]
}
