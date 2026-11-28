import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/shared/api'
import type { FlightCitiesParams, FlightCity, FlightDto, SearchFlightsParams } from './types'

export const flightKeys = {
  all: ['flights'] as const,
  citiesLists: () => [...flightKeys.all, 'cities'] as const,
  cities: (params: FlightCitiesParams) => [...flightKeys.citiesLists(), params] as const,
  searches: () => [...flightKeys.all, 'search'] as const,
  search: (params: SearchFlightsParams) => [...flightKeys.searches(), params] as const,
}

export function flightCitiesQueryOptions(params: FlightCitiesParams = {}, enabled = true) {
  const normalized: FlightCitiesParams = {
    query: params.query?.trim() || undefined,
    limit: params.limit ?? 10,
  }

  return queryOptions({
    queryKey: flightKeys.cities(normalized),
    queryFn: ({ signal }) =>
      apiRequest<FlightCity[]>('/api/v1/flight/cities', {
        method: 'GET',
        params: normalized,
        signal,
      }),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function flightSearchQueryOptions(params: SearchFlightsParams, enabled = true) {
  return queryOptions({
    queryKey: flightKeys.search(params),
    queryFn: ({ signal }) =>
      apiRequest<FlightDto[]>('/api/v1/flight/search', {
        method: 'GET',
        params,
        signal,
      }),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useFlightCitiesQuery(params: FlightCitiesParams = {}, enabled = true) {
  return useQuery(flightCitiesQueryOptions(params, enabled))
}

export function useFlightSearchQuery(params: SearchFlightsParams, enabled = true) {
  return useQuery(flightSearchQueryOptions(params, enabled))
}
