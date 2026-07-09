import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { formatPrice } from '../../utils/helpers'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

const ManageListings = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/agents/listings')
      .then(res => setListings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(listings.filter(l => l.listing_id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Listings</h2>
        <button onClick={() => navigate('/agent/listings/create')} className="btn btn-primary">
          + New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="No listings yet.">
          Create your first listing to get started.
        </EmptyState>
      ) : (
        <div className="stack">
          {listings.map(l => (
            <div key={l.listing_id} className="card card-row">
              <div>
                <h3 style={{ marginBottom: '4px' }}>{l.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>{l.city} — {l.property_type}</p>
                <p className="price" style={{ marginTop: '4px' }}>{formatPrice(l.price)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Badge status={l.status} />
                <button onClick={() => navigate(`/agent/listings/${l.listing_id}`)} className="btn btn-soft btn-sm">
                  View
                </button>
                <button onClick={() => navigate(`/agent/listings/edit/${l.listing_id}`)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(l.listing_id)} className="btn btn-danger-soft btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageListings
