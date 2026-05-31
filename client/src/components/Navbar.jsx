import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Navbar() {
  const { user, signout } = useAuth()

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Dhaka Zoo home">
        <span className="brand-mark">DZ</span>
        <span>
          <strong>Dhaka Zoo</strong>
          <small>Mirpur visitor guide</small>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/animals">Animals</NavLink>
        <NavLink to="/tickets">Tickets</NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-chip">{user.name}</span>
            <button className="ghost-button small" type="button" onClick={signout}>Sign out</button>
          </>
        ) : (
          <>
            <Link className="ghost-button small" to="/signin">Sign in</Link>
            <Link className="primary-button small" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
