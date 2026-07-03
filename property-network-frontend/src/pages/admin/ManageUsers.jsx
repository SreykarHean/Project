import { useState, useEffect } from 'react'
import api from '../../services/api'

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

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  const tabStyle = (active) => ({
    padding: '10px 24px', border: 'none', cursor: 'pointer',
    fontWeight: '600', fontSize: '14px', borderBottom: active ? '2px solid #1a56db' : '2px solid transparent',
    background: 'none', color: active ? '#1a56db' : '#6b7280'
  })

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Manage Users</h2>

      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <button style={tabStyle(tab === 'buyers')} onClick={() => setTab('buyers')}>
          Buyers ({buyers.length})
        </button>
        <button style={tabStyle(tab === 'agents')} onClick={() => setTab('agents')}>
          Agents ({agents.length})
        </button>
      </div>

      {tab === 'buyers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {buyers.map(b => (
            <div key={b.buyer_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <p style={{ fontWeight: '600' }}>{b.full_name}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{b.email} · {b.phone}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                  background: b.status === 'active' ? '#d1fae5' : '#fee2e2',
                  color: b.status === 'active' ? '#065f46' : '#991b1b'
                }}>{b.status}</span>
                {b.status === 'active' ? (
                  <button onClick={() => handleBuyerStatus(b.buyer_id, 'suspended')} style={{
                    padding: '7px 14px', background: '#fee2e2', color: '#991b1b',
                    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
                  }}>Suspend</button>
                ) : (
                  <button onClick={() => handleBuyerStatus(b.buyer_id, 'active')} style={{
                    padding: '7px 14px', background: '#d1fae5', color: '#065f46',
                    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
                  }}>Activate</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'agents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agents.map(a => (
            <div key={a.agent_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <p style={{ fontWeight: '600' }}>{a.full_name}</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{a.email} · {a.agency_name}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                  background: a.is_verified ? '#d1fae5' : '#fef3c7',
                  color: a.is_verified ? '#065f46' : '#92400e'
                }}>{a.is_verified ? 'Verified' : 'Unverified'}</span>
                {!a.is_verified && (
                  <button onClick={() => handleVerifyAgent(a.agent_id)} style={{
                    padding: '7px 14px', background: '#dbeafe', color: '#1e40af',
                    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
                  }}>Verify</button>
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