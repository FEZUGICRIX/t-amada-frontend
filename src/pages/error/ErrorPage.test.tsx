import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ErrorPage from './ErrorPage'

describe('Страницы ошибок', () => {
  it('показывает страницу для неизвестного адреса', () => {
    render(<ErrorPage kind="notFound" />)
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
  })
  it('показывает вариант для неожиданной ошибки', () => {
    render(<ErrorPage kind="error" />)
    expect(screen.getByRole('heading', { name: 'Что-то пошло не так' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Попробовать снова' })).toBeInTheDocument()
  })
})
