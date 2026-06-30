import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Book, FavoriteBook } from '../../shared/types/book'

const STORAGE_KEY = 'book-explorer-favorites'

export interface FavoritesState {
  items: FavoriteBook[]
}

interface AddFavoritePayload {
  book: Book
  note?: string
  tags?: string[]
}

interface UpdateFavoritePayload {
  id: string
  note?: string
  tags?: string[]
}

function loadFavorites(): FavoriteBook[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as FavoriteBook[]) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites: FavoriteBook[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

const initialState: FavoritesState = {
  items: loadFavorites(),
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<AddFavoritePayload>) => {
      const { book, note, tags } = action.payload
      if (state.items.some((item) => item.id === book.id)) {
        return
      }
      state.items.push({ ...book, note, tags })
      saveFavorites(state.items)
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((book) => book.id !== action.payload)
      saveFavorites(state.items)
    },
    toggleFavorite: (state, action: PayloadAction<Book>) => {
      const book = action.payload
      const exists = state.items.some((item) => item.id === book.id)
      state.items = exists
        ? state.items.filter((item) => item.id !== book.id)
        : [...state.items, { ...book }]
      saveFavorites(state.items)
    },
    updateFavorite: (state, action: PayloadAction<UpdateFavoritePayload>) => {
      const { id, note, tags } = action.payload
      state.items = state.items.map((book) =>
        book.id === id ? { ...book, note, tags } : book,
      )
      saveFavorites(state.items)
    },
    resetFavorites: (state) => {
      state.items = loadFavorites()
    },
  },
})

export const {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  updateFavorite,
  resetFavorites,
} = favoritesSlice.actions

export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.items

export default favoritesSlice.reducer

