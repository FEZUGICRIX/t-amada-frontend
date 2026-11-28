import { queryOptions, useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/shared/api'
import type { SearchTransfersParams, TransferDto } from './types'

export const transferKeys = {
  all: ['transfers'] as const,
  searches: () => [...transferKeys.all, 'search'] as const,
  search: (params: SearchTransfersParams) => [...transferKeys.searches(), params] as const,
}

export function transferSearchQueryOptions(params: SearchTransfersParams = {}, enabled = true) {
  return queryOptions({
    queryKey: transferKeys.search(params),
    queryFn: ({ signal }) =>
      apiRequest<TransferDto[]>('/api/v1/transfer/search', {
        method: 'GET',
        params,
        signal,
      }),
    enabled,
    staleTime: 60_000,
  })
}

export function useTransferSearchQuery(params: SearchTransfersParams = {}, enabled = true) {
  return useQuery(transferSearchQueryOptions(params, enabled))
}
