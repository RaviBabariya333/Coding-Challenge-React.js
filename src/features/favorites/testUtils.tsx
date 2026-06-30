import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { render, type RenderOptions } from '@testing-library/react'
import { createAppStore, type RootState } from '../../app/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: RootState
  store?: ReturnType<typeof createAppStore>
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createAppStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) }
}

