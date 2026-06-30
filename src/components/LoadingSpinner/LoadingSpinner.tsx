import { CircularProgress, Box } from '@mui/material'

interface LoadingSpinnerProps {
  label?: string
}

export default function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label={label}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress color="primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </Box>
  )
}
