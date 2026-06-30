import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from './store/store'
import { theme } from './theme/theme'
import Layout from './components/Layout/Layout'
import SearchPage from './pages/SearchPage/SearchPage'
import FavoritesPage from './pages/FavoritesPage/FavoritesPage'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'

const BookDetailsPage = lazy(() => import('./pages/BookDetailsPage/BookDetailsPage'))

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<SearchPage />} />
              <Route
                path="book/:id"
                element={
                  <Suspense fallback={<LoadingSpinner label="Loading book details" />}>
                    <BookDetailsPage />
                  </Suspense>
                }
              />
              <Route path="favorites" element={<FavoritesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}
