import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import InsurancePage from './InsurancePage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Страница страховки', () => {
  beforeEach(() => sessionStorage.clear())
  it('показывает заголовок и варианты', () => {
    render(<InsurancePage />)
    expect(screen.getByRole('heading', { name: 'Выберите страховку' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Базовая защита' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Расширенная защита' })).toBeInTheDocument()
  })
  it('учитывает выбранный номер и перелёт', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ isOneWay: true, passengers: { adults: 2, children: 0 } }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    render(<InsurancePage />)
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('68 680 ₽')
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('Отель')
    expect(screen.getByLabelText('Ваша поездка')).not.toHaveTextContent('Sea Galaxy')
  })
  it('выбирает, меняет и пропускает страховку', () => {
    const { unmount } = render(<InsurancePage />)
    const basic = screen.getByRole('article', { name: 'Базовая защита' })
    fireEvent.click(within(basic).getByRole('button', { name: 'Выбрать' }))
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('1 490 ₽')
    const extended = screen.getByRole('article', { name: 'Расширенная защита' })
    fireEvent.click(within(extended).getByRole('button', { name: 'Выбрать' }))
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('2 990 ₽')
    unmount()
    render(<InsurancePage />)
    expect(
      within(screen.getByRole('article', { name: 'Расширенная защита' })).getByRole('button', {
        name: 'Выбрано',
      }),
    ).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Пропустить этап' }))
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('0 ₽')
    expect(sessionStorage.getItem('selected-insurance')).toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent('Следующий этап пока недоступен')
  })
  it('выбирает страховку нажатием на карточку', () => {
    render(<InsurancePage />)
    const card = screen.getByRole('article', { name: 'Расширенная защита' })
    fireEvent.click(card)
    expect(within(card).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('2 990 ₽')
  })
  it('открывает описание без выбора и позволяет выбрать страховку в окне', () => {
    render(<InsurancePage />)
    const card = screen.getByRole('article', { name: 'Базовая защита' })
    const details = within(card).getByRole('button', { name: 'Подробнее о покрытии' })
    details.focus()
    fireEvent.click(details)
    const dialog = screen.getByRole('dialog', { name: 'Базовая защита' })
    expect(within(card).getByRole('button', { name: 'Выбрать' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(dialog).toHaveTextContent('3 000 000 ₽')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Выбрать за 1 490 ₽' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(within(card).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(details).toHaveFocus()
  })
  it('закрывает описание по Escape и нажатию на фон', () => {
    render(<InsurancePage />)
    const details = within(screen.getByRole('article', { name: 'Базовая защита' })).getByRole(
      'button',
      { name: 'Подробнее о покрытии' },
    )
    fireEvent.click(details)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(details)
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog.parentElement!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('показывает пассажиров, даты выбранных рейсов и страну в описании', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        destination: 'Сочи',
        departureDate: '2026-10-12',
        returnDate: '2026-10-18',
        isOneWay: false,
        passengers: { adults: 2, children: 1, infants: 0 },
      }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'aeroflot-return' }),
    )
    render(<InsurancePage />)
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Базовая защита' })).getByRole('button', {
        name: 'Подробнее о покрытии',
      }),
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Для 2 взрослых, 1 ребёнка · 12 октября - 18 октября · Россия')
    expect(dialog).toHaveTextContent('Багаж до 40 000 ₽')
    expect(dialog).toHaveTextContent('Не покрываются хронические заболевания')
  })
  it('не выдаёт даты билета в одну сторону за период страховки', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        destination: 'Сочи',
        departureDate: '2026-10-12',
        isOneWay: true,
        passengers: { adults: 1, children: 0, infants: 0 },
      }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
    render(<InsurancePage />)
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Базовая защита' })).getByRole('button', {
        name: 'Подробнее о покрытии',
      }),
    )
    expect(screen.getByRole('dialog')).toHaveTextContent('Даты страховки не выбраны')
  })
})
