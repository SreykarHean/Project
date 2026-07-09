import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { PROPERTY_TYPES } from '../../utils/constants'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Alert from '../../components/ui/Alert'
import ListingCard from '../../components/ui/ListingCard'

const Home = () => {
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/listings')
      .then(res => setListings(res.data.data))
      .catch(err => {
        console.error(err)
        setError('Could not load listings. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = listings.filter(l => {
    if (search &&
      !l.title.toLowerCase().includes(search.toLowerCase()) &&
      !l.city.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && l.property_type !== typeFilter) return false
    return true
  })

  if (loading) return <Loading />

  return (
    <div>
      <div className="hero">
        <h1>Find Your Dream Property in Cambodia</h1>
        <p>Browse listings across Phnom Penh and beyond</p>

        <div className="hero-search">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or city..."
            aria-label="Search listings"
            className="input"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            aria-label="Filter by property type"
            className="input"
          >
            <option value="all">All Types</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="page page-lg">
        {error && <Alert type="error">{error}</Alert>}

        <div className="page-header">
          <h2 style={{ fontSize: '22px' }}>
            {typeFilter === 'all' ? 'All Listings' : `${typeFilter}s`}
            <span style={{ color: 'var(--text-light)', fontWeight: '400', fontSize: '16px', marginLeft: '8px' }}>
              ({filtered.length} found)
            </span>
          </h2>
        </div>

        {!error && filtered.length === 0 ? (
          <EmptyState title="No listings found.">
            Try a different search or property type.
          </EmptyState>
        ) : (
          <div className="grid-cards">
            {filtered.map(listing => (
              <ListingCard
                key={listing.listing_id}
                photo={listing.ListingPhotos?.[0]?.photo_path}
                title={listing.title}
                city={listing.city}
                meta={`${listing.property_type} · ${listing.Agent?.full_name}`}
                price={listing.price}
                status={listing.status}
              >
                <button
                  onClick={() => navigate(`/buyer/listings/${listing.listing_id}`)}
                  className="btn btn-primary"
                >
                  View Details
                </button>
              </ListingCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
