import { useState, useEffect } from 'react'
import api from '../../services/api'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'

const ManageUsers = () => {
  const [buyers, setBuyers] = useState([])
  const [agents, setAgents] = useState([])
  const [tab, setTab] = useState('buyers')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/buyers'),
      api.get('/admin/agents')
    ]).then(([b, a]) => {
      setBuyers(b.data.data)
      setAgents(a.data.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleVerifyAgent = async (id) => {
    try {
      await api.put(`/admin/agents/${id}/verify`)
      setAgents(agents.map(a => a.agent_id === id ? { ...a, is_verified: true } : a))
    } catch (err) {
      console.error(err)
    }
  }

  const handleBuyerStatus = async (id, status) => {
    try {
      await api.put(`/admin/buyers/${id}/status`, { status })
      setBuyers(buyers.map(b => b.buyer_id === id ? { ...b, status } : b))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <h2 style={{ marginBottom: '24px' }}>Manage Users</h2>

      <div className="tabs">
        <button className={`tab${tab === 'buyers' ? ' active' : ''}`} onClick={() => setTab('buyers')}>
          Buyers ({buyers.length})
        </button>
        <button className={`tab${tab === 'agents' ? ' active' : ''}`} onClick={() => setTab('agents')}>
          Agents ({agents.length})
        </button>
      </div>

      {tab === 'buyers' && (
        <div className="stack">
          {buyers.map(b => (
            <div key={b.buyer_id} className="card card-row" style={{ padding: '16px' }}>
              <div>
                <p style={{ fontWeight: '600' }}>{b.full_name}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>{b.email} · {b.phone}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge status={b.status} />
                {b.status === 'active' ? (
                  <button onClick={() => handleBuyerStatus(b.buyer_id, 'banned')} className="btn btn-danger-soft btn-sm">
                    Suspend
                  </button>
                ) : (
                  <button onClick={() => handleBuyerStatus(b.buyer_id, 'active')} className="btn btn-success-soft btn-sm">
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'agents' && (
        <div className="stack">
          {agents.map(a => (
            <div key={a.agent_id} className="card card-row" style={{ padding: '16px' }}>
              <div>
                <p style={{ fontWeight: '600' }}>{a.full_name}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>{a.email} · {a.agency_name}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge variant={a.is_verified ? 'success' : 'warning'}>
                  {a.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
                {!a.is_verified && (
                  <button onClick={() => handleVerifyAgent(a.agent_id)} className="btn btn-info-soft btn-sm">
                    Verify
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

export default ManageUsers
