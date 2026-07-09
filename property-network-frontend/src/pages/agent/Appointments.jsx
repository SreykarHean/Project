import { useState, useEffect } from 'react'
import api from '../../services/api'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

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

  if (loading) return <Loading />

  return (
    <div className="page page-md">
      <h2 style={{ marginBottom: '24px' }}>Appointments</h2>
      {appointments.length === 0 ? (
        <EmptyState title="No appointments yet." />
      ) : (
        <div className="stack">
          {appointments.map(a => (
            <div key={a.appointment_id} className="card card-row">
              <div>
                <h3 style={{ marginBottom: '4px' }}>{a.Buyer?.full_name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                  {a.Buyer?.email} · {a.Buyer?.phone}
                </p>
                <p style={{ fontSize: '14px', marginTop: '6px' }}>
                  {a.Listing?.title} — {a.appointment_date}
                </p>
                {a.note && (
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '4px' }}>
                    Note: {a.note}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <Badge status={a.status} />
                {a.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleStatus(a.appointment_id, 'confirmed')} className="btn btn-success-soft btn-sm">
                      Confirm
                    </button>
                    <button onClick={() => handleStatus(a.appointment_id, 'cancelled')} className="btn btn-danger-soft btn-sm">
                      Cancel
                    </button>
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
