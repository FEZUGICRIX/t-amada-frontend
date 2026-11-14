import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DEFAULT_FLIGHT_FILTERS, type FlightFilters } from './flightFilters'
import FlightFiltersPanel from './FlightFiltersPanel'

const airlines = ['Аэрофлот', 'Победа', 'S7 Airlines']

function PanelHarness() {
  const [filters, setFilters] = useState<FlightFilters>({ ...DEFAULT_FLIGHT_FILTERS })
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return <p>Панель закрыта</p>

  return (
    <>
      <FlightFiltersPanel
        anchor={null}
        filters={filters}
        airlines={airlines}
        onChange={setFilters}
        onReset={() => setFilters({ ...DEFAULT_FLIGHT_FILTERS })}
        onClose={() => setIsOpen(false)}
      />
      <output aria-label="Применённые параметры">{JSON.stringify(filters)}</output>
    </>
  )
}

describe('FlightFiltersPanel', () => {
  it('применяет выбранные параметры', () => {
    render(<PanelHarness />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '10000' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '15000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Сначала дешевле' }))
    fireEvent.click(screen.getByRole('button', { name: 'С пересадкой' }))
    fireEvent.click(screen.getByRole('button', { name: 'С багажом' }))
    fireEvent.click(screen.getByRole('button', { name: /Авиакомпании/ }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Аэрофлот' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'S7 Airlines' }))

    expect(screen.getByRole('textbox', { name: 'Цена от' })).toHaveValue('10 000 ₽')
    expect(screen.getByRole('textbox', { name: 'Цена до' })).toHaveValue('15 000 ₽')
    expect(screen.getByLabelText('Применённые параметры')).toHaveTextContent(
      JSON.stringify({
        minPrice: 10000,
        maxPrice: 15000,
        stops: 'with-stops',
        baggage: 'with',
        airlines: ['Аэрофлот', 'S7 Airlines'],
        sort: 'price-asc',
      }),
    )
  })

  it('оставляет только цифры и форматирует сумму в рублях', () => {
    render(<PanelHarness />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '-abc50000руб' },
    })

    expect(screen.getByRole('textbox', { name: 'Цена до' })).toHaveValue('50 000 ₽')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('сбрасывает все параметры', () => {
    render(<PanelHarness />)
    fireEvent.click(screen.getByRole('button', { name: 'Сначала дороже' }))
    fireEvent.click(screen.getByRole('button', { name: 'Прямой' }))
    fireEvent.click(screen.getByRole('button', { name: 'Без багажа' }))
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByRole('button', { name: 'По умолчанию' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Прямой' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Без багажа' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('закрывается по Escape и нажатию на фон', () => {
    const firstRender = render(<PanelHarness />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByText('Панель закрыта')).toBeInTheDocument()

    firstRender.unmount()
    render(<PanelHarness />)
    fireEvent.click(screen.getByTestId('filters-backdrop'))
    expect(screen.getByText('Панель закрыта')).toBeInTheDocument()
  })

  it('удерживает фокус внутри панели', () => {
    render(<PanelHarness />)
    const closeButton = screen.getByRole('button', { name: 'Закрыть фильтры' })
    const applyButton = screen.getByRole('button', { name: 'Сбросить' })

    applyButton.focus()
    fireEvent.keyDown(applyButton, { key: 'Tab' })
    expect(closeButton).toHaveFocus()
  })
})
