import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { Book } from '../../types/book'
import { getBookById, getThumbnailUrl } from '../../api/booksApi'
import { useFavorites } from '../../store/useFavorites'
import FavoriteButton from '../../components/FavoriteButton'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './BookDetailsPage.scss'

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { isFavorite, updateFavorite, favorites } = useFavorites()

  const favoriteEntry = favorites.find((item) => item.id === id)
  const [note, setNote] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (!id) {
      setError('Invalid book ID.')
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchBook() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getBookById(id!)
        if (!cancelled) {
          setBook(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load book.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchBook()

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (favoriteEntry) {
      setNote(favoriteEntry.note ?? '')
      setTagsInput(favoriteEntry.tags?.join(', ') ?? '')
    }
  }, [favoriteEntry])

  if (isLoading) {
    return <LoadingSpinner label="Loading book details" />
  }

  if (error || !book) {
    return (
      <Box className="book-details">
        <Alert severity="error" role="alert">
          {error || 'Book not found.'}
        </Alert>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to Search
        </Button>
      </Box>
    )
  }

  const { volumeInfo } = book
  const thumbnail = getThumbnailUrl(volumeInfo.imageLinks)
  const authors = volumeInfo.authors?.join(', ') ?? 'Unknown author'

  const handleSaveNotes = () => {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    updateFavorite(book.id, note, tags)
  }

  return (
    <article className="book-details">
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        className="book-details__back"
      >
        Back to Search
      </Button>

      <Paper className="book-details__card" elevation={0}>
        <Box className="book-details__layout">
          <Box className="book-details__cover">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={`Cover of ${volumeInfo.title}`}
                className="book-details__image"
              />
            ) : (
              <Box className="book-details__placeholder" aria-hidden="true">
                No cover available
              </Box>
            )}
          </Box>

          <Box className="book-details__info">
            <Box className="book-details__header">
              <Typography variant="h4" component="h1" className="book-details__title">
                {volumeInfo.title}
              </Typography>
              <FavoriteButton book={book} />
            </Box>

            <Typography variant="h6" color="text.secondary" className="book-details__author">
              by {authors}
            </Typography>

            <Box className="book-details__meta">
              {volumeInfo.publishedDate && (
                <Chip label={`Published: ${volumeInfo.publishedDate}`} size="small" />
              )}
              {volumeInfo.pageCount && (
                <Chip label={`${volumeInfo.pageCount} pages`} size="small" />
              )}
              {volumeInfo.language && (
                <Chip label={volumeInfo.language.toUpperCase()} size="small" />
              )}
              {volumeInfo.publisher && (
                <Chip label={volumeInfo.publisher} size="small" />
              )}
            </Box>

            {volumeInfo.categories && (
              <Box className="book-details__categories">
                {volumeInfo.categories.map((category) => (
                  <Chip key={category} label={category} variant="outlined" size="small" />
                ))}
              </Box>
            )}

            <Typography variant="body1" className="book-details__description">
              {volumeInfo.description ?? 'No description available for this book.'}
            </Typography>

            {isFavorite(book.id) && (
              <Box className="book-details__notes" component="section" aria-label="Favorite notes">
                <Typography variant="h6" component="h2">
                  Notes & Tags
                </Typography>
                <TextField
                  label="Personal note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  margin="normal"
                />
                <TextField
                  label="Tags (comma-separated)"
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  fullWidth
                  margin="normal"
                  placeholder="e.g. to-read, classic"
                />
                <Button variant="contained" onClick={handleSaveNotes} sx={{ mt: 1 }}>
                  Save Notes
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </article>
  )
}
