import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { resetFavorites } from '../store/favoritesSlice'
import { store } from '../store/store'
import App from '../App'

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear()
    store.dispatch(resetFavorites())
  })

  it('renders search page by default', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /discover your next read/i })).toBeInTheDocument()
  })

  it('navigates to favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: /favorites/i }))

    expect(screen.getByRole('heading', { name: /no favorites yet/i })).toBeInTheDocument()
  })
})
