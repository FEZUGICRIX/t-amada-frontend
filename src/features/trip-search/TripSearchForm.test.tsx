import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TripSearchForm from './TripSearchForm'

const MOCK_CITIES = [
  { name: 'Москва', country: 'Россия' },
  { name: 'Екатеринбург', country: 'Россия' },
  { name: 'Санкт-Петербург', country: 'Россия' },
  { name: 'Сочи', country: 'Россия' },
]

function renderWithQuery(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('TripSearchForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-03T09:00:00Z'))
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      const search = new URL(url, 'http://localhost').searchParams.get('query')?.toLowerCase() ?? ''
      const filtered = search
        ? MOCK_CITIES.filter(
            (city) =>
              city.name.toLowerCase().includes(search) ||
              (search === 'питер' && city.name === 'Санкт-Петербург'),
          )
        : MOCK_CITIES
      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('показывает подсказки городов из API и выбирает город из выпадающего списка', async () => {
    renderWithQuery(<TripSearchForm />)

    const originInput = screen.getByRole('combobox', { name: 'Откуда' })
    fireEvent.focus(originInput)

    await waitFor(() => {
      const listbox = screen.getByRole('listbox', { name: 'Подсказки: Откуда' })
      expect(within(listbox).getAllByRole('option')).toHaveLength(4)
    })

    fireEvent.change(originInput, { target: { value: 'питер' } })

    await waitFor(() => {
      const listbox = screen.getByRole('listbox', { name: 'Подсказки: Откуда' })
      expect(within(listbox).getByRole('option', { name: /Санкт-Петербург/ })).toBeInTheDocument()
    })

    fireEvent.mouseDown(
      screen.getByRole('option', { name: /Санкт-Петербург/ }).querySelector('button')!,
    )
    expect(originInput).toHaveValue('Санкт-Петербург')
    expect(screen.queryByRole('listbox', { name: 'Подсказки: Откуда' })).not.toBeInTheDocument()

    // Re-opening via typing after Escape preserves the typed query
    fireEvent.focus(originInput)
    fireEvent.keyDown(originInput, { key: 'Escape' })
    expect(screen.queryByRole('listbox', { name: 'Подсказки: Откуда' })).not.toBeInTheDocument()

    fireEvent.change(originInput, { target: { value: 'Соч' } })
    await waitFor(() => {
      const listbox = screen.getByRole('listbox', { name: 'Подсказки: Откуда' })
      expect(within(listbox).getAllByRole('option')).toHaveLength(1)
      expect(within(listbox).getByRole('option', { name: /Сочи/ })).toBeInTheDocument()
    })
  })

  it('отключает дату возвращения для поездки в одну сторону', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeDisabled()
  })

  it('сохраняет обратную дату при переключении режима', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))
    fireEvent.click(screen.getByRole('button', { name: '5 ноября 2026' }))
    fireEvent.click(screen.getByRole('button', { name: '8 ноября 2026' }))

    const oneWayCheckbox = screen.getByRole('checkbox', {
      name: 'Билет в одну сторону',
    })

    fireEvent.click(oneWayCheckbox)

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('8 ноября')

    fireEvent.click(oneWayCheckbox)

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('8 ноября')
  })

  it('изначально показывает пустые поля дат', () => {
    renderWithQuery(<TripSearchForm />)

    expect(screen.getByRole('button', { name: /Когда/ })).toHaveTextContent('Выберите дату')

    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('Выберите дату')
  })

  it('открывает календарь текущего месяца по полю вылета', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))

    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()

    expect(screen.getByText('Ноябрь')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: '3 ноября 2026',
      }),
    ).toHaveAttribute('aria-current', 'date')
  })

  it('не закрывает календарь после выбора диапазона', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))
    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(screen.getByRole('button', { name: /Когда/ })).toHaveTextContent('5 ноября')
    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: '8 ноября 2026',
      }),
    )

    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('8 ноября')
    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()
  })

  it('не закрывает календарь после выбора даты в одну сторону', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))
    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()
  })
  it('открывает выбор пассажиров и закрывает календарь', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))

    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /Пассажиры и класс/,
      }),
    )

    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).not.toBeInTheDocument()

    expect(
      screen.getByRole('dialog', {
        name: 'Выбор пассажиров и класса',
      }),
    ).toBeInTheDocument()
  })
  it('обновляет количество пассажиров', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Пассажиры и класс/,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Увеличить количество взрослых',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: /3 пассажира, эконом/,
      }),
    ).toBeInTheDocument()
  })
  it('обновляет класс обслуживания', () => {
    renderWithQuery(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Пассажиры и класс/,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Бизнес',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: /2 пассажира, бизнес/,
      }),
    ).toBeInTheDocument()
  })

  it('требует даты и запускает поиск после их выбора', () => {
    const onSearch = vi.fn()

    renderWithQuery(<TripSearchForm onSearch={onSearch} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Найти билеты',
      }),
    )
    expect(onSearch).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Выберите даты вылета и возвращения')
    const today = within(screen.getByRole('dialog', { name: 'Выбор даты' })).getByRole('button', {
      current: 'date',
    })
    fireEvent.click(today)
    fireEvent.click(today)
    fireEvent.click(screen.getByRole('button', { name: 'Найти билеты' }))
    expect(onSearch).toHaveBeenCalledOnce()
  })
})
