import { memo } from 'react'
import { Grid, Typography, Box } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import type { Book } from '../../types/book'
import BookCard from '../BookCard/BookCard'

interface BookGridProps {
  books: Book[]
  emptyMessage?: string
}

function BookGrid({ books, emptyMessage = 'No books found.' }: BookGridProps) {
  if (books.length === 0) {
    return (
      <Box className="book-grid__empty" role="status">
        <SearchOffIcon fontSize="large" color="disabled" aria-hidden="true" />
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3} component="section" aria-label="Book results">
      {books.map((book) => (
        <Grid key={book.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  )
}

export default memo(BookGrid)
