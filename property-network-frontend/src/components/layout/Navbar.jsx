import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

const NOTIF_POLL_MS = 5000

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  const handleLogout = () => {
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

  const notifLinkStyle = {
    color: '#374151', fontWeight: '500', fontSize: '15px',
    display: 'flex', alignItems: 'center', gap: '6px', position: 'relative'
  }

  const NotificationLink = ({ to }) => (
    <Link to={to} style={notifLinkStyle}>
      <FontAwesomeIcon icon={faBell} style={{ fontSize: '15px' }} />
      Notifications
      {unreadCount > 0 && (
        <span style={{
          background: '#dc2626', color: '#fff', fontSize: '11px', fontWeight: '700',
          borderRadius: '20px', minWidth: '18px', height: '18px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '0 5px'
        }}>{unreadCount}</span>
      )}
    </Link>
  )

  return (
    <nav style={{
      background: '#fff', borderBottom: '1px solid #e5e7eb',
      padding: '0 32px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      height: '64px', position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ fontWeight: '800', fontSize: '20px', color: '#1a56db' }}>
        Property Network
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {user?.role === 'buyer' && (
          <>
            <Link to="/buyer" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Home</Link>
            <Link to="/buyer/saved" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Saved</Link>
            <Link to="/buyer/appointments" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Appointments</Link>
            <Link to="/buyer/messages" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Messages</Link>
            <NotificationLink to="/buyer/notifications" />
            <Link to="/buyer/profile" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Profile</Link>
          </>
        )}
        {user?.role === 'agent' && (
          <>
            <Link to="/agent" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Dashboard</Link>
            <Link to="/agent/listings" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Listings</Link>
            <Link to="/agent/appointments" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Appointments</Link>
            <Link to="/agent/messages" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Messages</Link>
            <NotificationLink to="/agent/notifications" />
            <Link to="/agent/profile" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Profile</Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Dashboard</Link>
            <Link to="/admin/users" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Users</Link>
            <Link to="/admin/listings" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Listings</Link>
            <Link to="/admin/reports" style={{ color: '#374151', fontWeight: '500', fontSize: '15px' }}>Reports</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout} style={{
            padding: '8px 18px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '6px', fontWeight: '600',
            fontSize: '14px', cursor: 'pointer'
          }}>Logout</button>
        )}
        {!user && (
          <Link to="/login" style={{
            padding: '8px 18px', background: '#1a56db', color: '#fff',
            borderRadius: '6px', fontWeight: '600', fontSize: '14px'
          }}>Sign In</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar