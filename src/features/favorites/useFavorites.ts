import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Book } from '../../shared/types/book'
import type { AppDispatch, RootState } from '../../app/store'
import {
  selectFavorites,
  addFavorite as addFavoriteAction,
  removeFavorite as removeFavoriteAction,
  toggleFavorite as toggleFavoriteAction,
  updateFavorite as updateFavoriteAction,
} from './favoritesSlice'

export function useFavorites() {
  const dispatch = useDispatch<AppDispatch>()
  const favorites = useSelector((state: RootState) => selectFavorites(state))

  const isFavorite = useCallback(
    (id: string) => favorites.some((book) => book.id === id),
    [favorites],
  )

  return {
    favorites,
    isFavorite,
    addFavorite: (book: Book, note?: string, tags?: string[]) =>
      dispatch(addFavoriteAction({ book, note, tags })),
    removeFavorite: (id: string) => dispatch(removeFavoriteAction(id)),
    toggleFavorite: (book: Book) => dispatch(toggleFavoriteAction(book)),
    updateFavorite: (id: string, note?: string, tags?: string[]) =>
      dispatch(updateFavoriteAction({ id, note, tags })),
  }
}

