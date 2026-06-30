import { AppBar, Badge, Box, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SearchIcon from '@mui/icons-material/Search'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useFavorites } from '../../store/useFavorites'
import './Navbar.scss'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `navbar__link${isActive ? ' navbar__link--active' : ''}`

export default function Navbar() {
  const { favorites } = useFavorites()

  return (
    <AppBar position="sticky" elevation={0} className="navbar">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="navbar__toolbar">
          <Box className="navbar__brand" component={NavLink} to="/">
            <MenuBookIcon aria-hidden="true" />
            <Typography variant="h6" component="span" className="navbar__title">
              Book Explorer
            </Typography>
          </Box>

          <nav aria-label="Main navigation" className="navbar__nav">
            <NavLink to="/" className={navLinkClass} end>
              <SearchIcon fontSize="small" aria-hidden="true" />
              Search
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              <Badge
                badgeContent={favorites.length}
                color="secondary"
                max={99}
                aria-label={`${favorites.length} favorite books`}
              >
                <FavoriteIcon fontSize="small" aria-hidden="true" />
              </Badge>
              Favorites
            </NavLink>
          </nav>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
