import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faComments } from '@fortawesome/free-solid-svg-icons'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import Alert from '../../components/ui/Alert'
import Avatar from '../../components/ui/Avatar'

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
  const { agent_id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const passedAgent = location.state || {}

  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [thread, setThread] = useState(null) // { agent, messages }
  const [threadLoading, setThreadLoading] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [locBusy, setLocBusy] = useState(false)
  const [error, setError] = useState('')
  const [showContacts, setShowContacts] = useState(false)
  const [contacts, setContacts] = useState([])
  const [contactsLoading, setContactsLoading] = useState(false)

  const bottomRef = useRef(null)
  const activeAgentId = agent_id ? parseInt(agent_id) : null

  const loadConversations = useCallback(() => {
    return api.get('/buyers/messages')
      .then(res => setConversations(res.data.data))
      .catch(err => {
        console.error(err)
        setError('Could not load your conversations.')
      })
  }, [])

  const openContactPicker = () => {
    setShowContacts(true)
    setContactsLoading(true)
    api.get('/buyers/messages/contacts')
      .then(res => setContacts(res.data.data))
      .catch(err => {
        console.error(err)
        setError('Could not load agents to message.')
      })
      .finally(() => setContactsLoading(false))
  }

  const startConversation = (contact) => {
    setShowContacts(false)
    navigate(`/buyer/messages/${contact.agent_id}`, {
      state: { agentName: contact.agent_name, agencyName: contact.agency_name }
    })
  }

  const loadThread = useCallback((id) => {
    return api.get(`/buyers/messages/${id}`)
      .then(res => {
        setThread(res.data.data)
        setConversations(prev => prev.map(c => c.agent_id === id ? { ...c, unread_count: 0 } : c))
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
    if (!activeAgentId) { setThread(null); return }
    setThreadLoading(true)
    loadThread(activeAgentId).finally(() => setThreadLoading(false))
    const interval = setInterval(() => loadThread(activeAgentId), POLL_MS)
    return () => clearInterval(interval)
  }, [activeAgentId, loadThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages?.length])

  const handleSendText = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeAgentId || sending) return
    setSending(true)
    const body = text.trim()
    setText('')
    try {
      await api.post('/buyers/messages', { agent_id: activeAgentId, body, message_type: 'text' })
      await loadThread(activeAgentId)
      loadConversations()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message')
      setText(body)
    } finally {
      setSending(false)
    }
  }

  const handleShareLocation = () => {
    if (!activeAgentId || locBusy) return
    if (!navigator.geolocation) {
      setError('Location sharing is not supported on this device.')
      return
    }
    setLocBusy(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post('/buyers/messages', {
            agent_id: activeAgentId,
            message_type: 'location',
            location_lat: pos.coords.latitude,
            location_lng: pos.coords.longitude,
            location_label: 'Shared Location',
          })
          await loadThread(activeAgentId)
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

  const headerName = thread?.agent?.full_name || passedAgent.agentName || 'Agent'
  const headerAgency = thread?.agent?.agency_name || passedAgent.agencyName || ''

  const renderMessages = () => thread?.messages?.reduce((acc, m, idx) => {
    const prev = thread.messages[idx - 1]
    if (!prev || dayLabel(prev.sent_at) !== dayLabel(m.sent_at)) {
      acc.push(
        <div key={`day-${m.message_id}`} className="chat-day">
          <span>{dayLabel(m.sent_at)}</span>
        </div>
      )
    }
    const isMine = m.sender_type === 'buyer'
    acc.push(
      <div key={m.message_id} className={`msg-row${isMine ? ' mine' : ''}`}>
        <div className="msg-group">
          {m.message_type === 'location' ? (
            <div className="bubble">
              <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>
                <FontAwesomeIcon icon={faLocationDot} /> {m.location_label || 'Shared Location'}
              </p>
              <a
                href={`https://www.google.com/maps?q=${m.location_lat},${m.location_lng}`}
                target="_blank" rel="noopener noreferrer"
              >Open in Google Maps</a>
            </div>
          ) : (
            <div className="bubble">{m.body}</div>
          )}
          <p className="msg-time">{timeShort(m.sent_at)}</p>
        </div>
      </div>
    )
    return acc
  }, [])

  return (
    <div className="page">
      <h2 style={{ marginBottom: '20px' }}>Messages</h2>

      {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

      <div className={`chat${activeAgentId ? ' has-thread' : ''}`}>
        {/* Conversation list */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <span>Conversations</span>
            <button onClick={openContactPicker} className="btn btn-soft btn-sm btn-pill">+ New</button>
          </div>

          <div className="chat-list">
            {showContacts ? (
              <div>
                <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Start a new chat</span>
                  <button onClick={() => setShowContacts(false)} className="btn-link"
                    style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '400' }}>Cancel</button>
                </div>
                {contactsLoading ? (
                  <p className="chat-list-note">Loading...</p>
                ) : contacts.length === 0 ? (
                  <p className="chat-list-note">
                    Save a listing or book an appointment first — that's how you get connected to an agent to message.
                  </p>
                ) : (
                  contacts.map(c => (
                    <button key={c.agent_id} onClick={() => startConversation(c)} className="chat-list-item">
                      <Avatar name={c.agent_name} />
                      <div className="chat-list-body">
                        <p className="chat-list-name">{c.agent_name}</p>
                        <p className="chat-list-preview">{c.agency_name} · {c.listing_title}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : conversationsLoading ? (
              <p className="chat-list-note">Loading...</p>
            ) : conversations.length === 0 && !activeAgentId ? (
              <p className="chat-list-note">
                No conversations yet. Tap "+ New" above, or message an agent from any listing page.
              </p>
            ) : (
              conversations.map(c => (
                <button
                  key={c.agent_id}
                  onClick={() => navigate(`/buyer/messages/${c.agent_id}`)}
                  className={`chat-list-item${c.agent_id === activeAgentId ? ' active' : ''}${c.unread_count ? ' unread' : ''}`}
                >
                  <Avatar name={c.agent_name} />
                  <div className="chat-list-body">
                    <div className="chat-list-top">
                      <span className="chat-list-name">{c.agent_name}</span>
                      <span className="chat-list-time">{timeShort(c.last_message_at)}</span>
                    </div>
                    <p className="chat-list-preview">
                      {c.last_sender === 'buyer' ? 'You: ' : ''}{c.last_message}
                    </p>
                  </div>
                  {c.unread_count > 0 && <span className="count-pill">{c.unread_count}</span>}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="chat-thread">
          {!activeAgentId ? (
            <div className="chat-thread-empty">
              <FontAwesomeIcon icon={faComments} style={{ fontSize: '36px' }} />
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="chat-thread-header">
                <button onClick={() => navigate('/buyer/messages')} className="back-link chat-back"
                  aria-label="Back to conversations">←</button>
                <Avatar name={headerName} />
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px' }}>{headerName}</p>
                  {headerAgency && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{headerAgency}</p>}
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {threadLoading && !thread ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading conversation...</p>
                ) : thread?.messages?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                    No messages yet. Say hello to {headerName.split(' ')[0]}!
                  </p>
                ) : renderMessages()}
                <div ref={bottomRef} />
              </div>

              {/* Composer */}
              <form onSubmit={handleSendText} className="chat-composer">
                <button type="button" onClick={handleShareLocation} disabled={locBusy}
                  title="Share your location" aria-label="Share your location" className="icon-btn">
                  {locBusy ? '…' : <FontAwesomeIcon icon={faLocationDot} />}
                </button>
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Type a message..."
                  aria-label="Message"
                  className="input"
                />
                <button type="submit" disabled={!text.trim() || sending} className="btn btn-primary btn-pill">
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
