import { useState, useEffect } from 'react'
import api from '../../services/api'
import Loading from '../../components/ui/Loading'
import StatCard from '../../components/ui/StatCard'

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

  if (loading) return <Loading />

  return (
    <div className="page">
      <h2 style={{ marginBottom: '24px' }}>Admin Dashboard</h2>
      <div className="grid-stats">
        <StatCard label="Total Buyers" value={stats.buyers} color="#106AA3" />
        <StatCard label="Total Agents" value={stats.agents} color="#7c3aed" />
        <StatCard label="Total Listings" value={stats.listings} color="#059669" />
        <StatCard label="Pending Reports" value={stats.reports} color="#dc2626" />
      </div>
    </div>
  )
}

export default Dashboard
