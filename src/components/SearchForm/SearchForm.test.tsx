import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchForm from './SearchForm'
import type { SearchFormValues } from '../../types/book'

describe('SearchForm', () => {
  const onSearch = vi.fn<(values: SearchFormValues) => void>()

  beforeEach(() => {
    onSearch.mockClear()
  })

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<SearchForm onSearch={onSearch} />)

    await user.click(screen.getByRole('button', { name: /search books/i }))

    expect(screen.getByText(/enter a title, or search by author or genre/i)).toBeInTheDocument()
    expect(screen.getByText(/enter an author, or search by title or genre/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a genre, or search by title or author/i)).toBeInTheDocument()
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('submits form when at least one field is filled', async () => {
    const user = userEvent.setup()
    render(<SearchForm onSearch={onSearch} />)

    await user.type(screen.getByLabelText(/^title$/i), 'React')
    await user.click(screen.getByRole('button', { name: /search books/i }))

    expect(onSearch).toHaveBeenCalledWith({
      title: 'React',
      author: '',
      genre: '',
    })
  })

  it('disables submit button while loading', () => {
    render(<SearchForm onSearch={onSearch} isLoading />)

    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled()
  })

  it('clears fields when clicking clear', async () => {
    const user = userEvent.setup()
    render(<SearchForm onSearch={onSearch} />)

    await user.type(screen.getByLabelText(/^title$/i), 'React')
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByLabelText(/^title$/i)).toHaveValue('')
  })
})
