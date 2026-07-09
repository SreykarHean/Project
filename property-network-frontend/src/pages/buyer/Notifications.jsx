import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { formatDateTime } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faComments, faCalendarCheck, faBell } from '@fortawesome/free-solid-svg-icons'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

const ICONS = {
  message: { icon: faEnvelope, bg: 'var(--info-bg)', color: 'var(--info-text)' },
  qa_reply: { icon: faComments, bg: '#ede9fe', color: '#5b21b6' },
  appointment: { icon: faCalendarCheck, bg: 'var(--success-bg)', color: 'var(--success-text)' },
  default: { icon: faBell, bg: 'var(--neutral-bg)', color: 'var(--neutral-text)' },
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = () => {
    return api.get('/buyers/notifications')
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
        await api.patch(`/buyers/notifications/${n.notif_id}`)
      } catch (err) {
        console.error(err)
      }
    }
    if (n.link) navigate(n.link)
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(x => ({ ...x, is_read: true })))
    try {
      await api.patch('/buyers/notifications/read-all')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="page page-sm">
      <div className="page-header">
        <h2>
          Notifications{' '}
          {unreadCount > 0 && <span className="count-pill" style={{ verticalAlign: 'middle' }}>{unreadCount} new</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-link" style={{ fontSize: '13px' }}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faBell} />}
          title="You're all caught up — no notifications yet."
        />
      ) : (
        <div className="stack" style={{ gap: '10px' }}>
          {notifications.map(n => {
            const style = ICONS[n.type] || ICONS.default
            return (
              <div
                key={n.notif_id}
                onClick={() => handleClick(n)}
                className={`notif-item${n.is_read ? '' : ' unread'}${n.link ? ' clickable' : ''}`}
              >
                <div className="notif-icon" style={{ background: style.bg, color: style.color }}>
                  <FontAwesomeIcon icon={style.icon} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="notif-message">{n.message}</p>
                  <p className="notif-time">{formatDateTime(n.createdAt)}</p>
                </div>
                {!n.is_read && <span className="notif-dot" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Notifications
