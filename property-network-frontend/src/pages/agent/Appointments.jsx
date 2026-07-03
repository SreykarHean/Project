import { useState, useEffect } from 'react'
import api from '../../services/api'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/appointments/agent')
      .then(res => setAppointments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status })
      setAppointments(appointments.map(a =>
        a.appointment_id === id ? { ...a, status } : a
      ))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Appointments</h2>
      {appointments.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No appointments yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map(a => (
            <div key={a.appointment_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ marginBottom: '4px' }}>{a.Buyer?.full_name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{a.Buyer?.email} · {a.Buyer?.phone}</p>
                <p style={{ fontSize: '14px', marginTop: '6px' }}>{a.Listing?.title} — {a.appointment_date}</p>
                {a.note && <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Note: {a.note}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                  background: a.status === 'confirmed' ? '#d1fae5' : a.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                  color: a.status === 'confirmed' ? '#065f46' : a.status === 'cancelled' ? '#991b1b' : '#92400e'
                }}>{a.status}</span>
                {a.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleStatus(a.appointment_id, 'confirmed')} style={{
                      padding: '7px 14px', background: '#d1fae5', color: '#065f46',
                      border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
                    }}>Confirm</button>
                    <button onClick={() => handleStatus(a.appointment_id, 'cancelled')} style={{
                      padding: '7px 14px', background: '#fee2e2', color: '#991b1b',
                      border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
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