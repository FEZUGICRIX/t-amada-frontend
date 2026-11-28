import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest, createRequestId, type ApiError } from '@/shared/api'
import type {
  CreateOrderPayload,
  OrderDto,
  OrderOperationHistoryDto,
  ReplaceHotelPayload,
} from './types'

export const orderKeys = {
  all: ['orders'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (orderId: string) => [...orderKeys.details(), orderId] as const,
  history: (orderId: string) => [...orderKeys.detail(orderId), 'history'] as const,
}

export function orderDetailQueryOptions(orderId: string, enabled = Boolean(orderId)) {
  return queryOptions({
    queryKey: orderKeys.detail(orderId),
    queryFn: ({ signal }) =>
      apiRequest<OrderDto>(`/api/v1/orders/${encodeURIComponent(orderId)}`, {
        method: 'GET',
        signal,
      }),
    enabled,
    staleTime: 10_000,
  })
}

export function orderHistoryQueryOptions(orderId: string, enabled = Boolean(orderId)) {
  return queryOptions({
    queryKey: orderKeys.history(orderId),
    queryFn: ({ signal }) =>
      apiRequest<OrderOperationHistoryDto[]>(
        `/api/v1/orders/${encodeURIComponent(orderId)}/history`,
        {
          method: 'GET',
          signal,
        },
      ),
    enabled,
    staleTime: 10_000,
  })
}

export function useOrderQuery(orderId: string, enabled = Boolean(orderId)) {
  return useQuery(orderDetailQueryOptions(orderId, enabled))
}

export function useOrderHistoryQuery(orderId: string, enabled = Boolean(orderId)) {
  return useQuery(orderHistoryQueryOptions(orderId, enabled))
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation<OrderDto, ApiError, { payload: CreateOrderPayload; idempotencyKey?: string }>({
    mutationFn: ({ payload, idempotencyKey }) =>
      apiRequest<OrderDto, CreateOrderPayload>('/api/v1/orders', {
        method: 'POST',
        body: payload,
        idempotencyKey: idempotencyKey ?? createRequestId(),
      }),
    onSuccess: (createdOrder) => {
      queryClient.setQueryData(orderKeys.detail(createdOrder.id), createdOrder)
    },
  })
}

interface OrderRollbackContext {
  previousOrder: OrderDto | undefined
}

interface OptimisticOrderMutationConfig<TVariables> {
  mutationFn: (variables: TVariables) => Promise<OrderDto>
  applyOptimistic: (order: OrderDto, variables: TVariables) => OrderDto
}

function useOptimisticOrderMutation<TVariables = void>(
  orderId: string,
  { mutationFn, applyOptimistic }: OptimisticOrderMutationConfig<TVariables>,
) {
  const queryClient = useQueryClient()
  const detailKey = orderKeys.detail(orderId)
  const historyKey = orderKeys.history(orderId)

  return useMutation<OrderDto, ApiError, TVariables, OrderRollbackContext>({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: detailKey })
      const previousOrder = queryClient.getQueryData<OrderDto>(detailKey)

      if (previousOrder) {
        queryClient.setQueryData<OrderDto>(detailKey, applyOptimistic(previousOrder, variables))
      }

      return { previousOrder }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(detailKey, context.previousOrder)
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: detailKey }),
        queryClient.invalidateQueries({ queryKey: historyKey }),
      ])
    },
  })
}

export function useStartOrderMutation(orderId: string) {
  return useOptimisticOrderMutation(orderId, {
    mutationFn: () =>
      apiRequest<OrderDto>(`/api/v1/orders/${encodeURIComponent(orderId)}/start-async`, {
        method: 'POST',
      }),
    applyOptimistic: (order) => ({ ...order, status: 'PROCESSING' }),
  })
}

export function useReplaceHotelMutation(orderId: string) {
  return useOptimisticOrderMutation<ReplaceHotelPayload>(orderId, {
    mutationFn: (payload) =>
      apiRequest<OrderDto, ReplaceHotelPayload>(
        `/api/v1/orders/${encodeURIComponent(orderId)}/hotel/replace`,
        {
          method: 'POST',
          body: payload,
        },
      ),
    applyOptimistic: (order, payload) => ({
      ...order,
      bookingSteps: order.bookingSteps.map((step) =>
        step.type === 'HOTEL'
          ? {
              ...step,
              resourceId: payload.resourceId,
              status: 'PENDING',
              roomsCount: payload.roomsCount ?? step.roomsCount,
              rooms: payload.rooms ?? step.rooms,
              errorCode: null,
              errorMessage: null,
              userMessage: null,
            }
          : step,
      ),
    }),
  })
}

export function useCancelStepMutation(orderId: string) {
  return useOptimisticOrderMutation<string>(orderId, {
    mutationFn: (stepId) =>
      apiRequest<OrderDto>(
        `/api/v1/orders/${encodeURIComponent(orderId)}/steps/${encodeURIComponent(stepId)}/cancel`,
        {
          method: 'POST',
        },
      ),
    applyOptimistic: (order, stepId) => ({
      ...order,
      bookingSteps: order.bookingSteps.map((step) =>
        step.id === stepId ? { ...step, status: 'CANCELLING' } : step,
      ),
    }),
  })
}

export function useCancelOrderMutation(orderId: string) {
  return useOptimisticOrderMutation(orderId, {
    mutationFn: () =>
      apiRequest<OrderDto>(`/api/v1/orders/${encodeURIComponent(orderId)}/cancel`, {
        method: 'POST',
      }),
    applyOptimistic: (order) => ({ ...order, status: 'CANCELLING' }),
  })
}
