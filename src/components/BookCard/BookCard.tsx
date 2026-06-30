import { memo } from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from '@mui/material'
import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import { getThumbnailUrl } from '../../api/booksApi'
import FavoriteButton from '../FavoriteButton'
import './BookCard.scss'

interface BookCardProps {
  book: Book
}

function BookCard({ book }: BookCardProps) {
  const { id, volumeInfo } = book
  const thumbnail = getThumbnailUrl(volumeInfo.imageLinks)
  const authors = volumeInfo.authors?.join(', ') ?? 'Unknown author'
  const description = volumeInfo.description ?? 'No description available.'

  return (
    <Card className="book-card" component="article" aria-labelledby={`book-title-${id}`}>
      <Box className="book-card__favorite">
        <FavoriteButton book={book} size="small" />
      </Box>
      <CardActionArea component={Link} to={`/book/${id}`} className="book-card__action">
        <CardMedia
          component="img"
          height="200"
          image={thumbnail || undefined}
          alt={`Cover of ${volumeInfo.title}`}
          className={`book-card__image${thumbnail ? '' : ' book-card__image--placeholder'}`}
        />
        {!thumbnail && (
          <Box className="book-card__placeholder" aria-hidden="true">
            No cover
          </Box>
        )}
        <CardContent className="book-card__content">
          <Typography
            id={`book-title-${id}`}
            variant="subtitle1"
            component="h3"
            className="book-card__title"
          >
            {volumeInfo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="book-card__author">
            {authors}
          </Typography>
          <Typography variant="body2" className="book-card__description">
            {description.length > 120 ? `${description.slice(0, 120)}...` : description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default memo(BookCard)
