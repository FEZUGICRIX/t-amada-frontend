import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { router } from './router'

vi.mock('@/pages/my-trips/MyTripsPage', () => ({
  default: () => {
    throw new Error('Ошибка страницы для проверки')
  },
}))

afterEach(() => vi.restoreAllMocks())

describe('Обработка ошибок роутера', () => {
  it('показывает 404 для неизвестного маршрута', async () => {
    const testRouter = createRouter({
      ...router.options,
      history: createMemoryHistory({ initialEntries: ['/unknown-route'] }),
    })
    await testRouter.load()
    render(<RouterProvider router={testRouter} />)
    expect(await screen.findByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })

  it('показывает экран ошибки при сбое страницы', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const testRouter = createRouter({
      ...router.options,
      history: createMemoryHistory({ initialEntries: ['/trips'] }),
    })
    await testRouter.load()
    render(<RouterProvider router={testRouter} />)
    expect(await screen.findByRole('heading', { name: 'Что-то пошло не так' })).toBeInTheDocument()
  })
})
