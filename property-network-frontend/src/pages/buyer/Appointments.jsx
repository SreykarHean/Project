import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/appointments/buyer')
      .then(res => setAppointments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id, e) => {
    e.stopPropagation() // prevent the card's navigate click from firing
    if (!confirm('Cancel this appointment?')) return
    try {
      await api.patch(`/appointments/${id}/cancel`)
      setAppointments(appointments.map(a =>
        a.appointment_id === id ? { ...a, status: 'cancelled' } : a
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const statusColor = (status) => {
    if (status === 'confirmed') return '#10b981'
    if (status === 'cancelled') return '#ef4444'
    return '#f59e0b'
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>My Appointments</h2>
      {appointments.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No appointments yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map(a => (
            <div
              key={a.appointment_id}
              onClick={() => navigate(`/buyer/listings/${a.Listing?.listing_id}`)}
              style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '8px', padding: '20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div>
                <h3 style={{ marginBottom: '6px' }}>{a.Listing?.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>{a.Listing?.city} — {a.Listing?.address}</p>
                <p style={{ fontSize: '14px', marginTop: '6px' }}>Date: {a.appointment_date}</p>
                {a.note && <p style={{ fontSize: '14px', color: '#6b7280' }}>Note: {a.note}</p>}
                {a.Listing?.Agent?.email && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                    Agent: {a.Listing.Agent.full_name} · {a.Listing.Agent.email}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: '600', color: '#fff',
                  background: statusColor(a.status), marginBottom: '12px'
                }}>{a.status}</span>
                {a.status === 'pending' && (
                  <div>
                    <button onClick={(e) => handleCancel(a.appointment_id, e)} style={{
                      padding: '8px 16px', background: '#ef4444', color: '#fff',
                      border: 'none', borderRadius: '6px', fontSize: '14px'
                    }}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Appointments