const GOOGLE_BOOKS_API_ROOT = 'https://www.googleapis.com/books/v1'

export const API_ENDPOINTS = {
  books: {
    proxy: '/api/books',
    volumes: `${GOOGLE_BOOKS_API_ROOT}/volumes`,
    search: '',
    byId: (id: string) => `/${id}`,
  },
} as const

export function getBooksBaseUrl(): string {
  return import.meta.env.DEV
    ? API_ENDPOINTS.books.proxy
    : API_ENDPOINTS.books.volumes
}

export function getApiKey(): string | undefined {
  const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim()
  return key || undefined
}

export function isApiKeyConfigured(): boolean {
  return Boolean(getApiKey())
}
