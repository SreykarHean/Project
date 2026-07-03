import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'

const POLL_MS = 4000

const timeShort = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const dayLabel = (d) => {
  const date = new Date(d)
  const today = new Date()
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

const Messages = () => {
  const { buyer_id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const passedBuyer = location.state || {}

  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [thread, setThread] = useState(null) // { buyer, messages }
  const [threadLoading, setThreadLoading] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [locBusy, setLocBusy] = useState(false)
  const [error, setError] = useState('')

  const bottomRef = useRef(null)
  const activeBuyerId = buyer_id ? parseInt(buyer_id) : null

  const loadConversations = useCallback(() => {
    return api.get('/agents/messages')
      .then(res => setConversations(res.data.data))
      .catch(err => {
        console.error(err)
        setError('Could not load your conversations.')
      })
  }, [])

  const loadThread = useCallback((id) => {
    return api.get(`/agents/messages/${id}`)
      .then(res => {
        setThread(res.data.data)
        setConversations(prev => prev.map(c => c.buyer_id === id ? { ...c, unread_count: 0 } : c))
      })
      .catch(err => {
        console.error(err)
        setError('Could not load this conversation.')
      })
  }, [])

  // initial + polling for conversation list
  useEffect(() => {
    loadConversations().finally(() => setConversationsLoading(false))
    const interval = setInterval(loadConversations, POLL_MS)
    return () => clearInterval(interval)
  }, [loadConversations])

  // load + poll active thread
  useEffect(() => {
    if (!activeBuyerId) { setThread(null); return }
    setThreadLoading(true)
    loadThread(activeBuyerId).finally(() => setThreadLoading(false))
    const interval = setInterval(() => loadThread(activeBuyerId), POLL_MS)
    return () => clearInterval(interval)
  }, [activeBuyerId, loadThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages?.length])

  const handleSendText = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeBuyerId || sending) return
    setSending(true)
    const body = text.trim()
    setText('')
    try {
      await api.post('/agents/messages', { buyer_id: activeBuyerId, body, message_type: 'text' })
      await loadThread(activeBuyerId)
      loadConversations()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message')
      setText(body)
    } finally {
      setSending(false)
    }
  }

  const handleShareLocation = () => {
    if (!activeBuyerId || locBusy) return
    if (!navigator.geolocation) {
      setError('Location sharing is not supported on this device.')
      return
    }
    setLocBusy(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post('/agents/messages', {
            buyer_id: activeBuyerId,
            message_type: 'location',
            location_lat: pos.coords.latitude,
            location_lng: pos.coords.longitude,
            location_label: 'Shared Location',
          })
          await loadThread(activeBuyerId)
          loadConversations()
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to share location')
        } finally {
          setLocBusy(false)
        }
      },
      () => {
        setError('Location permission denied. Enable it in your browser settings to share your location.')
        setLocBusy(false)
      }
    )
  }

  const headerName = thread?.buyer?.full_name || passedBuyer.buyerName || 'Buyer'
  const initials = headerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Messages</h2>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
          padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: '700' }}>×</button>
        </div>
      )}

      <div style={{
        display: 'flex', border: '1px solid #e5e7eb', borderRadius: '12px',
        overflow: 'hidden', background: '#fff', height: '620px'
      }}>
        {/* Conversation list */}
        <div style={{ width: '280px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid #e5e7eb', flexShrink: 0
          }}>
            <span style={{ fontWeight: '700', fontSize: '14px' }}>Conversations</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversationsLoading ? (
              <p style={{ padding: '20px', color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
            ) : conversations.length === 0 && !activeBuyerId ? (
              <p style={{ padding: '20px', color: '#9ca3af', fontSize: '14px' }}>
                No conversations yet. Buyers will show up here once they message you.
              </p>
            ) : (
              conversations.map(c => {
                const isActive = c.buyer_id === activeBuyerId
                const cInitials = (c.buyer_name || 'B').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={c.buyer_id} onClick={() => navigate(`/agent/messages/${c.buyer_id}`)} style={{
                    padding: '14px 16px', cursor: 'pointer',
                    background: isActive ? '#eff6ff' : '#fff',
                    borderLeft: isActive ? '3px solid #1a56db' : '3px solid transparent',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex', gap: '10px', alignItems: 'flex-start'
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', background: '#dbeafe',
                      color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '13px', flexShrink: 0
                    }}>{cInitials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontWeight: c.unread_count ? '700' : '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.buyer_name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>{timeShort(c.last_message_at)}</span>
                      </div>
                      <p style={{
                        fontSize: '12.5px', color: c.unread_count ? '#111827' : '#9ca3af',
                        fontWeight: c.unread_count ? '600' : '400',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px'
                      }}>
                        {c.last_message}
                      </p>
                    </div>
                    {c.unread_count > 0 && (
                      <span style={{
                        background: '#1a56db', color: '#fff', fontSize: '11px', fontWeight: '700',
                        borderRadius: '20px', minWidth: '18px', height: '18px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', padding: '0 5px', flexShrink: 0
                      }}>{c.unread_count}</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!activeBuyerId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '36px' }}></span>
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe',
                  color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '13px'
                }}>{initials}</div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px' }}>{headerName}</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f9fafb' }}>
                {threadLoading && !thread ? (
                  <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading conversation...</p>
                ) : thread?.messages?.length === 0 ? (
                  <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '40px' }}>
                    No messages yet. Say hello to {headerName.split(' ')[0]}!
                  </p>
                ) : (
                  thread?.messages?.reduce((acc, m, idx) => {
                    const prev = thread.messages[idx - 1]
                    const showDay = !prev || dayLabel(prev.sent_at) !== dayLabel(m.sent_at)
                    if (showDay) {
                      acc.push(
                        <div key={`day-${m.message_id}`} style={{ textAlign: 'center', margin: '16px 0 10px' }}>
                          <span style={{ fontSize: '11px', color: '#9ca3af', background: '#f3f4f6', padding: '3px 10px', borderRadius: '20px' }}>
                            {dayLabel(m.sent_at)}
                          </span>
                        </div>
                      )
                    }
                    const isMine = m.sender_type === 'agent'
                    acc.push(
                      <div key={m.message_id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                        <div style={{ maxWidth: '70%' }}>
                          {m.message_type === 'location' ? (
                            <div style={{
                              background: isMine ? '#1a56db' : '#fff',
                              color: isMine ? '#fff' : '#111827',
                              border: isMine ? 'none' : '1px solid #e5e7eb',
                              borderRadius: '14px', padding: '12px 14px'
                            }}>
                              <p style={{ fontWeight: '600', fontSize: '13.5px', marginBottom: '4px' }}><FontAwesomeIcon icon={faLocationDot} /> {m.location_label || 'Shared Location'}</p>
                              
                                href={`https://www.google.com/maps?q=${m.location_lat},${m.location_lng}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '12.5px', color: isMine ? '#dbeafe' : '#1a56db', textDecoration: 'underline' }}
                              <a>Open in Google Maps</a>
                            </div>
                          ) : (
                            <div style={{
                              background: isMine ? '#1a56db' : '#fff',
                              color: isMine ? '#fff' : '#111827',
                              border: isMine ? 'none' : '1px solid #e5e7eb',
                              borderRadius: '14px', padding: '10px 14px', fontSize: '14.5px', lineHeight: '1.4',
                              wordBreak: 'break-word'
                            }}>{m.body}</div>
                          )}
                          <p style={{ fontSize: '10.5px', color: '#9ca3af', marginTop: '3px', textAlign: isMine ? 'right' : 'left' }}>
                            {timeShort(m.sent_at)}
                          </p>
                        </div>
                      </div>
                    )
                    return acc
                  }, [])
                )}
                <div ref={bottomRef} />
              </div>

              {/* Composer */}
              <form onSubmit={handleSendText} style={{
                borderTop: '1px solid #e5e7eb', padding: '12px 16px',
                display: 'flex', gap: '8px', alignItems: 'center'
              }}>
                <button type="button" onClick={handleShareLocation} disabled={locBusy} title="Share your location" style={{
                  width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e5e7eb',
                  background: '#fff', cursor: locBusy ? 'default' : 'pointer', fontSize: '16px', flexShrink: 0
                }}>{locBusy ? '…' : <FontAwesomeIcon icon={faLocationDot} />}</button>
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb',
                    borderRadius: '20px', fontSize: '14.5px', outline: 'none'
                  }}
                />
                <button type="submit" disabled={!text.trim() || sending} style={{
                  padding: '10px 18px', background: text.trim() ? '#1a56db' : '#c7d2fe', color: '#fff',
                  border: 'none', borderRadius: '20px', fontWeight: '600', cursor: text.trim() ? 'pointer' : 'default',
                  flexShrink: 0
                }}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages