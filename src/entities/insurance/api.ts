import { queryOptions, useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/shared/api'
import type { InsuranceDto, SearchInsurancesParams } from './types'

export const insuranceKeys = {
  all: ['insurances'] as const,
  searches: () => [...insuranceKeys.all, 'search'] as const,
  search: (params: SearchInsurancesParams) => [...insuranceKeys.searches(), params] as const,
}

export function insuranceSearchQueryOptions(params: SearchInsurancesParams = {}, enabled = true) {
  return queryOptions({
    queryKey: insuranceKeys.search(params),
    queryFn: ({ signal }) =>
      apiRequest<InsuranceDto[]>('/api/v1/insurance/search', {
        method: 'GET',
        params,
        signal,
      }),
    enabled,
    staleTime: 60_000,
  })
}

export function useInsuranceSearchQuery(params: SearchInsurancesParams = {}, enabled = true) {
  return useQuery(insuranceSearchQueryOptions(params, enabled))
}
