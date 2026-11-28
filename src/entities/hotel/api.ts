import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/shared/api'
import type { GetHotelRoomsParams, HotelDto, HotelRoomDto, SearchHotelsParams } from './types'

export const hotelKeys = {
  all: ['hotels'] as const,
  searches: () => [...hotelKeys.all, 'search'] as const,
  search: (params: SearchHotelsParams) => [...hotelKeys.searches(), params] as const,
  roomsLists: () => [...hotelKeys.all, 'rooms'] as const,
  rooms: (hotelId: string, params: GetHotelRoomsParams = {}) =>
    [...hotelKeys.roomsLists(), hotelId, params] as const,
}

export function hotelSearchQueryOptions(params: SearchHotelsParams, enabled = true) {
  return queryOptions({
    queryKey: hotelKeys.search(params),
    queryFn: ({ signal }) =>
      apiRequest<HotelDto[]>('/api/v1/hotel/search', {
        method: 'GET',
        params,
        signal,
      }),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function hotelRoomsQueryOptions(
  hotelId: string,
  params: GetHotelRoomsParams = {},
  enabled = Boolean(hotelId),
) {
  return queryOptions({
    queryKey: hotelKeys.rooms(hotelId, params),
    queryFn: ({ signal }) =>
      apiRequest<HotelRoomDto[]>(`/api/v1/hotel/${encodeURIComponent(hotelId)}/rooms`, {
        method: 'GET',
        params,
        signal,
      }),
    enabled,
    staleTime: 30_000,
  })
}

export function useHotelSearchQuery(params: SearchHotelsParams, enabled = true) {
  return useQuery(hotelSearchQueryOptions(params, enabled))
}

export function useHotelRoomsQuery(
  hotelId: string,
  params: GetHotelRoomsParams = {},
  enabled = Boolean(hotelId),
) {
  return useQuery(hotelRoomsQueryOptions(hotelId, params, enabled))
}
