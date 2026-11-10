import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FlightSelectionPage from './FlightSelectionPage'

describe('FlightSelectionPage', () => {
  it('renders the page heading', () => {
    render(<FlightSelectionPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс туда',
      }),
    ).toBeInTheDocument()
  })

  it('renders the trip summary', () => {
    render(<FlightSelectionPage />)

    expect(screen.getByText('Москва → Сочи · 12 октября · 2 взрослых · эконом')).toBeInTheDocument()
  })
  it('renders the available flights', () => {
    render(<FlightSelectionPage />)

    expect(screen.getByText('6 рейсов')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)

    expect(screen.getByText('Аэрофлот')).toBeInTheDocument()
    expect(screen.getByText('Победа')).toBeInTheDocument()
    expect(screen.getByText('Россия + Аэрофлот')).toBeInTheDocument()
  })

  it('renders the trip price summary', () => {
    render(<FlightSelectionPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Ваша поездка',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Итого')).toBeInTheDocument()
    expect(screen.getAllByText('25 230 ₽')).toHaveLength(2)
  })

  it('updates the total after selecting another flight', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(screen.getAllByText('22 630 ₽')).toHaveLength(2)
  })

  it('selects a flight from the list', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(within(pobedaCard).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('shows return flights after continuing', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс обратно',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Сочи → Москва')).toBeInTheDocument()
  })

  it('keeps draft filters after closing and reopening the panel', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '12000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))
    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))

    expect(screen.getByRole('textbox', { name: 'Цена от' })).toHaveValue('12 000 ₽')
  })

  it('closes filters with Escape and returns focus to the trigger', () => {
    render(<FlightSelectionPage />)

    const filtersButton = screen.getByRole('button', { name: /Фильтры и сортировка/ })

    filtersButton.focus()
    fireEvent.click(filtersButton)
    expect(screen.getByRole('button', { name: 'Закрыть фильтры' })).toHaveFocus()

    fireEvent.keyDown(screen.getByLabelText('Фильтры и сортировка'), { key: 'Escape' })

    expect(screen.queryByLabelText('Фильтры и сортировка')).not.toBeInTheDocument()
    expect(filtersButton).toHaveFocus()
  })

  it('applies filters and updates the result count', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Прямой' }))
    fireEvent.click(screen.getByRole('button', { name: 'Показать результаты' }))

    expect(screen.getByRole('heading', { name: '4 рейса' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Фильтры и сортировка')).not.toBeInTheDocument()
  })

  it('sorts the visible flights by price', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Сначала дешевле' }))
    fireEvent.click(screen.getByRole('button', { name: 'Показать результаты' }))

    expect(screen.getAllByRole('article')[0]).toHaveAccessibleName('Рейс Победа')
  })

  it('resets applied filters and restores every flight', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'С пересадкой' }))
    fireEvent.click(screen.getByRole('button', { name: 'Показать результаты' }))
    expect(screen.getByRole('heading', { name: '2 рейса' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByRole('heading', { name: '6 рейсов' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'С пересадкой' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('shows an empty state when no flight matches', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '40000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Показать результаты' }))

    expect(screen.getByRole('heading', { name: '0 рейсов' })).toBeInTheDocument()
    expect(screen.getByText('Рейсы не найдены')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  })

  it('clears a selected flight when filters hide it', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '10000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Показать результаты' }))

    expect(screen.getByRole('article', { name: 'Рейс Победа' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Выбрано' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getAllByText('12 790 ₽')).toHaveLength(2)
  })
})
