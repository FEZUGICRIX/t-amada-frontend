import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TripSearchForm from './TripSearchForm'

describe('TripSearchForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 3))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('предлагает одинаковые города для обоих полей маршрута', () => {
    render(<TripSearchForm />)

    expect(screen.getByRole('combobox', { name: 'Откуда' })).toHaveAttribute('list', 'trip-cities')
    expect(screen.getByRole('combobox', { name: 'Куда' })).toHaveAttribute('list', 'trip-cities')

    const cityList = document.getElementById('trip-cities')
    const cityNames = [...(cityList?.querySelectorAll('option') ?? [])].map(
      (option) => option.value,
    )

    expect(cityNames).toEqual([
      'Екатеринбург',
      'Москва',
      'Санкт-Петербург',
      'Казань',
      'Нижний Новгород',
      'Сочи',
      'Самара',
      'Уфа',
      'Пермь',
      'Челябинск',
    ])
  })

  it('отключает дату возвращения для поездки в одну сторону', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeDisabled()
  })

  it('сохраняет обратную дату при переключении режима', () => {
    render(<TripSearchForm />)

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
    render(<TripSearchForm />)

    expect(screen.getByRole('button', { name: /Когда/ })).toHaveTextContent('Выберите дату')

    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('Выберите дату')
  })

  it('открывает календарь текущего месяца по полю вылета', () => {
    render(<TripSearchForm />)

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
    render(<TripSearchForm />)

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
    render(<TripSearchForm />)

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
    render(<TripSearchForm />)

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
    render(<TripSearchForm />)

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
    render(<TripSearchForm />)

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

  it('запускает поиск при отправке формы', () => {
    const onSearch = vi.fn()

    render(<TripSearchForm onSearch={onSearch} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Найти билеты',
      }),
    )

    expect(onSearch).toHaveBeenCalledOnce()
  })
})
