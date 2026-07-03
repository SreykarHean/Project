import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'

const ListingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then(res => setListing(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>
  if (!listing) return <p style={{ padding: '40px' }}>Listing not found.</p>

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate('/agent/listings')} style={{
        background: 'none', border: 'none', color: '#1a56db',
        fontWeight: '600', fontSize: '14px', marginBottom: '24px', padding: 0
      }}>← Back to Listings</button>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '6px' }}>{listing.title}</h2>
            <p style={{ color: '#6b7280' }}>{listing.city} — {listing.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1a56db' }}>
              ${Number(listing.price).toLocaleString()}
            </p>
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '600', marginTop: '6px',
              background: listing.status === 'available' ? '#d1fae5' : '#fef3c7',
              color: listing.status === 'available' ? '#065f46' : '#92400e'
            }}>{listing.status}</span>
          </div>
        </div>

        <p style={{ color: '#374151', marginBottom: '20px', lineHeight: '1.6' }}>{listing.description}</p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <span style={{
            padding: '6px 14px', background: '#f3f4f6',
            borderRadius: '6px', fontSize: '14px', fontWeight: '600'
          }}>{listing.property_type}</span>
        </div>

        {listing.ListingDetails && listing.ListingDetails.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '12px' }}>Property Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {listing.ListingDetails.map(d => (
                <div key={d.detail_id} style={{
                  background: '#f9fafb', padding: '12px',
                  borderRadius: '6px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>{d.feature_name}</p>
                  <p style={{ fontWeight: '700', fontSize: '16px' }}>{d.feature_value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={() => navigate(`/agent/listings/edit/${id}`)} style={{
            padding: '10px 24px', background: '#1a56db', color: '#fff',
            border: 'none', borderRadius: '6px', fontWeight: '600'
          }}>Edit Listing</button>
        </div>
      </div>
    </div>
  )
}

export default ListingDetail