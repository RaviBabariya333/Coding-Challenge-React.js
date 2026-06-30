import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SearchIcon from '@mui/icons-material/Search'
import { useFavorites } from '../../store/useFavorites'
import { getThumbnailUrl } from '../../api/booksApi'
import './FavoritesPage.scss'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  const sortedFavorites = useMemo(
    () => [...favorites].sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title)),
    [favorites],
  )

  if (favorites.length === 0) {
    return (
      <Box className="favorites-page favorites-page--empty" role="status">
        <FavoriteIcon className="favorites-page__empty-icon" aria-hidden="true" />
        <Typography variant="h5" component="h1">
          No favorites yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Search for books and add them to your favorites list.
        </Typography>
        <Button component={Link} to="/" variant="contained" startIcon={<SearchIcon />}>
          Start Searching
        </Button>
      </Box>
    )
  }

  return (
    <Box className="favorites-page">
      <Typography variant="h4" component="h1" className="favorites-page__heading">
        My Favorites
      </Typography>
      <Typography variant="body1" color="text.secondary" className="favorites-page__count">
        {favorites.length} book{favorites.length === 1 ? '' : 's'} saved
      </Typography>

      <Box className="favorites-page__list" component="ul" aria-label="Favorite books">
        {sortedFavorites.map((book) => {
          const thumbnail = getThumbnailUrl(book.volumeInfo.imageLinks)
          const authors = book.volumeInfo.authors?.join(', ') ?? 'Unknown author'

          return (
            <Card
              key={book.id}
              component="li"
              className="favorites-page__item"
              elevation={0}
            >
              <Box className="favorites-page__item-layout">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt=""
                    className="favorites-page__thumbnail"
                  />
                ) : (
                  <Box className="favorites-page__thumbnail favorites-page__thumbnail--placeholder" />
                )}
                <CardContent className="favorites-page__content">
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/book/${book.id}`}
                    className="favorites-page__title"
                  >
                    {book.volumeInfo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {authors}
                  </Typography>
                  {book.note && (
                    <Typography variant="body2" className="favorites-page__note">
                      Note: {book.note}
                    </Typography>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <Box className="favorites-page__tags">
                      {book.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  )}
                </CardContent>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => removeFavorite(book.id)}
                  aria-label={`Remove ${book.volumeInfo.title} from favorites`}
                >
                  Remove
                </Button>
              </Box>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}
