import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Home = () => {
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/listings')
      .then(res => {
        setListings(res.data.data)
        setFiltered(res.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = listings
    if (search) {
      result = result.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.city.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (typeFilter !== 'all') {
      result = result.filter(l => l.property_type === typeFilter)
    }
    setFiltered(result)
  }, [search, typeFilter, listings])

  if (loading) return <p style={{ padding: '40px' }}>Loading...</p>

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #1343b0 100%)',
        padding: '60px 32px', textAlign: 'center', color: '#fff'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
          Find Your Dream Property in Cambodia
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '32px' }}>
          Browse listings across Phnom Penh and beyond
        </p>

        {/* Search */}
        <div style={{
          display: 'flex', gap: '12px', maxWidth: '600px',
          margin: '0 auto', flexWrap: 'wrap'
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or city..."
            style={{
              flex: 1, padding: '14px 16px', borderRadius: '8px',
              border: 'none', fontSize: '15px', minWidth: '200px'
            }}
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              padding: '14px 16px', borderRadius: '8px',
              border: 'none', fontSize: '15px', background: '#fff'
            }}
          >
            <option value="all">All Types</option>
            <option value="condo">Condo</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="flat">Flat</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px' }}>
            {typeFilter === 'all' ? 'All Listings' : `${typeFilter}s`}
            <span style={{ color: '#6b7280', fontWeight: '400', fontSize: '16px', marginLeft: '8px' }}>
              ({filtered.length} found)
            </span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '60px' }}>
            No listings found.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {filtered.map(listing => (
              <div key={listing.listing_id} style={{
                background: '#fff', border: '1px solid #e5e7eb',
                borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s'
              }}>
                {/* Photo */}
          <div style={{ height: '180px', background: '#e5e7eb', overflow: 'hidden' }}>
            {listing.ListingPhotos?.length > 0 ? (
              <img
                src={listing.ListingPhotos[0].photo_path}
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                height: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>No photo</span>
              </div>
            )}
          </div>

                <div style={{ padding: '16px' }}>
                  {/* Status badge */}
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '600', marginBottom: '10px',
                    background: listing.status === 'available' ? '#d1fae5' : '#fef3c7',
                    color: listing.status === 'available' ? '#065f46' : '#92400e'
                  }}>{listing.status}</span>

                  <h3 style={{ fontSize: '16px', marginBottom: '6px', fontWeight: '700' }}>
                    {listing.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    {listing.city}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '12px' }}>
                    {listing.property_type} · {listing.Agent?.full_name}
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: '#1a56db', marginBottom: '16px' }}>
                    ${Number(listing.price).toLocaleString()}
                  </p>

                  <button
                    onClick={() => navigate(`/buyer/listings/${listing.listing_id}`)}
                    style={{
                      width: '100%', padding: '10px',
                      background: '#1a56db', color: '#fff',
                      border: 'none', borderRadius: '6px',
                      fontWeight: '600', fontSize: '14px'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home