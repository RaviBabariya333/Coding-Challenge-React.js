import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Book } from '../types/book'
import { resetFavorites } from './favoritesSlice'
import { useFavorites } from './useFavorites'
import { renderWithProviders } from './testUtils'

const mockBook: Book = {
  id: 'test-book-1',
  volumeInfo: {
    title: 'Test Book',
    authors: ['Test Author'],
    description: 'A test book description.',
  },
}

function FavoritesTestHarness() {
  const { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite } =
    useFavorites()

  return (
    <div>
      <p data-testid="count">{favorites.length}</p>
      <p data-testid="is-favorite">{isFavorite(mockBook.id) ? 'yes' : 'no'}</p>
      <button type="button" onClick={() => addFavorite(mockBook)}>
        Add
      </button>
      <button type="button" onClick={() => removeFavorite(mockBook.id)}>
        Remove
      </button>
      <button type="button" onClick={() => toggleFavorite(mockBook)}>
        Toggle
      </button>
    </div>
  )
}

describe('favorites Redux slice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds and removes favorites', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<FavoritesTestHarness />)
    store.dispatch(resetFavorites())

    expect(screen.getByTestId('count')).toHaveTextContent('0')

    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-favorite')).toHaveTextContent('yes')

    await user.click(screen.getByRole('button', { name: /remove/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-favorite')).toHaveTextContent('no')
  })

  it('toggles favorite state', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<FavoritesTestHarness />)
    store.dispatch(resetFavorites())

    await user.click(screen.getByRole('button', { name: /toggle/i }))
    expect(screen.getByTestId('is-favorite')).toHaveTextContent('yes')

    await user.click(screen.getByRole('button', { name: /toggle/i }))
    expect(screen.getByTestId('is-favorite')).toHaveTextContent('no')
  })
})
