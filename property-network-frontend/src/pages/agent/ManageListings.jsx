import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

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

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>My Listings</h2>
        <button onClick={() => navigate('/agent/listings/create')} style={{
          padding: '10px 20px', background: '#1a56db', color: '#fff',
          border: 'none', borderRadius: '6px', fontWeight: '600'
        }}>+ New Listing</button>
      </div>

      {listings.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No listings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {listings.map(l => (
            <div key={l.listing_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ marginBottom: '4px' }}>{l.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>{l.city} — {l.property_type}</p>
                <p style={{ color: '#1a56db', fontWeight: '700', marginTop: '4px' }}>
                  ${Number(l.price).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                  background: l.status === 'available' ? '#d1fae5' : '#fef3c7',
                  color: l.status === 'available' ? '#065f46' : '#92400e'
                }}>{l.status}</span>
                <button onClick={() => navigate(`/agent/listings/edit/${l.listing_id}`)} style={{
                  padding: '8px 16px', background: '#f3f4f6', color: '#374151',
                  border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600'
                }}>Edit</button>
                <button onClick={() => handleDelete(l.listing_id)} style={{
                  padding: '8px 16px', background: '#fee2e2', color: '#ef4444',
                  border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600'
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageListings