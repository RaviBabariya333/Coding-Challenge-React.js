import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Navbar from '../Navbar/Navbar'
import './Layout.scss'

export default function Layout() {
  return (
    <Box className="layout">
      <Navbar />
      <Container component="main" maxWidth="lg" className="layout__main">
        <Outlet />
      </Container>
    </Box>
  )
}
