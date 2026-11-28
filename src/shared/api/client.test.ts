import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest, isRetryableApiError } from './client'

describe('apiRequest', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('serializes query arrays and attaches correlation and idempotency headers', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    const result = await apiRequest<{ ok: boolean }>('/api/v1/hotel/search', {
      params: { city: 'Сочи', stars: [4, 5], empty: undefined },
      idempotencyKey: 'idem-1',
    })

    expect(result).toEqual({ ok: true })
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('/api/v1/hotel/search?city=%D0%A1%D0%BE%D1%87%D0%B8&stars=4&stars=5')
    const headers = new Headers(init?.headers)
    expect(headers.get('Idempotency-Key')).toBe('idem-1')
    expect(headers.get('X-Correlation-Id')).toBeTruthy()
  })

  it('parses NestJS validation errors and rejects invalid JSON with ApiError', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ statusCode: 400, message: ['bad date'], error: 'Bad Request' }),
        {
          status: 400,
        },
      ),
    )

    await expect(apiRequest('/api/v1/flight/search')).rejects.toMatchObject({
      status: 400,
      message: 'bad date',
      validationErrors: ['bad date'],
    })

    fetchSpy.mockResolvedValueOnce(new Response('<html>502</html>', { status: 200 }))
    await expect(apiRequest('/api/v1/orders')).rejects.toBeInstanceOf(ApiError)

    expect(isRetryableApiError(new ApiError({ status: 409, message: 'Conflict' }))).toBe(false)
    expect(isRetryableApiError(new ApiError({ status: 503, message: 'Unavailable' }))).toBe(true)
  })
})
