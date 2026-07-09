import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { formatPrice } from '../../utils/helpers'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'

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

  if (loading) return <Loading />

  return (
    <div className="page">
      <h2 style={{ marginBottom: '24px' }}>Agent Dashboard</h2>

      {/* Stats */}
      <div className="grid-stats" style={{ marginBottom: '32px' }}>
        <StatCard label="Total Listings" value={listings.length} />
        <StatCard label="Pending Appointments" value={appointments.filter(a => a.status === 'pending').length} />
        <StatCard label="Active Listings" value={listings.filter(l => l.status === 'available').length} />
      </div>

      {/* Recent Listings */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <h3>
          My Listings{' '}
          <Link to="/agent/listings" className="btn-link" style={{ fontSize: '13px', fontWeight: '400' }}>
            View All →
          </Link>
        </h3>
        <button onClick={() => navigate('/agent/listings/create')} className="btn btn-primary btn-sm">
          + New Listing
        </button>
      </div>

      <div className="grid-cards" style={{ gap: '16px', marginBottom: '32px' }}>
        {listings.slice(0, 3).map(l => (
          <div key={l.listing_id} className="card card-hover">
            <h4 style={{ marginBottom: '6px' }}>{l.title}</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '4px' }}>{l.city}</p>
            <p className="price" style={{ marginBottom: '12px' }}>{formatPrice(l.price)}</p>
            <Badge status={l.status} />
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <h3 style={{ marginBottom: '16px' }}>Recent Appointments</h3>
      <div className="stack">
        {appointments.slice(0, 3).map(a => (
          <div key={a.appointment_id} className="card card-row" style={{ padding: '16px' }}>
            <div>
              <p style={{ fontWeight: '600' }}>{a.Buyer?.full_name}</p>
              <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                {a.Listing?.title} — {a.appointment_date}
              </p>
            </div>
            <Badge status={a.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
