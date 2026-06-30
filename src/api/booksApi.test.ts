import { describe, it, expect } from 'vitest'
import { buildSearchQuery } from './booksApi'

describe('booksApi', () => {
  it('builds multi-field search query', () => {
    const query = buildSearchQuery({
      title: 'JavaScript',
      author: 'Smith',
      genre: 'programming',
    })

    expect(query).toBe('intitle:JavaScript+inauthor:Smith+subject:programming')
  })

  it('builds query with only title', () => {
    const query = buildSearchQuery({
      title: 'React',
      author: '',
      genre: '',
    })

    expect(query).toBe('intitle:React')
  })
})
