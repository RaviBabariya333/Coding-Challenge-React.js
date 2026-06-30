import axios, { isAxiosError } from 'axios'
import type { Book, BooksSearchResponse, SearchFormValues } from '../shared/types/book'
import {
  API_ENDPOINTS,
  getApiKey,
  getBooksBaseUrl,
  isApiKeyConfigured,
} from '../shared/utils/apiEndpoints'

const BASE_URL = getBooksBaseUrl()
const CACHE_TTL_MS = 10 * 60 * 1000
const MIN_REQUEST_INTERVAL_MS = 1200
const MAX_RETRIES = 3

const booksApi = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
  },
})

const responseCache = new Map<string, { data: unknown; expiresAt: number }>()
let lastRequestAt = 0
let requestQueue: Promise<void> = Promise.resolve()

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export { isApiKeyConfigured }

function encodeGoogleBooksQuery(query: string): string {
  return query
    .split('+')
    .map((part) => encodeURIComponent(part))
    .join('+')
}

export function buildSearchQuery({ title, author, genre }: SearchFormValues): string {
  const parts: string[] = []

  if (title.trim()) {
    parts.push(`intitle:${title.trim()}`)
  }
  if (author.trim()) {
    parts.push(`inauthor:${author.trim()}`)
  }
  if (genre.trim()) {
    parts.push(`subject:${genre.trim()}`)
  }

  return parts.join('+')
}

function buildCacheKey(path: string, params: Record<string, string | number>) {
  return `${path}?${JSON.stringify(params)}`
}

function getFromCache<T>(key: string): T | null {
  const entry = responseCache.get(key)
  if (!entry) {
    return null
  }
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key)
    return null
  }
  return entry.data as T
}

function setCache(key: string, data: unknown) {
  responseCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })
}

async function throttleRequest() {
  requestQueue = requestQueue.then(async () => {
    const elapsed = Date.now() - lastRequestAt
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await sleep(MIN_REQUEST_INTERVAL_MS - elapsed)
    }
    lastRequestAt = Date.now()
  })
  await requestQueue
}

function serializeParams(params: Record<string, string | number>) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== '')

  return entries
    .map(([key, value]) => {
      if (key === 'q') {
        return `q=${encodeGoogleBooksQuery(String(value))}`
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    })
    .join('&')
}

function getRequestParams(startIndex: number, maxResults: number) {
  const params: Record<string, string | number> = {
    startIndex,
    maxResults,
  }

  const apiKey = getApiKey()
  if (apiKey) {
    params.key = apiKey
  }

  return params
}

function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.'
    }
    if (!error.response) {
      return 'Network error. Please check your internet connection and try again.'
    }

    const status = error.response.status
    const apiMessage =
      typeof error.response.data === 'object' &&
      error.response.data !== null &&
      'error' in error.response.data &&
      typeof (error.response.data as { error?: { message?: string } }).error?.message === 'string'
        ? (error.response.data as { error: { message: string } }).error.message
        : ''

    if (status === 403 || apiMessage.includes('are blocked')) {
      return 'Google Books API is blocked for your API key. In Google Cloud Console: enable Books API, then edit your API key and allow Books API (or remove API restrictions for testing).'
    }
    if (status === 429) {
      if (!isApiKeyConfigured()) {
        return 'Rate limit reached. Add a free Google Books API key in .env (copy .env.example), restart the app, then try again.'
      }
      return 'Too many requests. Please wait 1–2 minutes before searching again.'
    }
    if (status >= 500) {
      return 'Google Books service is temporarily unavailable. Please try again later.'
    }
  }

  return 'Failed to fetch books. Please try again.'
}

async function requestWithRetry<T>(request: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await throttleRequest()
      return await request()
    } catch (error) {
      const isRateLimited = isAxiosError(error) && error.response?.status === 429
      const canRetry = isRateLimited && attempt < MAX_RETRIES

      if (canRetry) {
        const retryDelay = (attempt + 1) * 2000
        await sleep(retryDelay)
        continue
      }

      throw error
    }
  }

  throw new Error('Failed to fetch books. Please try again.')
}

async function getVolumes<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T> {
  const cacheKey = buildCacheKey(path, params)
  const cached = getFromCache<T>(cacheKey)
  if (cached) {
    return cached
  }

  const data = await requestWithRetry(async () => {
    const { data: responseData } = await booksApi.get<T>(path, {
      params,
      paramsSerializer: {
        serialize: () => serializeParams(params),
      },
    })
    return responseData
  })

  setCache(cacheKey, data)
  return data
}

export async function searchBooks(
  values: SearchFormValues,
  startIndex = 0,
  maxResults = 10,
): Promise<BooksSearchResponse> {
  const query = buildSearchQuery(values)

  try {
    return await getVolumes<BooksSearchResponse>(API_ENDPOINTS.books.search, {
      q: query,
      ...getRequestParams(startIndex, maxResults),
    })
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function getBookById(id: string): Promise<Book> {
  try {
    return await getVolumes<Book>(API_ENDPOINTS.books.byId(id), getRequestParams(0, 1))
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Book not found.')
    }
    throw new Error(getApiErrorMessage(error))
  }
}

export function getThumbnailUrl(imageLinks?: Book['volumeInfo']['imageLinks']): string {
  const url = imageLinks?.thumbnail ?? imageLinks?.smallThumbnail
  return url ? url.replace('http://', 'https://') : ''
}

