import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer, { type FavoritesState } from './favoritesSlice'

export interface RootState {
  favorites: FavoritesState
}

export function createAppStore(preloadedState?: RootState) {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState,
  })
}

export const store = createAppStore()

export type AppDispatch = typeof store.dispatch
