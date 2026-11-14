import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import FlightSelectionPage from './FlightSelectionPage'
import TripSearchForm from '@/features/trip-search/TripSearchForm'

describe('FlightSelectionPage', () => {
  beforeEach(() => sessionStorage.clear())
  it('показывает цену за билет и рассчитывает итог для взрослых и детей без оплаты младенцев', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-12-01',
        returnDate: null,
        isOneWay: true,
        passengers: { adults: 3, children: 2, infants: 1, travelClass: 'economy' },
      }),
    )
    render(<FlightSelectionPage />)
    const flight = screen.getByRole('article', { name: 'Рейс Аэрофлот' })
    expect(within(flight).getByText('12 440 ₽')).toBeInTheDocument()
    expect(within(flight).getByText('За 1 билет')).toBeInTheDocument()
    fireEvent.click(flight)
    expect(screen.getAllByText('62 200 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '12000' },
    })
    expect(screen.queryByRole('article', { name: 'Рейс Аэрофлот' })).not.toBeInTheDocument()
  })
  it('показывает рейсы выбранного класса в обоих направлениях', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-12-01',
        returnDate: '2026-12-07',
        isOneWay: false,
        passengers: { adults: 2, children: 0, infants: 0, travelClass: 'business' },
      }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'return-aeroflot-1' }),
    )
    render(<FlightSelectionPage />)
    expect(screen.getByRole('heading', { name: '1 рейс' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Рейс S7 Airlines' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Рейс Аэрофлот' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getAllByText('0 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс S7 Airlines' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('heading', { name: 'Выберите рейс обратно' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Рейс S7 Airlines' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Рейс Аэрофлот' })).not.toBeInTheDocument()
  })
  it('передаёт параметры поездки в одну сторону на страницу рейсов', () => {
    const { unmount } = render(
      <TripSearchForm
        onSearch={(search) => sessionStorage.setItem('trip-search', JSON.stringify(search))}
      />,
    )
    fireEvent.change(screen.getByRole('combobox', { name: 'Куда' }), { target: { value: 'Сочи' } })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Билет в одну сторону' }))
    fireEvent.click(screen.getByRole('button', { name: 'Найти билеты' }))
    unmount()
    render(<FlightSelectionPage />)
    expect(screen.getByText(/Москва → Сочи · Дата не выбрана/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Рейсы выбраны')
  })
  it('отображает заголовок страницы', () => {
    render(<FlightSelectionPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс туда',
      }),
    ).toBeInTheDocument()
  })

  it('отображает параметры поездки', () => {
    render(<FlightSelectionPage />)

    expect(screen.getByText('Москва → Сочи · 12 октября · 2 взрослых · эконом')).toBeInTheDocument()
  })
  it('отображает доступные рейсы', () => {
    render(<FlightSelectionPage />)

    expect(screen.getByText('6 рейсов')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)

    expect(screen.getByText('Аэрофлот')).toBeInTheDocument()
    expect(screen.getByText('Победа')).toBeInTheDocument()
    expect(screen.getByText('Россия + Аэрофлот')).toBeInTheDocument()
  })

  it('отображает итоговую стоимость поездки', () => {
    render(<FlightSelectionPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Ваша поездка',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Итого')).toBeInTheDocument()
    expect(screen.getAllByText('0 ₽')).toHaveLength(2)
  })

  it('обновляет итог при выборе другого рейса', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(screen.getAllByText('9 840 ₽').length).toBeGreaterThanOrEqual(2)
  })

  it('выбирает рейс из списка', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(within(pobedaCard).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('показывает обратные рейсы после продолжения', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс обратно',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Сочи → Москва')).toBeInTheDocument()
  })

  it('сохраняет фильтры при закрытии и открытии панели', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '12000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))
    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))

    expect(screen.getByRole('textbox', { name: 'Цена от' })).toHaveValue('12 000 ₽')
  })

  it('закрывает фильтры по Escape и возвращает фокус на кнопку', () => {
    render(<FlightSelectionPage />)

    const filtersButton = screen.getByRole('button', { name: /Фильтры и сортировка/ })

    filtersButton.focus()
    fireEvent.click(filtersButton)
    expect(screen.getByRole('button', { name: 'Закрыть фильтры' })).toHaveFocus()

    fireEvent.keyDown(screen.getByLabelText('Фильтры и сортировка'), { key: 'Escape' })

    expect(screen.queryByLabelText('Фильтры и сортировка')).not.toBeInTheDocument()
    expect(filtersButton).toHaveFocus()
  })

  it('применяет фильтры и обновляет количество результатов', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Прямой' }))
    expect(screen.getByRole('heading', { name: '4 рейса' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Фильтры и сортировка' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getByRole('heading', { name: '4 рейса' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Фильтры и сортировка')).not.toBeInTheDocument()
  })

  it('сортирует рейсы по цене', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Сначала дешевле' }))
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getAllByRole('article')[0]).toHaveAccessibleName('Рейс Победа')
  })

  it('сбрасывает фильтры и восстанавливает список рейсов', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'С пересадкой' }))
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))
    expect(screen.getByRole('heading', { name: '2 рейса' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByRole('heading', { name: '6 рейсов' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'С пересадкой' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('показывает пустое состояние, если рейсы не найдены', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '40000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getByRole('heading', { name: '0 рейсов' })).toBeInTheDocument()
    expect(screen.getByText('Рейсы не найдены')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
    expect(screen.getByRole('heading', { name: '6 рейсов' })).toBeInTheDocument()
  })

  it('показывает выбранные рейсы туда и обратно в блоке поездки', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-10-12',
        returnDate: '2026-10-18',
        isOneWay: false,
        passengers: { adults: 2, children: 0, infants: 0, travelClass: 'economy' },
      }),
    )
    render(<FlightSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Победа' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    const summary = screen.getByLabelText('Выбранные рейсы')
    expect(within(summary).getByText('12 октября 2026 г.')).toBeInTheDocument()
    expect(within(summary).getByText('18 октября 2026 г.')).toBeInTheDocument()
    expect(within(summary).getByText(/Победа · 12:45 - 16:25/)).toBeInTheDocument()
    expect(within(summary).getByText(/Аэрофлот · 09:15 - 13:05/)).toBeInTheDocument()
    expect(screen.getAllByText('45 260 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Рейсы выбраны')
  })

  it('сохраняет выбранный рейс, скрытый фильтрами', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '10000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getByRole('article', { name: 'Рейс Победа' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Выбрано' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getAllByText('12 440 ₽')).toHaveLength(2)
  })

  it('пропускает обратный рейс и его стоимость для поездки в одну сторону', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-11-20',
        returnDate: null,
        isOneWay: true,
        passengers: { adults: 2, children: 0, infants: 0, travelClass: 'economy' },
      }),
    )
    render(<FlightSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    expect(screen.getAllByText('24 880 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('heading', { name: 'Выберите рейс туда' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Рейсы выбраны')
    sessionStorage.removeItem('trip-search')
  })

  it('возвращает к выбранному рейсу туда', () => {
    render(<FlightSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Победа' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
    expect(
      within(screen.getByRole('article', { name: 'Рейс Победа' })).getByRole('button', {
        name: 'Выбрано',
      }),
    ).toBeInTheDocument()
  })
})
