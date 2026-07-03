import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const SavedListings = () => {
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/buyers/saved')
      .then(res => setSaved(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (listingId) => {
    try {
      await api.delete(`/buyers/saved/${listingId}`)
      setSaved(saved.filter(s => s.listing_id !== listingId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Saved Listings</h2>
      {saved.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No saved listings yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {saved.map(s => (
            <div key={s.saved_id} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '8px', overflow: 'hidden'
            }}>
        <div style={{ height: '160px', background: '#f3f4f6', overflow: 'hidden' }}>
          {s.Listing?.ListingPhotos?.length > 0 ? (
            <img
              src={s.Listing.ListingPhotos[0].photo_path}
              alt={s.Listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>No photo</span>
            </div>
          )}
        </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ marginBottom: '6px', fontSize: '16px' }}>{s.Listing?.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>{s.Listing?.city}</p>
                <p style={{ color: '#1a56db', fontWeight: '700', fontSize: '16px', marginBottom: '12px' }}>
                  ${Number(s.Listing?.price).toLocaleString()}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                  Agent: {s.Listing?.Agent?.full_name}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => navigate(`/buyer/listings/${s.listing_id}`)} style={{
                    flex: 1, padding: '8px', background: '#1a56db', color: '#fff',
                    border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600'
                  }}>View</button>
                  <button onClick={() => handleUnsave(s.listing_id)} style={{
                    flex: 1, padding: '8px', background: '#fee2e2', color: '#ef4444',
                    border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600'
                  }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedListings