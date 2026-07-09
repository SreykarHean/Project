import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import ListingCard from '../../components/ui/ListingCard'

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

  if (loading) return <Loading />

  return (
    <div className="page">
      <h2 style={{ marginBottom: '24px' }}>Saved Listings</h2>
      {saved.length === 0 ? (
        <EmptyState title="No saved listings yet.">
          Browse listings and save the ones you like.
        </EmptyState>
      ) : (
        <div className="grid-cards">
          {saved.map(s => (
            <ListingCard
              key={s.saved_id}
              photo={s.Listing?.ListingPhotos?.[0]?.photo_path}
              title={s.Listing?.title}
              city={s.Listing?.city}
              meta={`Agent: ${s.Listing?.Agent?.full_name}`}
              price={s.Listing?.price}
            >
              <button onClick={() => navigate(`/buyer/listings/${s.listing_id}`)} className="btn btn-primary">
                View
              </button>
              <button onClick={() => handleUnsave(s.listing_id)} className="btn btn-danger-soft">
                Remove
              </button>
            </ListingCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedListings
