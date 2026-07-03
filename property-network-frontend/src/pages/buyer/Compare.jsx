import { useState, useEffect } from 'react'
import api from '../../services/api'

const Compare = () => {
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/buyers/comparisons')
      .then(res => setComparisons(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>My Comparisons</h2>
      {comparisons.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No comparisons saved yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comparisons.map(c => (
            <div key={c.compare_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '20px'
            }}>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                Comparison #{c.compare_id}
              </p>
              <p style={{ fontWeight: '600' }}>
                Comparing listings: {Array.isArray(c.listing_ids)
                  ? c.listing_ids.join(', ')
                  : JSON.parse(c.listing_ids).join(', ')}
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                Saved on {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Compare