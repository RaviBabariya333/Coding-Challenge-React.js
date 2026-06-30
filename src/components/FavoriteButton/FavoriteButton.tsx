import { memo } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import type { Book } from '../../types/book'
import { useFavorites } from '../../store/useFavorites'

interface FavoriteButtonProps {
  book: Book
  size?: 'small' | 'medium' | 'large'
}

function FavoriteButton({ book, size = 'medium' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(book.id)
  const label = favorited
    ? `Remove "${book.volumeInfo.title}" from favorites`
    : `Add "${book.volumeInfo.title}" to favorites`

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggleFavorite(book)
        }}
        aria-label={label}
        aria-pressed={favorited}
        color={favorited ? 'secondary' : 'default'}
        size={size}
      >
        {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default memo(FavoriteButton)
