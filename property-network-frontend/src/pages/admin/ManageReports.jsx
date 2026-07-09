import { useState, useEffect } from 'react'
import api from '../../services/api'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

const ManageReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifyAgentMap, setNotifyAgentMap] = useState({})

  useEffect(() => {
    api.get('/reports')
      .then(res => setReports(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = async (id, status) => {
    try {
      const notifyAgent = !!notifyAgentMap[id]
      await api.patch(`/reports/${id}`, { status, notifyAgent })
      setReports(reports.map(r => r.report_id === id ? { ...r, status } : r))
    } catch (err) {
      console.error(err)
    }
  }

  const toggleNotifyAgent = (id) => {
    setNotifyAgentMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <h2 style={{ marginBottom: '24px' }}>Manage Reports</h2>
      {reports.length === 0 ? (
        <EmptyState title="No reports." />
      ) : (
        <div className="stack">
          {reports.map(r => (
            <div key={r.report_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{r.report_type}</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                    By: {r.Buyer?.full_name} · Listing: {r.Listing?.title}
                  </p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>{r.reason}</p>
                  {r.agent_response && (
                    <div className="answer-thread" style={{ marginTop: '10px', paddingLeft: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', marginBottom: '2px' }}>
                        Agent's response
                      </p>
                      <p style={{ fontSize: '14px' }}>{r.agent_response}</p>
                    </div>
                  )}
                </div>
                <Badge status={r.status} style={{ height: 'fit-content' }} />
              </div>
              {r.status !== 'resolved' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label className="checkbox-label" style={{ fontSize: '13px', color: 'var(--neutral-text)' }}>
                    <input
                      type="checkbox"
                      checked={!!notifyAgentMap[r.report_id]}
                      onChange={() => toggleNotifyAgent(r.report_id)}
                    />
                    Notify agent about this report
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {r.status === 'pending' && (
                      <button onClick={() => handleUpdate(r.report_id, 'reviewed')} className="btn btn-info-soft btn-sm">
                        Mark Reviewed
                      </button>
                    )}
                    <button onClick={() => handleUpdate(r.report_id, 'resolved')} className="btn btn-success-soft btn-sm">
                      Mark Resolved
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageReports
