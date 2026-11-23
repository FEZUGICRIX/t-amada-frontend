import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import PassengerDetailsPage from './PassengerDetailsPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Данные пассажиров', () => {
  beforeEach(() => sessionStorage.clear())
  it('показывает пустые поля для каждого пассажира и контакты покупателя', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 2, children: 1, infants: 1 } }),
    )
    render(<PassengerDetailsPage />)
    expect(screen.getByRole('heading', { name: 'Данные пассажиров' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Пассажир 1 · взрослый' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Пассажир 2 · взрослый' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Пассажир 3 · ребёнок' })).toBeInTheDocument()
    const infant = screen.getByRole('group', { name: 'Пассажир 4 · младенец' })
    expect(within(infant).getByLabelText('Фамилия')).toHaveValue('')
    fireEvent.change(within(infant).getByLabelText('Фамилия'), { target: { value: 'Иванов' } })
    expect(within(infant).getByLabelText('Фамилия')).toHaveValue('Иванов')
    expect(
      within(screen.getByRole('group', { name: 'Пассажир 1 · взрослый' })).getByLabelText(
        'Фамилия',
      ),
    ).toHaveValue('')
    expect(screen.getByLabelText('Телефон')).toHaveValue('')
    expect(screen.getByLabelText('Электронная почта')).toHaveValue('')
    expect(screen.getByRole('link', { name: 'Назад' })).toHaveAttribute('href', '/insurance')
  })
  it('показывает всех десятерых пассажиров, выбранных на первом экране', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 10, children: 0, infants: 0 } }),
    )
    render(<PassengerDetailsPage />)
    expect(screen.getByRole('group', { name: 'Пассажир 10 · взрослый' })).toBeInTheDocument()
  })
  it('возвращает к трансферу и проверяет незаполненные поля', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [{ roomId: 'standard-double', quantity: 1 }],
      }),
    )
    render(<PassengerDetailsPage />)
    expect(screen.getByRole('link', { name: 'Назад' })).toHaveAttribute('href', '/transfer')
    fireEvent.click(screen.getByRole('button', { name: 'Перейти к проверке' }))
    expect(screen.getByText('Укажите фамилию')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
  it('сохраняет данные при повторном открытии и после заполнения показывает следующий этап', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ departureDate: '2026-12-20', passengers: { adults: 1 } }),
    )
    const view = render(<PassengerDetailsPage />)
    for (const [label, value] of [
      ['Фамилия', 'Иванов'],
      ['Имя', 'Иван'],
      ['Дата рождения', '12.01.1998'],
      ['Серия и номер', '45 08 123456'],
      ['Телефон', '+7 900 123-45-67'],
      ['Электронная почта', 'ivan@example.ru'],
    ]) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
    view.unmount()
    render(<PassengerDetailsPage />)
    expect(screen.getByLabelText('Фамилия')).toHaveValue('Иванов')
    expect(screen.getByLabelText('Телефон')).toHaveValue('+7 900 123-45-67')
    fireEvent.click(screen.getByRole('button', { name: 'Перейти к проверке' }))
    expect(screen.getByRole('status')).toHaveTextContent('Следующий этап пока недоступен')
  })
  it('проверяет возраст на дату вылета и формат документа', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ departureDate: '2026-12-20', passengers: { adults: 1, children: 1 } }),
    )
    render(<PassengerDetailsPage />)
    const child = screen.getByRole('group', { name: 'Пассажир 2 · ребёнок' })
    fireEvent.change(within(child).getByLabelText('Дата рождения'), {
      target: { value: '21.12.2024' },
    })
    fireEvent.change(within(child).getByLabelText('Серия и номер'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Перейти к проверке' }))
    expect(
      within(child).getByText('Возраст на дату вылета не соответствует категории пассажира'),
    ).toBeInTheDocument()
    expect(
      within(child).getByText('Введите серию и номер, например II-АБ 123456'),
    ).toBeInTheDocument()
  })
  it('форматирует дату и телефон при вводе и убирает пробелы по краям почты', () => {
    render(<PassengerDetailsPage />)
    fireEvent.change(screen.getByLabelText('Дата рождения'), { target: { value: '07022007' } })
    expect(screen.getByLabelText('Дата рождения')).toHaveValue('07.02.2007')
    fireEvent.change(screen.getByLabelText('Телефон'), { target: { value: '89122110927' } })
    expect(screen.getByLabelText('Телефон')).toHaveValue('+7 912 211-09-27')
    fireEvent.change(screen.getByLabelText('Электронная почта'), {
      target: { value: ' test@example.ru ' },
    })
    fireEvent.blur(screen.getByLabelText('Электронная почта'))
    expect(screen.getByLabelText('Электронная почта')).toHaveValue('test@example.ru')
  })
  it('меняет гражданство и документ, сохраняя выбор при повторном открытии', () => {
    const view = render(<PassengerDetailsPage />)
    fireEvent.click(screen.getByLabelText('Гражданство: Россия'))
    fireEvent.click(screen.getByRole('button', { name: 'Другое' }))
    expect(screen.getByLabelText('Документ: Иностранный документ')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Серия и номер'), { target: { value: 'AB12345' } })
    view.unmount()
    render(<PassengerDetailsPage />)
    expect(screen.getByLabelText('Гражданство: Другое')).toBeInTheDocument()
    expect(screen.getByLabelText('Серия и номер')).toHaveValue('AB12345')
    fireEvent.click(screen.getByLabelText('Гражданство: Другое'))
    fireEvent.click(screen.getByRole('button', { name: 'Россия' }))
    expect(screen.getByLabelText('Документ: Паспорт РФ')).toBeInTheDocument()
    expect(screen.getByLabelText('Серия и номер')).toHaveValue('')
    fireEvent.click(screen.getByLabelText('Документ: Паспорт РФ'))
    fireEvent.click(screen.getByRole('button', { name: 'Свидетельство о рождении РФ' }))
    expect(screen.getByLabelText('Документ: Свидетельство о рождении РФ')).toBeInTheDocument()
  })
})
