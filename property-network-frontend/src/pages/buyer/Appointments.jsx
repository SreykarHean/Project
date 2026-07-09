import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

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

  if (loading) return <Loading />

  return (
    <div className="page page-md">
      <h2 style={{ marginBottom: '24px' }}>My Appointments</h2>
      {appointments.length === 0 ? (
        <EmptyState title="No appointments yet.">
          Book a viewing from any listing page.
        </EmptyState>
      ) : (
        <div className="stack">
          {appointments.map(a => (
            <div
              key={a.appointment_id}
              onClick={() => navigate(`/buyer/listings/${a.Listing?.listing_id}`)}
              className="card card-row card-clickable"
            >
              <div>
                <h3 style={{ marginBottom: '6px' }}>{a.Listing?.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                  {a.Listing?.city} — {a.Listing?.address}
                </p>
                <p style={{ fontSize: '14px', marginTop: '6px' }}>Date: {a.appointment_date}</p>
                {a.note && <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Note: {a.note}</p>}
                {a.Listing?.Agent?.email && (
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>
                    Agent: {a.Listing.Agent.full_name} · {a.Listing.Agent.email}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <Badge status={a.status} />
                {a.status === 'pending' && (
                  <button onClick={(e) => handleCancel(a.appointment_id, e)} className="btn btn-danger-soft btn-sm">
                    Cancel
                  </button>
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
