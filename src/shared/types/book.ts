export interface BookImageLinks {
  thumbnail?: string
  smallThumbnail?: string
}

export interface BookVolumeInfo {
  title: string
  authors?: string[]
  description?: string
  imageLinks?: BookImageLinks
  publishedDate?: string
  pageCount?: number
  categories?: string[]
  publisher?: string
  language?: string
}

export interface Book {
  id: string
  volumeInfo: BookVolumeInfo
}

export interface BooksSearchResponse {
  totalItems: number
  items?: Book[]
}

export interface FavoriteBook extends Book {
  note?: string
  tags?: string[]
}

export interface SearchFormValues {
  title: string
  author: string
  genre: string
}

