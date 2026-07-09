import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

const NOTIF_POLL_MS = 5000

const LINKS = {
  buyer: [
    { to: '/buyer', label: 'Home', end: true },
    { to: '/buyer/saved', label: 'Saved' },
    { to: '/buyer/appointments', label: 'Appointments' },
    { to: '/buyer/messages', label: 'Messages' },
    { to: '/buyer/notifications', label: 'Notifications', notif: true },
    { to: '/buyer/profile', label: 'Profile' },
  ],
  agent: [
    { to: '/agent', label: 'Dashboard', end: true },
    { to: '/agent/listings', label: 'Listings' },
    { to: '/agent/appointments', label: 'Appointments' },
    { to: '/agent/messages', label: 'Messages' },
    { to: '/agent/notifications', label: 'Notifications', notif: true },
    { to: '/agent/profile', label: 'Profile' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/listings', label: 'Listings' },
    { to: '/admin/reports', label: 'Reports' },
  ],
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  useEffect(() => {
    if (!user || (user.role !== 'buyer' && user.role !== 'agent')) return

    const endpoint = user.role === 'buyer' ? '/buyers/notifications' : '/agents/notifications'

    const loadUnread = () => {
      api.get(endpoint)
        .then(res => {
          const count = res.data.data.filter(n => !n.is_read).length
          setUnreadCount(count)
        })
        .catch(err => console.error(err))
    }

    loadUnread()
    const interval = setInterval(loadUnread, NOTIF_POLL_MS)
    return () => clearInterval(interval)
  }, [user])

  const links = user ? LINKS[user.role] || [] : []

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Property Network</Link>

      <button
        className="nav-toggle"
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
      </button>

      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.notif && <FontAwesomeIcon icon={faBell} />}
            {link.label}
            {link.notif && unreadCount > 0 && (
              <span className="count-pill count-pill-danger" aria-label={`${unreadCount} unread notifications`}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
        {user ? (
          <button onClick={handleLogout} className="btn btn-primary btn-sm nav-cta">Logout</button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm nav-cta">Sign In</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
