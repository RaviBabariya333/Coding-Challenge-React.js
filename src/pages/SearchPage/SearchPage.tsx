import { useCallback, useState } from 'react'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material'
import type { Book, SearchFormValues } from '../../types/book'
import { isApiKeyConfigured, searchBooks } from '../../api/booksApi'
import SearchForm from '../../components/SearchForm/SearchForm'
import BookGrid from '../../components/BookGrid/BookGrid'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './SearchPage.scss'

function hasSearchValue(values: SearchFormValues) {
  return Object.values(values).some((value) => value.trim().length > 0)
}

export default function SearchPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [lastQuery, setLastQuery] = useState<SearchFormValues | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const resetSearchResults = useCallback(() => {
    setBooks([])
    setError('')
    setHasSearched(false)
    setLastQuery(null)
    setStartIndex(0)
    setTotalItems(0)
  }, [])

  const handleValuesChange = useCallback((values: SearchFormValues) => {
    if (!hasSearchValue(values)) {
      resetSearchResults()
    }
  }, [resetSearchResults])

  const handleSearch = useCallback(async (values: SearchFormValues, loadMore = false) => {
    setIsLoading(true)
    setError('')

    const index = loadMore ? startIndex + 20 : 0

    try {
      const response = await searchBooks(values, index)
      const results = response.items ?? []

      setBooks((prev) => (loadMore ? [...prev, ...results] : results))
      setTotalItems(response.totalItems ?? 0)
      setStartIndex(index)
      setLastQuery(values)
      setHasSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      if (!loadMore) {
        setBooks([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [startIndex])

  const canLoadMore = books.length < totalItems

  return (
    <Box className="search-page">
      {!isApiKeyConfigured() && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>API key recommended</AlertTitle>
          Google Books limits anonymous requests and returns 429 errors quickly. Copy{' '}
          <code>.env.example</code> to <code>.env</code>, add a free API key, then restart{' '}
          <code>npm run dev</code>.
        </Alert>
      )}

      <SearchForm
        onSearch={(values) => handleSearch(values)}
        onValuesChange={handleValuesChange}
        isLoading={isLoading && !hasSearched}
      />

      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading && !hasSearched && <LoadingSpinner label="Searching for books" />}

      {hasSearched && (
        <Box className="search-page__results">
          <Typography variant="h6" component="h2" className="search-page__results-heading">
            {books.length > 0
              ? `Found ${totalItems.toLocaleString()} book${totalItems === 1 ? '' : 's'}`
              : 'Search Results'}
          </Typography>

          <BookGrid
            books={books}
            emptyMessage="No books matched your search. Try different keywords."
          />

          {canLoadMore && (
            <Box className="search-page__load-more">
              <Button
                variant="outlined"
                onClick={() => lastQuery && handleSearch(lastQuery, true)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
