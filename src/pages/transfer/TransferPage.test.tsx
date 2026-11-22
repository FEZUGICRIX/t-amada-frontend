import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import TransferPage from './TransferPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

function chooseTime(label: string, value: string) {
  fireEvent.change(screen.getByRole('textbox', { name: label }), { target: { value } })
}

describe('Экран трансфера', () => {
  beforeEach(() => sessionStorage.clear())

  it('учитывает стоимость всех выбранных номеров', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ isOneWay: true, passengers: { adults: 2, children: 1, infants: 0 } }),
    )
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [
          { roomId: 'standard-single', quantity: 2 },
          { roomId: 'standard-double', quantity: 1 },
        ],
      }),
    )
    sessionStorage.setItem(
      'hotel-period',
      JSON.stringify({ start: '2026-12-01', end: '2026-12-03' }),
    )
    render(<TransferPage />)
    const summary = screen.getByLabelText('Ваша поездка')
    expect(summary).toHaveTextContent('280 800 ₽')
    expect(summary).toHaveTextContent('Стандарт одноместный: 43 800 ₽ × 2 × 2 ноч. = 175 200 ₽')
    expect(summary).toHaveTextContent('Стандарт двухместный: 52 800 ₽ × 1 × 2 ноч. = 105 600 ₽')
  })

  it('проверяет ввод времени и сохраняет корректное значение', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ departureDate: '2027-12-01', isOneWay: true }),
    )
    render(<TransferPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    chooseTime('Время поездки в отель', '2460')
    expect(screen.getByRole('textbox', { name: 'Время поездки в отель' })).toHaveValue('24:60')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Укажите корректное время')
    chooseTime('Время поездки в отель', '0835')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('08:35')
  })

  it('устанавливает обратный трансфер на дату вылета за четыре часа и позволяет менять время', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'return-aeroflot-1' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        departureDate: '2027-12-01',
        returnDate: '2027-12-07',
        passengers: { adults: 1, children: 0, infants: 0 },
      }),
    )
    const { unmount } = render(<TransferPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Подача: 7 декабря, 05:15')
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    expect(screen.queryByRole('button', { name: /Дата обратной поездки/ })).not.toBeInTheDocument()
    chooseTime('Время обратной поездки', '06:00')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Подача: 7 декабря, 06:00')
    unmount()
    render(<TransferPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Подача: 7 декабря, 06:00')
  })

  it('учитывает всех пассажиров и сохраняет выбор и направления', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 2, children: 1, infants: 1 } }),
    )
    const { unmount } = render(<TransferPage />)
    const standard = screen.getByRole('article', { name: 'Стандарт' })
    expect(within(standard).getByRole('button', { name: 'Выбрать' })).toBeDisabled()
    fireEvent.click(standard)
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    fireEvent.click(screen.getByRole('article', { name: 'Минивэн' }))
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('3 800 ₽')
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('В аэропорт: 1 900 ₽')
    unmount()
    render(<TransferPage />)
    expect(
      within(screen.getByRole('article', { name: 'Минивэн' })).getByRole('button', {
        name: 'Выбрано',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Из аэропорта и обратно' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Пропустить этап' }))
    expect(sessionStorage.getItem('selected-transfer')).toBeNull()
  })

  it('сбрасывает выбор при увеличении числа пассажиров и показывает пустое состояние', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 2, children: 0, infants: 0 } }),
    )
    const { unmount } = render(<TransferPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Стандарт' }))
    unmount()
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 6, children: 1, infants: 0 } }),
    )
    render(<TransferPage />)
    expect(sessionStorage.getItem('selected-transfer')).toBeNull()
    expect(screen.getByText('Нет автомобиля для такого количества пассажиров.')).toBeInTheDocument()
    expect(screen.getByText(/Выбор трансфера сброшен/)).toBeInTheDocument()
  })

  it('сохраняет время подачи, восстанавливает его и отменяет изменения', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ departureDate: '2027-12-01', isOneWay: true }),
    )
    const { unmount } = render(<TransferPage />)
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent(
      'Сочи, улица Черноморская, 4',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Укажите дату и время')
    chooseTime('Время поездки в отель', '15:30')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('15:30')
    unmount()
    render(<TransferPage />)
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('15:30')
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    chooseTime('Время поездки в отель', '16:30')
    fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('15:30')
  })

  it('требует дату обратной поездки и не принимает время раньше прибытия', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        departureDate: '2027-12-01',
        isOneWay: true,
        passengers: { adults: 1, children: 0 },
      }),
    )
    render(<TransferPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    chooseTime('Время поездки в отель', '13:00')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('не может быть раньше прилёта')
    chooseTime('Время поездки в отель', '15:00')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Укажите дату и время')
  })

  it('не подставляет выдуманные отель и даты при отсутствии поездки', () => {
    render(<TransferPage />)
    expect(screen.getByRole('heading', { name: 'Выберите трансфер' })).toBeInTheDocument()
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Отель не выбран')
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Дата не выбрана')
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Назад' })).toHaveAttribute('href', '/insurance')
  })

  it('показывает выбранный отель, аэропорт и даты рейсов', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'pullman', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'aeroflot-return' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        departureDate: '2026-12-01',
        returnDate: '2026-12-07',
        passengers: { adults: 2, children: 0, infants: 0 },
      }),
    )
    render(<TransferPage />)
    const route = screen.getByLabelText('Маршрут трансфера')
    expect(route).toHaveTextContent('Аэропорт Сочи, AER → Pullman Sochi Centre')
    expect(route).toHaveTextContent('Подача: 1 декабря, 16:05')
    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }))
    expect(screen.getByRole('textbox', { name: 'Время поездки в отель' })).toHaveValue('16:05')
    expect(screen.queryByRole('button', { name: /Дата поездки в отель/ })).not.toBeInTheDocument()
    chooseTime('Время поездки в отель', '17:30')
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))
    expect(route).toHaveTextContent('Подача: 1 декабря, 17:30')
    expect(route).not.toHaveTextContent('Обратный вылет')
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(route).toHaveTextContent('Pullman Sochi Centre → Аэропорт Сочи, AER')
    expect(route).toHaveTextContent('Подача: 7 декабря')
  })

  it('переключает тариф по карточке и кнопке и показывает цену за поездку', () => {
    render(<TransferPage />)
    const standard = screen.getByRole('article', { name: 'Стандарт' })
    fireEvent.click(standard)
    expect(within(standard).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(standard).getByText('1 200 ₽')).toBeInTheDocument()
    expect(within(standard).getByText('за поездку')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(standard).toHaveTextContent('2 400 ₽ туда и обратно')
    const minivan = screen.getByRole('article', { name: 'Минивэн' })
    fireEvent.click(within(minivan).getByRole('button', { name: 'Выбрать' }))
    expect(within(standard).getByRole('button', { name: 'Выбрать' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(minivan).toHaveTextContent('3 800 ₽ туда и обратно')
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Пропустить этап' }))
    expect(within(minivan).getByRole('button', { name: 'Выбрать' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  })
})
