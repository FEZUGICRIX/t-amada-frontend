import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { orderKeys, useCancelOrderMutation, useOrderQuery, useReplaceHotelMutation } from './api'
import type { OrderDto } from './types'

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

function makeOrder(overrides: Partial<OrderDto> = {}): OrderDto {
  return {
    id: 'order-1',
    status: 'NEW',
    createdAt: '2026-11-28T10:00:00Z',
    updatedAt: '2026-11-28T10:00:00Z',
    basePrice: 25000,
    serviceFee: 167.5,
    totalPrice: 25167.5,
    bookingSteps: [
      {
        id: 'step-flight',
        type: 'FLIGHT',
        resourceId: 'flight-1',
        status: 'CONFIRMED',
        externalId: 'ext-flight-1',
        price: 15000,
      },
      {
        id: 'step-hotel',
        type: 'HOTEL',
        resourceId: 'hotel-old',
        status: 'FAILED',
        externalId: null,
        price: 10000,
        errorCode: 'RESOURCE_UNAVAILABLE',
      },
    ],
    ...overrides,
  }
}

describe('entities/order api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('optimistically cancels order, rolls back on error, and invalidates targeted keys', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    client.setQueryData(
      orderKeys.detail('order-1'),
      makeOrder({ id: 'order-1', status: 'COMPLETED' }),
    )
    client.setQueryData(
      orderKeys.detail('order-2'),
      makeOrder({ id: 'order-2', status: 'COMPLETED' }),
    )

    let rejectCancel!: (err: Error) => void
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
      () =>
        new Promise<Response>((_resolve, reject) => {
          rejectCancel = reject
        }),
    )

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    const { result } = renderHook(
      () => ({
        order: useOrderQuery('order-1', false),
        cancel: useCancelOrderMutation('order-1'),
      }),
      { wrapper: createWrapper(client) },
    )

    act(() => {
      result.current.cancel.mutate()
    })

    await waitFor(() => {
      expect(result.current.order.data?.status).toBe('CANCELLING')
    })

    expect(client.getQueryData<OrderDto>(orderKeys.detail('order-2'))?.status).toBe('COMPLETED')

    act(() => {
      rejectCancel(new Error('Network down'))
    })

    await waitFor(() => {
      expect(result.current.cancel.isError).toBe(true)
      expect(result.current.order.data?.status).toBe('COMPLETED')
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: orderKeys.detail('order-1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: orderKeys.history('order-1') })
    expect(invalidateSpy).not.toHaveBeenCalledWith({ queryKey: orderKeys.detail('order-2') })
  })

  it('optimistically updates hotel step on replace', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    client.setQueryData(orderKeys.detail('order-1'), makeOrder({ id: 'order-1', status: 'FAILED' }))

    let resolveReplace!: (res: Response) => void
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveReplace = resolve
        }),
    )

    const { result } = renderHook(
      () => ({
        order: useOrderQuery('order-1', false),
        replaceHotel: useReplaceHotelMutation('order-1'),
      }),
      { wrapper: createWrapper(client) },
    )

    act(() => {
      result.current.replaceHotel.mutate({ resourceId: 'hotel-new', roomsCount: 1 })
    })

    await waitFor(() => {
      const hotelStep = result.current.order.data?.bookingSteps.find((s) => s.type === 'HOTEL')
      expect(hotelStep?.resourceId).toBe('hotel-new')
      expect(hotelStep?.status).toBe('PENDING')
      expect(hotelStep?.errorCode).toBeNull()
    })

    resolveReplace(
      new Response(JSON.stringify(makeOrder({ id: 'order-1', status: 'FAILED' })), { status: 200 }),
    )

    await waitFor(() => {
      expect(result.current.replaceHotel.isSuccess).toBe(true)
    })
  })
})
