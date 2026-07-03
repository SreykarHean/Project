import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { formatDateTime } from '../../utils/helpers'

const ICONS = {
  message: { icon: '', bg: '#dbeafe', color: '#1e40af' },
  appointment: { icon: '', bg: '#d1fae5', color: '#065f46' },
  default: { icon: '', bg: '#f3f4f6', color: '#374151' },
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = () => {
    return api.get('/agents/notifications')
      .then(res => setNotifications(res.data.data))
      .catch(console.error)
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleClick = async (n) => {
    if (!n.is_read) {
      setNotifications(prev => prev.map(x => x.notif_id === n.notif_id ? { ...x, is_read: true } : x))
      try {
        await api.patch(`/agents/notifications/${n.notif_id}`)
      } catch (err) {
        console.error(err)
      }
    }
    if (n.link) navigate(n.link)
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(x => ({ ...x, is_read: true })))
    try {
      await api.patch('/agents/notifications/read-all')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Notifications {unreadCount > 0 && (
          <span style={{
            fontSize: '13px', background: '#1a56db', color: '#fff',
            borderRadius: '20px', padding: '2px 10px', marginLeft: '8px', verticalAlign: 'middle'
          }}>{unreadCount} new</span>
        )}</h2>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} style={{
            background: 'none', border: 'none', color: '#1a56db',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer'
          }}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <p style={{ fontSize: '40px', marginBottom: '8px' }}></p>
          <p>You're all caught up — no notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => {
            const style = ICONS[n.type] || ICONS.default
            return (
              <div key={n.notif_id} onClick={() => handleClick(n)} style={{
                background: n.is_read ? '#fff' : '#f8fafc',
                border: `1px solid ${n.is_read ? '#e5e7eb' : '#bfdbfe'}`,
                borderRadius: '10px', padding: '14px 16px',
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                cursor: n.link ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: style.bg, color: style.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>{style.icon}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: n.is_read ? '400' : '600', fontSize: '14.5px', color: '#111827', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                  <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '4px' }}>
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>

                {!n.is_read && (
                  <span style={{
                    width: '9px', height: '9px', borderRadius: '50%',
                    background: '#1a56db', flexShrink: 0, marginTop: '6px'
                  }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Notifications