import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AppHeader from './AppHeader'

describe('AppHeader', () => {
  it('отображает логотип и навигацию', () => {
    render(<AppHeader />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('T-AMAD-A')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Собрать поездку' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    expect(screen.getByRole('link', { name: 'Мои поездки' })).toBeInTheDocument()
  })
})
