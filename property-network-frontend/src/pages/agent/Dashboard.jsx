import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Dashboard = () => {
  const [listings, setListings] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/agents/listings'),
      api.get('/appointments/agent')
    ]).then(([listingsRes, appointmentsRes]) => {
      setListings(listingsRes.data.data)
      setAppointments(appointmentsRes.data.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Agent Dashboard</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Listings', value: listings.length },
          { label: 'Pending Appointments', value: appointments.filter(a => a.status === 'pending').length },
          { label: 'Active Listings', value: listings.filter(l => l.status === 'available').length },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '8px', padding: '24px', textAlign: 'center'
          }}>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#1a56db' }}>{stat.value}</p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>My Listings <span style={{ fontSize: '13px', color: '#1a56db', fontWeight: '400', cursor: 'pointer' }} onClick={() => navigate('/agent/listings')}>View All →</span></h3>
        <button onClick={() => navigate('/agent/listings/create')} style={{
          padding: '8px 16px', background: '#1a56db', color: '#fff',
          border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '14px'
        }}>+ New Listing</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {listings.slice(0, 3).map(l => (
          <div key={l.listing_id} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '8px', padding: '16px'
          }}>
            <h4 style={{ marginBottom: '6px' }}>{l.title}</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>{l.city}</p>
            <p style={{ color: '#1a56db', fontWeight: '700', marginBottom: '12px' }}>
              ${Number(l.price).toLocaleString()}
            </p>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '600',
              background: l.status === 'available' ? '#d1fae5' : '#fef3c7',
              color: l.status === 'available' ? '#065f46' : '#92400e'
            }}>{l.status}</span>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <h3 style={{ marginBottom: '16px' }}>Recent Appointments</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {appointments.slice(0, 3).map(a => (
          <div key={a.appointment_id} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '8px', padding: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <p style={{ fontWeight: '600' }}>{a.Buyer?.full_name}</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{a.Listing?.title} — {a.appointment_date}</p>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
              background: a.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
              color: a.status === 'confirmed' ? '#065f46' : '#92400e'
            }}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard