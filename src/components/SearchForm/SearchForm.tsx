import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { SearchFormValues } from '../../types/book'
import './SearchForm.scss'

const initialValues: SearchFormValues = {
  title: '',
  author: '',
  genre: '',
}

const SEARCH_FIELDS: {
  name: keyof SearchFormValues
  label: string
  placeholder: string
}[] = [
  { name: 'title', label: 'Title', placeholder: 'e.g. The Great Gatsby' },
  { name: 'author', label: 'Author', placeholder: 'e.g. Jane Austen' },
  { name: 'genre', label: 'Genre / Keyword', placeholder: 'e.g. science fiction' },
]

const FIELD_VALIDATION_MESSAGES: Record<keyof SearchFormValues, string> = {
  title: 'Enter a title, or search by author or genre.',
  author: 'Enter an author, or search by title or genre.',
  genre: 'Enter a genre, or search by title or author.',
}

const helperTextSlotProps = {
  formHelperText: {
    sx: { minHeight: '1.5em' },
  },
}

type FieldErrors = Partial<Record<keyof SearchFormValues, string>>

function validateSearchForm(values: SearchFormValues): FieldErrors {
  const hasValue = Object.values(values).some((value) => value.trim().length > 0)

  if (hasValue) {
    return {}
  }

  return SEARCH_FIELDS.reduce<FieldErrors>((errors, field) => {
    if (!values[field.name].trim()) {
      errors[field.name] = FIELD_VALIDATION_MESSAGES[field.name]
    }
    return errors
  }, {})
}

interface SearchFormProps {
  onSearch: (values: SearchFormValues) => void
  onValuesChange?: (values: SearchFormValues) => void
  isLoading?: boolean
}

export default function SearchForm({ onSearch, onValuesChange, isLoading = false }: SearchFormProps) {
  const [values, setValues] = useState<SearchFormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleClear = () => {
    setValues(initialValues)
    setErrors({})
    onValuesChange?.(initialValues)
  }

  const handleChange = (field: keyof SearchFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValues = { ...values, [field]: event.target.value }
    setValues(nextValues)
    onValuesChange?.(nextValues)

    if (event.target.value.trim()) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
      return
    }

    if (Object.keys(errors).length > 0) {
      setErrors(validateSearchForm(nextValues))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fieldErrors = validateSearchForm(values)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onSearch(values)
  }

  return (
    <Paper component="section" className="search-form" elevation={0}>
      <Typography variant="h5" component="h1" className="search-form__heading">
        Discover Your Next Read
      </Typography>
      <Typography variant="body1" color="text.secondary" className="search-form__subtitle">
        Search by title, author, or genre using the Google Books API.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        className="search-form__form"
        aria-label="Book search form"
      >
        {SEARCH_FIELDS.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={values[field.name]}
            onChange={handleChange(field.name)}
            fullWidth
            placeholder={field.placeholder}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name] ?? ''}
            slotProps={helperTextSlotProps}
          />
        ))}

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          disabled={isLoading}
          className="search-form__submit"
        >
          {isLoading ? 'Searching...' : 'Search Books'}
        </Button>

        <Button
          type="button"
          variant="text"
          size="large"
          onClick={handleClear}
          disabled={isLoading}
          className="search-form__submit"
        >
          Clear
        </Button>
      </Box>
    </Paper>
  )
}
