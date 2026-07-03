import { useState, useEffect } from 'react'
import api from '../../services/api'

const ManageReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports')
      .then(res => setReports(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = async (id, status) => {
    try {
      await api.patch(`/reports/${id}`, { status })
      setReports(reports.map(r => r.report_id === id ? { ...r, status } : r))
    } catch (err) {
      console.error(err)
    }
  }

  const statusColor = (status) => {
    if (status === 'reviewed') return { bg: '#dbeafe', text: '#1e40af' }
    if (status === 'resolved') return { bg: '#d1fae5', text: '#065f46' }
    return { bg: '#fef3c7', text: '#92400e' }
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Manage Reports</h2>
      {reports.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No reports.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map(r => (
            <div key={r.report_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{r.report_type}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    By: {r.Buyer?.full_name} · Listing: {r.Listing?.title}
                  </p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>{r.reason}</p>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px',
                  fontWeight: '600', height: 'fit-content',
                  background: statusColor(r.status).bg,
                  color: statusColor(r.status).text
                }}>{r.status}</span>
              </div>
              {r.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleUpdate(r.report_id, 'reviewed')} style={{
                    padding: '7px 16px', background: '#dbeafe', color: '#1e40af',
                    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
                  }}>Mark Reviewed</button>
                  <button onClick={() => handleUpdate(r.report_id, 'resolved')} style={{
                    padding: '7px 16px', background: '#d1fae5', color: '#065f46',
                    border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600'
                  }}>Mark Resolved</button>
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