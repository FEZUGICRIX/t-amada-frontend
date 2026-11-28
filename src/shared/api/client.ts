export interface ApiErrorInit {
  status: number
  message: string
  code?: string
  details?: unknown
  validationErrors?: Record<string, string> | string[] | null
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly details?: unknown
  readonly validationErrors?: Record<string, string> | string[] | null

  constructor({ status, message, code, details, validationErrors }: ApiErrorInit) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.validationErrors = validationErrors
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}

interface RawErrorPayload {
  status?: number
  statusCode?: number
  error?: string
  message?: string | string[]
  validationErrors?: Record<string, string> | string[] | null
}

async function parseApiError(response: Response): Promise<ApiError> {
  const fallbackMessage = response.statusText || `HTTP ${response.status}`
  let payload: RawErrorPayload | null = null

  try {
    const text = await response.text()
    if (text) {
      payload = JSON.parse(text) as RawErrorPayload
    }
  } catch {
    return new ApiError({
      status: response.status,
      message: fallbackMessage,
    })
  }

  if (!payload || typeof payload !== 'object') {
    return new ApiError({
      status: response.status,
      message: fallbackMessage,
    })
  }

  const rawMessage = payload.message
  const message = Array.isArray(rawMessage)
    ? rawMessage.join('; ')
    : typeof rawMessage === 'string' && rawMessage.length > 0
      ? rawMessage
      : fallbackMessage

  return new ApiError({
    status: payload.status ?? payload.statusCode ?? response.status,
    message,
    code: typeof payload.error === 'string' ? payload.error : undefined,
    details: payload,
    validationErrors: payload.validationErrors ?? (Array.isArray(rawMessage) ? rawMessage : null),
  })
}

export function isRetryableApiError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status >= 500 || error.status === 429
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return false
  }
  return true
}

export function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export type QueryParamPrimitive = string | number | boolean
export type QueryParamValue =
  QueryParamPrimitive | ReadonlyArray<QueryParamPrimitive> | null | undefined

export type ApiQueryParams = Record<string, QueryParamValue>

export interface ApiRequestOptions<TBody = unknown> extends Omit<RequestInit, 'body' | 'method'> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: ApiQueryParams
  body?: TBody
  baseUrl?: string
  idempotencyKey?: string
}

const DEFAULT_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

function buildUrl(path: string, baseUrl: string, params?: ApiQueryParams): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${normalizedBase}${normalizedPath}`

  if (!params) return url

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item))
      }
    } else {
      searchParams.append(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `${url}?${queryString}` : url
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const {
    method = 'GET',
    params,
    body,
    baseUrl = DEFAULT_BASE_URL,
    idempotencyKey,
    headers: customHeaders,
    ...fetchInit
  } = options

  const headers = new Headers(customHeaders)
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }
  if (!headers.has('X-Correlation-Id')) {
    headers.set('X-Correlation-Id', createRequestId())
  }
  if (idempotencyKey) {
    headers.set('Idempotency-Key', idempotencyKey)
  }

  let serializedBody: BodyInit | undefined
  if (body !== undefined) {
    if (body instanceof FormData || typeof body === 'string') {
      serializedBody = body
    } else {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }
      serializedBody = JSON.stringify(body)
    }
  }

  const response = await fetch(buildUrl(path, baseUrl, params), {
    ...fetchInit,
    method,
    headers,
    body: serializedBody,
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  const text = await response.text()
  if (!text) {
    return undefined as TResponse
  }

  try {
    return JSON.parse(text) as TResponse
  } catch {
    throw new ApiError({
      status: response.status,
      message: 'Invalid JSON response from server',
    })
  }
}
