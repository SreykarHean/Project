import { useState, useEffect } from 'react'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({ buyers: 0, agents: 0, listings: 0, reports: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/buyers'),
      api.get('/admin/agents'),
      api.get('/listings'),
      api.get('/reports')
    ]).then(([buyers, agents, listings, reports]) => {
      setStats({
        buyers: buyers.data.data.length,
        agents: agents.data.data.length,
        listings: listings.data.data.length,
        reports: reports.data.data.filter(r => r.status === 'pending').length
      })
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Admin Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Buyers', value: stats.buyers, color: '#1a56db' },
          { label: 'Total Agents', value: stats.agents, color: '#7c3aed' },
          { label: 'Total Listings', value: stats.listings, color: '#059669' },
          { label: 'Pending Reports', value: stats.reports, color: '#dc2626' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: '8px', padding: '24px', textAlign: 'center'
          }}>
            <p style={{ fontSize: '40px', fontWeight: '700', color: stat.color }}>{stat.value}</p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard