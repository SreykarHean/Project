import { useState, useEffect } from 'react'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

const Compare = () => {
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/buyers/comparisons')
      .then(res => setComparisons(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="page">
      <h2 style={{ marginBottom: '24px' }}>My Comparisons</h2>
      {comparisons.length === 0 ? (
        <EmptyState title="No comparisons saved yet." />
      ) : (
        <div className="stack">
          {comparisons.map(c => (
            <div key={c.compare_id} className="card">
              <p style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '8px' }}>
                Comparison #{c.compare_id}
              </p>
              <p style={{ fontWeight: '600' }}>
                Comparing listings: {Array.isArray(c.listing_ids)
                  ? c.listing_ids.join(', ')
                  : JSON.parse(c.listing_ids).join(', ')}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
                Saved on {formatDate(c.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Compare
